import { NextResponse } from "next/server";
import { COOKIE_NAME, verifySession } from "./lib/auth";

// Everything under the staff OPS area needs a valid login.
// Public pages: / (landing), /book, /login and the API routes.
const PROTECTED = [
  "/dashboard",
  "/patients",
  "/doctors",
  "/appointments",
  "/beds",
  "/emergency",
  "/pharmacy",
  "/analytics",
  "/settings",
];

// Pages only an admin may open. A doctor gets a smaller set —
// Dashboard, My Patients, Appointments and the public /book page —
// so a doctor never sees the full hospital admin area.
const ADMIN_ONLY = [
  "/doctors",
  "/beds",
  "/emergency",
  "/pharmacy",
  "/analytics",
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifySession(token) : null;
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role check: a doctor who types an admin-only address is sent
  // back to their own dashboard instead of opening the page.
  if (session.role === "doctor") {
    const isAdminOnly = ADMIN_ONLY.some(
      (p) => pathname === p || pathname.startsWith(p + "/")
    );
    if (isAdminOnly) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/patients/:path*",
    "/doctors/:path*",
    "/appointments/:path*",
    "/beds/:path*",
    "/emergency/:path*",
    "/pharmacy/:path*",
    "/analytics/:path*",
    "/settings/:path*",
  ],
};
