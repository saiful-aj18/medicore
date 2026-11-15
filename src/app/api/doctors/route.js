import { NextResponse } from "next/server";
import { dbConnect, isDbConfigured } from "@/lib/mongodb";
import { Doctor } from "@/lib/models";
import { ensureSeeded, toPlainList } from "@/lib/seed";
import { doctors as seedDoctors } from "@/data/hospital";

// GET /api/doctors — demo mode returns the seed list.
export async function GET() {
  if (!isDbConfigured() || !(await dbConnect())) {
    return NextResponse.json({ mode: "demo", doctors: seedDoctors.map((d) => ({ ...d, id: d.name })) });
  }
  await ensureSeeded();
  const docs = await Doctor.find().sort({ name: 1 }).lean();
  const doctors = toPlainList(docs).map((d) => ({ ...d, id: d.name }));
  return NextResponse.json({ mode: "db", doctors });
}

// PATCH /api/doctors { name, status } — toggle on/off duty.
export async function PATCH(request) {
  if (!isDbConfigured() || !(await dbConnect())) {
    return NextResponse.json({ error: "Database not configured. Set MONGODB_URI." }, { status: 503 });
  }
  const { name, status } = await request.json().catch(() => ({}));
  if (!name || !["On Duty", "Off Duty", "On Leave"].includes(status)) {
    return NextResponse.json({ error: "Valid name and status are required." }, { status: 400 });
  }
  const doc = await Doctor.findOneAndUpdate({ name }, { status }, { new: true }).lean();
  if (!doc) return NextResponse.json({ error: "Doctor not found." }, { status: 404 });
  return NextResponse.json({ mode: "db", doctor: { ...doc, id: doc.name } });
}
