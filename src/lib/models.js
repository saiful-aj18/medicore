// Mongoose models for MediCore. One collection per hospital area.
// `mongoose.models.X ||` keeps Next.js hot-reload from redefining models.

import mongoose from "mongoose";

const { Schema } = mongoose;

const patientSchema = new Schema(
  {
    patientId: { type: String, required: true, unique: true }, // "P-1042"
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, default: "Male" },
    phone: { type: String, default: "" },
    department: { type: String, required: true },
    doctor: { type: String, required: true },
    admitted: { type: String, default: "Today" },
    status: { type: String, default: "Admitted" }, // Admitted | Critical | Recovering | Discharged
    condition: { type: String, default: "Under observation" },
  },
  { timestamps: true }
);

const doctorSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    specialty: { type: String, required: true },
    experience: { type: String, default: "" },
    patientsToday: { type: Number, default: 0 },
    rating: { type: Number, default: 5 },
    status: { type: String, default: "On Duty" }, // On Duty | Off Duty | On Leave
    nextFree: { type: String, default: "" },
  },
  { timestamps: true }
);

const appointmentSchema = new Schema(
  {
    bookingId: { type: String, default: null }, // "MC-1234" for online bookings
    time: { type: String, required: true },
    date: { type: String, default: "Today" },
    patient: { type: String, required: true },
    phone: { type: String, default: "" },
    age: { type: String, default: "" },
    department: { type: String, required: true },
    doctor: { type: String, required: true },
    type: { type: String, default: "Consultation" }, // Consultation | Follow-up | Check-up | Online Booking ...
    reason: { type: String, default: "" },
    fee: { type: Number, default: 0 },
    status: { type: String, default: "Upcoming" }, // Upcoming | Completed | Cancelled
    paymentMethod: { type: String, default: "" },
    paymentStatus: { type: String, default: "" },
    paymentId: { type: String, default: null },
    source: { type: String, default: "Walk-in" }, // Walk-in | Online
  },
  { timestamps: true }
);

const medicineSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    unit: { type: String, default: "tablets" },
    status: { type: String, default: "In Stock" }, // In Stock | Low Stock | Critical
  },
  { timestamps: true }
);

const emergencyCaseSchema = new Schema(
  {
    caseId: { type: String, required: true, unique: true }, // "E-201"
    patient: { type: String, required: true },
    case: { type: String, required: true },
    bed: { type: String, required: true },
    doctor: { type: String, required: true },
    arrived: { type: String, default: "" },
    priority: { type: String, default: "Medium" }, // High | Medium | Low
    status: { type: String, default: "Waiting" }, // Waiting | In Treatment | Critical
  },
  { timestamps: true }
);

const wardSchema = new Schema(
  {
    name: { type: String, required: true, unique: true }, // ICU | General | Private
    total: { type: Number, required: true },
    occupied: { type: Number, required: true },
    beds: [
      {
        label: { type: String, required: true },
        status: { type: String, default: "available" }, // occupied | available | cleaning
      },
    ],
  },
  { timestamps: true }
);

const staffUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, default: "doctor" }, // admin | doctor
    passwordHash: { type: String, required: true }, // bcrypt hash, never plaintext
  },
  { timestamps: true }
);

export const Patient = mongoose.models.Patient || mongoose.model("Patient", patientSchema);
export const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);
export const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);
export const Medicine = mongoose.models.Medicine || mongoose.model("Medicine", medicineSchema);
export const EmergencyCase = mongoose.models.EmergencyCase || mongoose.model("EmergencyCase", emergencyCaseSchema);
export const Ward = mongoose.models.Ward || mongoose.model("Ward", wardSchema);
export const StaffUser = mongoose.models.StaffUser || mongoose.model("StaffUser", staffUserSchema);
