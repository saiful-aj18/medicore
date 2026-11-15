import { NextResponse } from "next/server";
import { dbConnect, isDbConfigured } from "@/lib/mongodb";
import { Medicine } from "@/lib/models";
import { ensureSeeded, toPlainList } from "@/lib/seed";
import { medicines as seedMedicines } from "@/data/hospital";

// GET /api/medicines — demo mode returns the seed list.
export async function GET() {
  if (!isDbConfigured() || !(await dbConnect())) {
    return NextResponse.json({ mode: "demo", medicines: seedMedicines.map((m) => ({ ...m, id: m.name })) });
  }
  await ensureSeeded();
  const docs = await Medicine.find().sort({ name: 1 }).lean();
  const medicines = toPlainList(docs).map((m) => ({ ...m, id: m.name }));
  return NextResponse.json({ mode: "db", medicines });
}

// PATCH /api/medicines { name, action: "reorder" } — restock +100 units
// and mark back In Stock.
export async function PATCH(request) {
  if (!isDbConfigured() || !(await dbConnect())) {
    return NextResponse.json({ error: "Database not configured. Set MONGODB_URI." }, { status: 503 });
  }
  const { name, action } = await request.json().catch(() => ({}));
  if (!name || action !== "reorder") {
    return NextResponse.json({ error: "Valid name and action=reorder are required." }, { status: 400 });
  }
  const doc = await Medicine.findOne({ name });
  if (!doc) return NextResponse.json({ error: "Medicine not found." }, { status: 404 });
  doc.stock += 100;
  doc.status = "In Stock";
  await doc.save();
  return NextResponse.json({ mode: "db", medicine: { ...doc.toObject(), id: doc.name } });
}
