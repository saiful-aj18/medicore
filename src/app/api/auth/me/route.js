import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySession } from "@/lib/auth";

// GET /api/auth/me — who is signed in (from the JWT cookie).
export async function GET() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  const session = token ? await verifySession(token) : null;
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  return NextResponse.json({
    user: { name: session.name, email: session.email, role: session.role },
  });
}
