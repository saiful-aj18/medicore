import { NextResponse } from "next/server";
import { dbConnect, isDbConfigured } from "@/lib/mongodb";
import { EmergencyCase } from "@/lib/models";
import { ensureSeeded, toPlainList } from "@/lib/seed";
import { emergencyCases as seedCases } from "@/data/hospital";

// GET /api/emergency — demo mode returns the seed list.
export async function GET() {
  if (!isDbConfigured() || !(await dbConnect())) {
    return NextResponse.json({ mode: "demo", cases: seedCases.map((c) => ({ ...c, id: c.id })) });
  }
  await ensureSeeded();
  const docs = await EmergencyCase.find().sort({ arrived: 1 }).lean();
  const cases = toPlainList(docs).map((c) => ({ ...c, id: c.caseId }));
  return NextResponse.json({ mode: "db", cases });
}

// PATCH /api/emergency { id, status } — id is the case ID (E-201).
export async function PATCH(request) {
  if (!isDbConfigured() || !(await dbConnect())) {
    return NextResponse.json({ error: "Database not configured. Set MONGODB_URI." }, { status: 503 });
  }
  const { id, status } = await request.json().catch(() => ({}));
  if (!id || !["Waiting", "In Treatment", "Critical"].includes(status)) {
    return NextResponse.json({ error: "Valid case ID and status are required." }, { status: 400 });
  }
  const doc = await EmergencyCase.findOneAndUpdate({ caseId: id }, { status }, { new: true }).lean();
  if (!doc) return NextResponse.json({ error: "Case not found." }, { status: 404 });
  return NextResponse.json({ mode: "db", case: { ...doc, id: doc.caseId } });
}
