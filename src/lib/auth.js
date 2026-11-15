import { SignJWT, jwtVerify } from "jose";

export const COOKIE_NAME = "medicare_token";

function secret() {
  // Set JWT_SECRET in .env.local (32+ random chars) for production.
  // The fallback below is for demo only — change it before going live.
  return new TextEncoder().encode(
    process.env.JWT_SECRET || "medicare-dev-secret-change-me-before-production"
  );
}

export async function signSession(user) {
  return new SignJWT({ email: user.email, name: user.name, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret());
}

export async function verifySession(token) {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload;
  } catch {
    return null;
  }
}
