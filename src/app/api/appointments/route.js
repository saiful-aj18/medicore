import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { dbConnect, isDbConfigured } from "@/lib/mongodb";
import { Appointment } from "@/lib/models";
import { ensureSeeded, toPlainList } from "@/lib/seed";
import { allAppointments as seedAppointments } from "@/data/hospital";
import { COOKIE_NAME, verifySession } from "@/lib/auth";

// Who is calling — a doctor only ever gets their own appointments.
async function getSession() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  return token ? verifySession(token) : null;
}

function scopeForDoctor(appointments, session) {
  if (session?.role === "doctor" && session?.name) {
    return appointments.filter((a) => a.doctor === session.name);
  }
  return appointments;
}

// GET /api/appointments?search= — list appointments, newest first.
// ?search= matches booking ID, phone or patient name (status check page).
// A doctor only receives their own appointments. Note: the public
// /book status check uses ?search=, so a search still works for a
// patient looking up their own booking.
export async function GET(request) {
  const search = new URL(request.url).searchParams.get("search")?.trim() || "";
  const session = await getSession();
  if (!isDbConfigured() || !(await dbConnect())) {
    const list = seedAppointments.map((a) => ({
      ...a, date: "Today", source: "Walk-in", id: `seed:${a.time}:${a.patient}`,
    }));
    const filtered = search
      ? list.filter((a) => a.patient.toLowerCase().includes(search.toLowerCase()))
      : list;
    // A plain staff list (no ?search=) is scoped to the doctor's own
    // appointments; a ?search= lookup is left alone so patients can
    // still check their booking status on /book.
    return NextResponse.json({ mode: "demo", appointments: search ? filtered : scopeForDoctor(filtered, session) });
  }
  await ensureSeeded();
  const query = {};
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [{ bookingId: rx }, { phone: rx }, { patient: rx }];
  }
  const docs = await Appointment.find(query).sort({ createdAt: -1 }).lean();
  const appointments = toPlainList(docs);
  return NextResponse.json({ mode: "db", appointments: search ? appointments : scopeForDoctor(appointments, session) });
}

// POST /api/appointments — create a booking (public /book page) or a
// walk-in appointment. Needs the database; without it the client falls
// back to saving the booking in the browser.
export async function POST(request) {
  if (!isDbConfigured() || !(await dbConnect())) {
    return NextResponse.json(
      { error: "Database not configured. Set MONGODB_URI to save bookings." },
      { status: 503 }
    );
  }
  const body = await request.json().catch(() => ({}));
  const { bookingId, patient, phone, age, department, doctor, date, time, reason, fee, type, paymentMethod, paymentStatus, paymentId } = body;
  if (!patient?.trim() || !department || !doctor || !time) {
    return NextResponse.json({ error: "Patient, department, doctor and time are required." }, { status: 400 });
  }
  await ensureSeeded();
  const doc = await Appointment.create({
    bookingId: bookingId || null,
    time,
    date: date || "Today",
    patient: String(patient).trim(),
    phone: phone || "",
    age: age || "",
    department,
    doctor,
    type: type || "Online Booking",
    reason: reason || "",
    fee: Number(fee) || 0,
    status: "Upcoming",
    paymentMethod: paymentMethod || "",
    paymentStatus: paymentStatus || "",
    paymentId: paymentId || null,
    source: bookingId ? "Online" : "Walk-in",
  });
  return NextResponse.json({ mode: "db", appointment: doc.toObject() }, { status: 201 });
}

// PATCH /api/appointments { id, patient, time, status } — Complete/Cancel.
// id can be a Mongo _id, a bookingId (MC-1234), or a seed id.
// A doctor may only change the status of their own appointments.
export async function PATCH(request) {
  if (!isDbConfigured() || !(await dbConnect())) {
    return NextResponse.json({ error: "Database not configured. Set MONGODB_URI." }, { status: 503 });
  }
  const { id, patient, time, status } = await request.json().catch(() => ({}));
  if (!["Upcoming", "Completed", "Cancelled"].includes(status)) {
    return NextResponse.json({ error: "Valid status is required." }, { status: 400 });
  }
  let doc = null;
  if (id && mongoose.isValidObjectId(id)) doc = await Appointment.findById(id);
  if (!doc && id && String(id).startsWith("MC-")) doc = await Appointment.findOne({ bookingId: id });
  if (!doc && id && String(id).startsWith("seed:")) {
    const [, t, p] = String(id).split(":");
    doc = await Appointment.findOne({ time: t, patient: p });
  }
  if (!doc && patient && time) doc = await Appointment.findOne({ patient, time });
  if (!doc) return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
  const session = await getSession();
  if (session?.role === "doctor" && session?.name && doc.doctor !== session.name) {
    return NextResponse.json(
      { error: "A doctor may only update their own appointments." },
      { status: 403 }
    );
  }
  doc.status = status;
  await doc.save();
  return NextResponse.json({ mode: "db", appointment: doc.toObject() });
}
