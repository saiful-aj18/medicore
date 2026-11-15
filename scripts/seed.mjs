// Seed the MongoDB database with MediCare demo data.
// Usage:
//   MONGODB_URI="mongodb+srv://..." npm run db:seed
//   # or put MONGODB_URI in .env.local first, then:
//   npm run db:seed
// Safe to run more than once — it only fills empty collections.

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import mongoose from "mongoose";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Load .env.local if present (simple KEY=VALUE parser, no dependency).
if (!process.env.MONGODB_URI) {
  const envPath = join(root, ".env.local");
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set. Put it in .env.local or pass it inline:");
  console.error('  MONGODB_URI="mongodb+srv://<user>:<pass>@<cluster>/medicare" npm run db:seed');
  process.exit(1);
}

const { ensureSeeded } = await import("../src/lib/seed.js");
const { Patient, Doctor, Appointment, Medicine, EmergencyCase, Ward, StaffUser } =
  await import("../src/lib/models.js");

await ensureSeeded();
console.log("Seeded:");
console.log("  patients:    ", await Patient.countDocuments());
console.log("  doctors:     ", await Doctor.countDocuments());
console.log("  appointments:", await Appointment.countDocuments());
console.log("  medicines:   ", await Medicine.countDocuments());
console.log("  emergencies: ", await EmergencyCase.countDocuments());
console.log("  wards:       ", await Ward.countDocuments());
console.log("  staff users: ", await StaffUser.countDocuments());
await mongoose.disconnect();
console.log("Done.");
