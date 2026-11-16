"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HeroCard from "./HeroCard";
import { avatarColor, initials } from "./PageHeader";

// A doctor's own dashboard — only their patients, their appointments
// and their numbers. Nothing hospital-wide: no bed counts, no pharmacy
// stock, no other doctors' bookings. The APIs already scope to the
// signed-in doctor, so this page simply shows what they return.
export default function DoctorDashboard() {
  const [me, setMe] = useState(null);
  const [patients, setPatients] = useState(null);
  const [appointments, setAppointments] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) setMe(data.user);
      })
      .catch(() => {});
    fetch("/api/patients")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.patients) setPatients(data.patients);
      })
      .catch(() => setPatients([]));
    fetch("/api/appointments")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.appointments) setAppointments(data.appointments);
      })
      .catch(() => setAppointments([]));
  }, []);

  const list = patients || [];
  const appts = appointments || [];
  const upcoming = appts.filter((a) => a.status === "Upcoming");
  const completed = appts.filter((a) => a.status === "Completed");
  const critical = list.filter((p) => p.status === "Critical");

  return (
    <div className="grid">
      <HeroCard />

      <section className="card span-4">
        <div className="card-head">
          <h2>Today at a glance</h2>
        </div>
        <p className="muted" style={{ fontSize: 14, lineHeight: 1.7 }}>
          {me ? `${me.name} — ` : ""}{upcoming.length} upcoming appointment
          {upcoming.length === 1 ? "" : "s"} · {list.length} patient
          {list.length === 1 ? "" : "s"} under your care
          {critical.length > 0 ? ` · ${critical.length} critical` : ""}.
        </p>
        <p className="muted" style={{ fontSize: 14, lineHeight: 1.7 }}>
          {upcoming.length > 0
            ? `Next up: ${upcoming[0].patient} at ${upcoming[0].time}.`
            : "No more appointments scheduled for today."}
        </p>
      </section>

      <div className="grid" style={{ marginBottom: 0 }}>
        {[
          { label: "My patients", value: list.length, note: "Under your care" },
          { label: "Appointments today", value: appts.length, note: "Your schedule" },
          { label: "Upcoming", value: upcoming.length, note: "Yet to happen" },
          { label: "Completed today", value: completed.length, note: "Finished" },
        ].map((s) => (
          <article key={s.label} className="card stat span-3">
            <p className="label">{s.label}</p>
            <p className="value">{s.value}</p>
            <p className="note">{s.note}</p>
          </article>
        ))}
      </div>

      <section className="card span-8">
        <div className="card-head">
          <h2>My schedule today</h2>
          <Link className="link-muted" href="/appointments">
            View full schedule
          </Link>
        </div>
        {appts.length === 0 ? (
          <p className="empty">No appointments scheduled for you today.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Patient</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appts.slice(0, 8).map((a) => (
                <tr key={`${a.time}-${a.patient}`}>
                  <td className="muted">{a.time}</td>
                  <td style={{ fontWeight: 650 }}>{a.patient}</td>
                  <td className="muted">{a.type || "Consultation"}</td>
                  <td>
                    <span className={`badge ${a.status.toLowerCase()}`}>{a.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="card span-4">
        <div className="card-head">
          <h2>My patients</h2>
          <Link className="link-muted" href="/patients">
            View all
          </Link>
        </div>
        {list.length === 0 ? (
          <p className="empty">No patients assigned to you yet.</p>
        ) : (
          <div>
            {list.slice(0, 6).map((p) => (
              <div key={p.id || p.patientId} className="alert-item">
                <div className="alert-top">
                  <strong>
                    <span className="person">
                      <span className="avatar" style={{ background: avatarColor(p.name), width: 30, height: 30, fontSize: 12 }}>
                        {initials(p.name)}
                      </span>
                      <span>
                        {p.name}
                        <span className="doctor">{p.condition || p.department}</span>
                      </span>
                    </span>
                  </strong>
                  <span className={`pill${p.status === "Critical" ? "" : " medium"}`}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
