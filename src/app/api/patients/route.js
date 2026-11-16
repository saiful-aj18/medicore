import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { dbConnect, isDbConfigured } from "@/lib/mongodb";
import { Patient } from "@/lib/models";
import { ensureSeeded, toPlainList } from "@/lib/seed";
import { patients as seedPatients } from "@/data/hospital";
import { COOKIE_NAME, verifySession } from "@/lib/auth";

// Who is calling — a doctor only ever gets their own patients.
async function getSession() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  return token ? verifySession(token) : null;
}

function scopeForDoctor(patients, session) {
  if (session?.role === "doctor" && session?.name) {
    return patients.filter((p) => p.doctor === session.name);
  }
  return patients;
}

// GET /api/patients — list patients (newest first). A doctor only
// receives the patients assigned to them, never the whole hospital.
// Demo mode (no MONGODB_URI): returns the seed list.
export async function GET() {
  const session = await getSession();
  if (!isDbConfigured() || !(await dbConnect())) {
    return NextResponse.json({ mode: "demo", patients: scopeForDoctor(seedPatients, session) });
  }
  await ensureSeeded();
  const docs = await Patient.find().sort({ createdAt: -1 }).lean();
  const patients = toPlainList(docs).map((p) => ({ ...p, id: p.patientId }));
  return NextResponse.json({ mode: "db", patients: scopeForDoctor(patients, session) });
}

// POST /api/patients — admit a patient. Admin only: a doctor may not
// admit patients. Needs the database; without it the client falls back
// to saving in the browser.
// Admitting a patient also books their first appointment with the
// assigned doctor — otherwise the patient would exist on the Patients
// list but never appear on the doctor's schedule, which is exactly the
// confusion that used to happen. The appointment time comes from the
// form (appointmentTime) and defaults to 10:00 AM.
export async function POST(request) {
  const session = await getSession();
  if (session?.role === "doctor") {
    return NextResponse.json(
      { error: "Only an admin may admit a patient." },
      { status: 403 }
    );
  }
  if (!isDbConfigured() || !(await dbConnect())) {
    return NextResponse.json(
      { error: "Database not configured. Set MONGODB_URI to save patients." },
      { status: 503 }
    );
  }
  const body = await request.json().catch(() => ({}));
  const { name, age, gender, department, doctor, condition, phone, appointmentTime } = body;
  if (!name?.trim() || !age || !department || !doctor) {
    return NextResponse.json({ error: "Name, age, department and doctor are required." }, { status: 400 });
  }
  await ensureSeeded();
  const count = await Patient.countDocuments();
  const doc = await Patient.create({
    patientId: `P-${1052 + count}`,
    name: String(name).trim(),
    age: Number(age),
    gender: gender || "Male",
    phone: phone || "",
    department,
    doctor,
    admitted: "Today",
    status: "Admitted",
    condition: (condition || "").trim() || "Under observation",
  });
  const patient = { ...doc.toObject(), id: doc.patientId };
  delete patient._id;
  delete patient.__v;
  // First appointment for the new patient, so the assigned doctor sees
  // them on their schedule right away.
  const { Appointment } = await import("@/lib/models");
  await Appointment.create({
    bookingId: null,
    time: appointmentTime || "10:00 AM",
    date: "Today",
    patient: patient.name,
    phone: patient.phone || "",
    age: String(patient.age),
    department: patient.department,
    doctor: patient.doctor,
    type: "Consultation",
    reason: patient.condition,
    fee: 0,
    status: "Upcoming",
    paymentMethod: "",
    paymentStatus: "",
    paymentId: null,
    source: "Walk-in",
  });
  return NextResponse.json({ mode: "db", patient }, { status: 201 });
}
