// MongoDB connection (Mongoose) with a cached connection for Next.js.
// When MONGODB_URI is not set, dbConnect() returns null and the app runs
// in demo mode (seed data from src/data/, browser localStorage).
// Set MONGODB_URI in .env.local (local) or Vercel env vars (live).

import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

let cached = globalThis.__medicoreMongoose;
if (!cached) {
  cached = globalThis.__medicoreMongoose = { conn: null, promise: null };
}

export function isDbConfigured() {
  return Boolean(uri);
}

export async function dbConnect() {
  if (!uri) return null;
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        // Fail fast when Atlas is unreachable so pages fall back to demo data.
        serverSelectionTimeoutMS: 5000,
      })
      .then((m) => m);
  }
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    console.error("[medicore] MongoDB connection failed:", err.message);
    return null;
  }
}
