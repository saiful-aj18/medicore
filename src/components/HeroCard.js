"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DoctorArt from "./DoctorArt";

export default function HeroCard() {
  const router = useRouter();
  // Greet the signed-in staff member by name.
  const [name, setName] = useState("Dr. Johnson");
  const [isDoctor, setIsDoctor] = useState(false);
  // A doctor sees their own numbers here, not the hospital-wide ones.
  const [myAppts, setMyAppts] = useState(null);
  const [myPatients, setMyPatients] = useState(null);
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user?.name) setName(data.user.name);
        if (data?.user?.role === "doctor") setIsDoctor(true);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isDoctor) return;
    fetch("/api/appointments")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.appointments) setMyAppts(data.appointments);
      })
      .catch(() => {});
    fetch("/api/patients")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.patients) setMyPatients(data.patients);
      })
      .catch(() => {});
  }, [isDoctor]);

  const upcoming = (myAppts || []).filter((a) => a.status === "Upcoming").length;
  const critical = (myPatients || []).filter((p) => p.status === "Critical").length;

  return (
    <section className="card hero span-8">
      <div className="hero-text">
        <p className="eyebrow">Good morning</p>
        <h1>Here&apos;s how the hospital stands, {name}.</h1>
        {isDoctor ? (
          <p>
            {myAppts === null
              ? "Loading your schedule…"
              : `${upcoming} upcoming appointment${upcoming === 1 ? "" : "s"} today · ${myPatients?.length ?? 0} patients under your care${critical > 0 ? ` · ${critical} critical` : ""}.`}
          </p>
        ) : (
          <p>
            18 appointments today · ICU trending toward 90% by evening · 3
            medicines running low.
          </p>
        )}
        <div className="hero-actions">
          <button type="button" className="btn-primary" onClick={() => router.push("/appointments")}>
            View Schedule
          </button>
          {isDoctor ? (
            <button type="button" className="btn-ghost" onClick={() => router.push("/patients")}>
              My Patients
            </button>
          ) : (
            <button type="button" className="btn-ghost" onClick={() => router.push("/beds")}>
              Review ICU Status
            </button>
          )}
        </div>
      </div>
      <DoctorArt />
    </section>
  );
}
