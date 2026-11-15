import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect, isDbConfigured } from "@/lib/mongodb";
import { Appointment } from "@/lib/models";
import { ensureSeeded, toPlainList } from "@/lib/seed";
import { allAppointments as seedAppointments } from "@/data/hospital";

// GET /api/appointments?search= — list appointments, newest first.
// ?search= matches booking ID, phone or patient name (status check page).
export async function GET(request) {
  const search = new URL(request.url).searchParams.get("search")?.trim() || "";
  if (!isDbConfigured() || !(await dbConnect())) {
    const list = seedAppointments.map((a) => ({
      ...a, date: "Today", source: "Walk-in", id: `seed:${a.time}:${a.patient}`,
    }));
    const filtered = search
      ? list.filter((a) => a.patient.toLowerCase().includes(search.toLowerCase()))
      : list;
    return NextResponse.json({ mode: "demo", appointments: filtered });
  }
  await ensureSeeded();
  const query = {};
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [{ bookingId: rx }, { phone: rx }, { patient: rx }];
  }
  const docs = await Appointment.find(query).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ mode: "db", appointments: toPlainList(docs) });
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
  doc.status = status;
  await doc.save();
  return NextResponse.json({ mode: "db", appointment: doc.toObject() });
}
