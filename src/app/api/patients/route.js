import { NextResponse } from "next/server";
import { dbConnect, isDbConfigured } from "@/lib/mongodb";
import { Patient } from "@/lib/models";
import { ensureSeeded, toPlainList } from "@/lib/seed";
import { patients as seedPatients } from "@/data/hospital";

// GET /api/patients — list all patients (newest first).
// Demo mode (no MONGODB_URI): returns the seed list.
export async function GET() {
  if (!isDbConfigured() || !(await dbConnect())) {
    return NextResponse.json({ mode: "demo", patients: seedPatients });
  }
  await ensureSeeded();
  const docs = await Patient.find().sort({ createdAt: -1 }).lean();
  const patients = toPlainList(docs).map((p) => ({ ...p, id: p.patientId }));
  return NextResponse.json({ mode: "db", patients });
}

// POST /api/patients — admit a patient. Needs the database;
// without it the client falls back to saving in the browser.
export async function POST(request) {
  if (!isDbConfigured() || !(await dbConnect())) {
    return NextResponse.json(
      { error: "Database not configured. Set MONGODB_URI to save patients." },
      { status: 503 }
    );
  }
  const body = await request.json().catch(() => ({}));
  const { name, age, gender, department, doctor, condition, phone } = body;
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
  return NextResponse.json({ mode: "db", patient }, { status: 201 });
}
