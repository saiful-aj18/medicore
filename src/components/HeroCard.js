"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DoctorArt from "./DoctorArt";

export default function HeroCard() {
  const router = useRouter();
  // Greet the signed-in staff member by name.
  const [name, setName] = useState("Dr. Johnson");
  const [isDoctor, setIsDoctor] = useState(false);
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user?.name) setName(data.user.name);
        if (data?.user?.role === "doctor") setIsDoctor(true);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="card hero span-8">
      <div className="hero-text">
        <p className="eyebrow">Good morning</p>
        <h1>Here&apos;s how the hospital stands, {name}.</h1>
        <p>
          18 appointments today · ICU trending toward 90% by evening · 3
          medicines running low.
        </p>
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
