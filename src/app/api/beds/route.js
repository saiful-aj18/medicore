import { NextResponse } from "next/server";
import { dbConnect, isDbConfigured } from "@/lib/mongodb";
import { Ward } from "@/lib/models";
import { ensureSeeded, toPlainList } from "@/lib/seed";
import { wards as seedWards } from "@/data/hospital";

function bedStatus(index, occupiedCount) {
  if (index < occupiedCount) return "occupied";
  if (index === occupiedCount) return "cleaning";
  return "available";
}

// GET /api/beds — demo mode returns the seed wards with bed statuses.
export async function GET() {
  if (!isDbConfigured() || !(await dbConnect())) {
    const wards = seedWards.map((w) => {
      const sampleOccupied = Math.round((w.occupied / w.total) * w.beds.length);
      return {
        ...w,
        id: w.name,
        beds: w.beds.map((label, i) => ({ label, status: bedStatus(i, sampleOccupied) })),
      };
    });
    return NextResponse.json({ mode: "demo", wards });
  }
  await ensureSeeded();
  const docs = await Ward.find().sort({ name: 1 }).lean();
  const wards = toPlainList(docs).map((w) => ({ ...w, id: w.name }));
  return NextResponse.json({ mode: "db", wards });
}

// PATCH /api/beds { ward, bed, status } — set one bed's status and
// adjust the ward's occupied count to match.
export async function PATCH(request) {
  if (!isDbConfigured() || !(await dbConnect())) {
    return NextResponse.json({ error: "Database not configured. Set MONGODB_URI." }, { status: 503 });
  }
  const { ward, bed, status } = await request.json().catch(() => ({}));
  if (!ward || !bed || !["occupied", "available", "cleaning"].includes(status)) {
    return NextResponse.json({ error: "Valid ward, bed and status are required." }, { status: 400 });
  }
  const doc = await Ward.findOne({ name: ward });
  if (!doc) return NextResponse.json({ error: "Ward not found." }, { status: 404 });
  const target = doc.beds.find((b) => b.label === bed);
  if (!target) return NextResponse.json({ error: "Bed not found." }, { status: 404 });
  if (target.status !== status) {
    if (target.status === "occupied") doc.occupied = Math.max(0, doc.occupied - 1);
    if (status === "occupied") doc.occupied = Math.min(doc.total, doc.occupied + 1);
    target.status = status;
    await doc.save();
  }
  return NextResponse.json({ mode: "db", ward: { ...doc.toObject(), id: doc.name } });
}
