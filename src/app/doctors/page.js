"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "../../components/DashboardShell";
import PageHeader, { avatarColor, initials } from "../../components/PageHeader";
import { doctors as seedDoctors } from "../../data/hospital";

const SPECIALTIES = ["All", "Cardiology", "Neurology", "Orthopedics", "General Medicine", "Pediatrics", "Emergency"];
const STATUSES = ["All", "On Duty", "Off Duty", "On Leave"];

export default function DoctorsPage() {
  const [list, setList] = useState(seedDoctors);
  const [specialty, setSpecialty] = useState("All");
  const [status, setStatus] = useState("All");

  // Load from MongoDB when connected; otherwise keep the seed list.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/doctors")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.doctors?.length) setList(data.doctors);
      })
      .catch(() => { /* demo mode — keep seed list */ });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(
    () =>
      list.filter(
        (d) =>
          (specialty === "All" || d.specialty === specialty) &&
          (status === "All" || d.status === status)
      ),
    [list, specialty, status]
  );

  async function toggleDuty(name) {
    const current = list.find((d) => d.name === name);
    if (!current) return;
    const next = current.status === "On Duty" ? "Off Duty" : "On Duty";
    setList((cur) => cur.map((d) => (d.name === name ? { ...d, status: next } : d)));
    // Persist to MongoDB when connected; otherwise the change is local only.
    try {
      const res = await fetch("/api/doctors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, status: next }),
      });
      if (!res.ok) throw new Error("no db");
    } catch {
      /* demo mode — local change already applied */
    }
  }

  return (
    <DashboardShell>
      <PageHeader
        eyebrow="Hospital OPS"
        title="Doctors"
        description={`${list.filter((d) => d.status === "On Duty").length} doctors on duty right now · ${list.length} in total.`}
      />

      <div className="toolbar">
        <select className="select" value={specialty} onChange={(e) => setSpecialty(e.target.value)} aria-label="Filter by specialty">
          {SPECIALTIES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <span className="muted" style={{ fontSize: 13 }}>{filtered.length} shown</span>
      </div>

      <div className="doctor-grid">
        {filtered.map((d) => (
          <article key={d.name} className="card doctor-card">
            <div className="doctor-top">
              <span className="avatar" style={{ background: avatarColor(d.name) }}>
                {initials(d.name.replace("Dr. ", ""))}
              </span>
              <div>
                <h3>{d.name}</h3>
                <p>{d.specialty}</p>
              </div>
            </div>
            <div className="doctor-meta">
              <span>Experience</span><b>{d.experience}</b>
            </div>
            <div className="doctor-meta">
              <span>Patients today</span><b>{d.patientsToday}</b>
            </div>
            <div className="doctor-meta">
              <span>Rating</span><b>★ {d.rating}</b>
            </div>
            <div className="doctor-meta">
              <span>Next free</span><b>{d.nextFree}</b>
            </div>
            <div className="doctor-foot">
              <span className={`badge ${d.status === "On Duty" ? "onduty" : d.status === "On Leave" ? "onleave" : "offduty"}`}>
                {d.status}
              </span>
              <button type="button" className="btn-small" onClick={() => toggleDuty(d.name)}>
                {d.status === "On Duty" ? "Mark Off Duty" : "Mark On Duty"}
              </button>
            </div>
          </article>
        ))}
      </div>
      {filtered.length === 0 && <p className="empty">No doctors match that filter.</p>}
    </DashboardShell>
  );
}
