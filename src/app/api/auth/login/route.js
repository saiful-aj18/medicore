import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { COOKIE_NAME, signSession } from "@/lib/auth";
import { findUser } from "@/lib/users";
import { dbConnect } from "@/lib/mongodb";
import { StaffUser } from "@/lib/models";
import { ensureSeeded } from "@/lib/seed";

// Simple in-memory login rate limit: 5 failed attempts per 15 minutes
// per (IP + email). Real deployments should use Upstash/Redis like Orderly.
const attempts = new Map();

function bucketKey(request, email) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  return `${ip}:${String(email).toLowerCase()}`;
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const key = bucketKey(request, email);
  const now = Date.now();
  const record = attempts.get(key) || { count: 0, resetAt: now + 15 * 60 * 1000 };
  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + 15 * 60 * 1000;
  }
  if (record.count >= 5) {
    return NextResponse.json(
      { error: "Too many failed attempts. Try again in 15 minutes." },
      { status: 429 }
    );
  }

  // Staff accounts live in MongoDB when it is connected (seeded with the
  // two demo accounts on first use); otherwise fall back to the demo
  // accounts in src/lib/users.js.
  let user = null;
  if (await dbConnect()) {
    await ensureSeeded();
    const dbUser = await StaffUser.findOne({ email: String(email).toLowerCase() }).lean();
    if (dbUser) user = { email: dbUser.email, name: dbUser.name, role: dbUser.role, passwordHash: dbUser.passwordHash };
  }
  if (!user) user = findUser(email);

  // Generic error on purpose — never reveal whether the email exists.
  const ok = user ? await bcrypt.compare(String(password), user.passwordHash) : false;
  if (!ok) {
    record.count += 1;
    attempts.set(key, record);
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }
  attempts.delete(key);

  const token = await signSession(user);
  const res = NextResponse.json({
    ok: true,
    user: { name: user.name, email: user.email, role: user.role },
  });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 8 * 60 * 60,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
