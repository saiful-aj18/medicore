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
