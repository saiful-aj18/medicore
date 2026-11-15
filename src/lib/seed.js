// Seeds the database with the demo data from src/data/hospital.js the
// first time it is empty, so a fresh MongoDB looks exactly like the demo.
// Safe to call on every API request — it only inserts when a collection
// is empty. Also seeds the two demo staff accounts.

import { dbConnect } from "./mongodb.js";
import {
  Appointment,
  Doctor,
  EmergencyCase,
  Medicine,
  Patient,
  StaffUser,
  Ward,
} from "./models.js";
import {
  allAppointments,
  doctors,
  emergencyCases,
  medicines,
  patients,
  wards,
} from "../data/hospital.js";
import { users } from "./users.js";

function bedStatus(index, occupiedCount) {
  if (index < occupiedCount) return "occupied";
  if (index === occupiedCount) return "cleaning";
  return "available";
}

export async function ensureSeeded() {
  const conn = await dbConnect();
  if (!conn) return false;

  if ((await Patient.countDocuments()) === 0) {
    await Patient.insertMany(
      patients.map((p) => ({
        patientId: p.id,
        name: p.name,
        age: p.age,
        gender: p.gender,
        department: p.department,
        doctor: p.doctor,
        admitted: p.admitted,
        status: p.status,
        condition: p.condition,
      }))
    );
  }

  if ((await Doctor.countDocuments()) === 0) {
    await Doctor.insertMany(doctors);
  }

  if ((await Appointment.countDocuments()) === 0) {
    await Appointment.insertMany(
      allAppointments.map((a) => ({ ...a, date: "Today", source: "Walk-in" }))
    );
  }

  if ((await Medicine.countDocuments()) === 0) {
    await Medicine.insertMany(medicines);
  }

  if ((await EmergencyCase.countDocuments()) === 0) {
    await EmergencyCase.insertMany(
      emergencyCases.map((c) => ({
        caseId: c.id,
        patient: c.patient,
        case: c.case,
        bed: c.bed,
        doctor: c.doctor,
        arrived: c.arrived,
        priority: c.priority,
        status: c.status,
      }))
    );
  }

  if ((await Ward.countDocuments()) === 0) {
    await Ward.insertMany(
      wards.map((w) => {
        const sampleOccupied = Math.round((w.occupied / w.total) * w.beds.length);
        return {
          name: w.name,
          total: w.total,
          occupied: w.occupied,
          beds: w.beds.map((label, i) => ({ label, status: bedStatus(i, sampleOccupied) })),
        };
      })
    );
  }

  if ((await StaffUser.countDocuments()) === 0) {
    await StaffUser.insertMany(
      users.map((u) => ({ email: u.email, name: u.name, role: u.role, passwordHash: u.passwordHash }))
    );
  }

  return true;
}

// Plain-object serializer: _id -> id, drop __v.
export function toPlain(doc) {
  if (!doc) return doc;
  const o = typeof doc.toObject === "function" ? doc.toObject() : { ...doc };
  if (o._id) o.id = String(o._id);
  delete o._id;
  delete o.__v;
  return o;
}

export function toPlainList(docs) {
  return docs.map(toPlain);
}
