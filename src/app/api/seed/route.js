import { NextResponse } from "next/server";
import { dbConnect, isDbConfigured } from "@/lib/mongodb";
import { ensureSeeded } from "@/lib/seed";

// POST /api/seed — (re)seed an empty database with the demo data.
// Returns { seeded: true } when a database is connected, or 503 in demo mode.
export async function POST() {
  if (!isDbConfigured() || !(await dbConnect())) {
    return NextResponse.json(
      { error: "Database not configured. Set MONGODB_URI first." },
      { status: 503 }
    );
  }
  await ensureSeeded();
  return NextResponse.json({ ok: true, seeded: true });
}
