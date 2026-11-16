"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import DashboardShell from "../../components/DashboardShell";
import PageHeader, { avatarColor, initials } from "../../components/PageHeader";
import { stats } from "../../data/dashboard";

const DEPARTMENTS = ["All", "Cardiology", "Neurology", "Orthopedics", "General", "General Medicine", "Emergency", "Pediatrics"];
const STATUSES = ["All", "Admitted", "Critical", "Recovering", "Discharged"];

function statusClass(status) {
  return status.toLowerCase();
}

function PatientsContent() {
  const searchParams = useSearchParams();
  // Start empty — the list is filled from /api/patients, which already
  // scopes to the signed-in doctor. Starting from the full seed list
  // would briefly flash other doctors' patients at a doctor.
  const [list, setList] = useState([]);
  // Who is signed in — a doctor only ever sees their own patients,
  // and never gets the Admit button (admitting is an admin job).
  const [me, setMe] = useState(null);
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) setMe(data.user);
      })
      .catch(() => {});
  }, []);
  const isDoctor = me?.role === "doctor";
  // Start filtered when the top-bar global search sent a ?q= query,
  // and pick up a new query if the user searches again while already here.
  const [query, setQuery] = useState(() => searchParams.get("q") || "");
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);
  const [dept, setDept] = useState("All");
  const [status, setStatus] = useState("All");
  const [showForm, setShowForm] = useState(false);
  // First appointment time — admitting a patient also books their first
  // visit with the assigned doctor, so the doctor sees them on their
  // schedule right away instead of only on the Patients list.
  const APPT_TIMES = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];
  const [form, setForm] = useState({ name: "", age: "", gender: "Male", department: "Cardiology", doctor: "Dr. James Wilson", condition: "", time: "10:00 AM" });

  // Load from MongoDB when it is connected; otherwise keep the seed list
  // plus any patients added in this browser (demo mode).
  useEffect(() => {
    let cancelled = false;
    fetch("/api/patients")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.patients?.length) setList(data.patients);
      })
      .catch(() => {
        try {
          const saved = JSON.parse(localStorage.getItem("medicare-added-patients") || "[]");
          if (saved.length && !cancelled) setList((cur) => [...saved, ...cur]);
        } catch { /* ignore */ }
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter((p) => {
      // A doctor only sees patients assigned to them by name.
      if (isDoctor && me?.name && p.doctor !== me.name) return false;
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.doctor.toLowerCase().includes(q);
      const matchesDept = dept === "All" || p.department === dept;
      const matchesStatus = status === "All" || p.status === status;
      return matchesQuery && matchesDept && matchesStatus;
    });
  }, [list, query, dept, status, isDoctor, me?.name]);

  async function addPatient(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.age) return;
    const payload = {
      name: form.name.trim(),
      age: Number(form.age),
      gender: form.gender,
      department: form.department,
      doctor: form.doctor,
      condition: form.condition.trim() || "Under observation",
      appointmentTime: form.time,
    };
    // Save to MongoDB when connected; otherwise save in this browser.
    let saved = null;
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) saved = (await res.json()).patient;
    } catch { /* demo fallback below */ }
    const next = saved || {
      id: `P-${1052 + list.length}`,
      ...payload,
      admitted: "Today",
      status: "Admitted",
    };
    setList((cur) => [next, ...cur]);
    if (!saved) {
      try {
        const old = JSON.parse(localStorage.getItem("medicare-added-patients") || "[]");
        localStorage.setItem("medicare-added-patients", JSON.stringify([next, ...old]));
      } catch { /* ignore */ }
    }
    setShowForm(false);
    setForm({ name: "", age: "", gender: "Male", department: "Cardiology", doctor: "Dr. James Wilson", condition: "", time: "10:00 AM" });
  }

  // A doctor's list is their own patients only, so the counts and
  // the header describe that list — not the whole hospital.
  const shownCritical = filtered.filter((p) => p.status === "Critical").length;

  return (
    <DashboardShell>
      <PageHeader
        eyebrow="Hospital OPS"
        title={isDoctor ? "My Patients" : "Patients"}
        description={
          isDoctor
            ? `${filtered.length} patients under your care · ${shownCritical} critical.`
            : `${list.length} patients on record · ${list.filter((p) => p.status === "Critical").length} critical · search, filter or admit a new patient.`
        }
        action={
          isDoctor ? null : (
            <button type="button" className="btn-primary" onClick={() => setShowForm(true)}>
              + Admit Patient
            </button>
          )
        }
      />

      <div className="grid" style={{ marginBottom: 18 }}>
        {stats.slice(0, 3).map((s) => (
          <article key={s.label} className="card stat span-4">
            <p className="label">{s.label}</p>
            <p className="value">{s.value}</p>
            <p className="note">{s.note}</p>
          </article>
        ))}
        <article className="card stat span-4">
          <p className="label">Critical patients</p>
          <p className="value danger">{shownCritical}</p>
          <p className="note danger">Needs immediate attention</p>
        </article>
      </div>

      <div className="toolbar">
        <label className="search">
          <input
            type="search"
            placeholder="Search name, ID or doctor..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search patients"
          />
        </label>
        <select className="select" value={dept} onChange={(e) => setDept(e.target.value)} aria-label="Filter by department">
          {DEPARTMENTS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <span className="muted" style={{ fontSize: 13 }}>{filtered.length} shown</span>
      </div>

      <section className="card table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Department</th>
              <th>Doctor</th>
              <th>Admitted</th>
              <th>Status</th>
              <th>Condition</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>
                  <span className="person">
                    <span className="avatar" style={{ background: avatarColor(p.name) }}>
                      {initials(p.name)}
                    </span>
                    <span>
                      {p.name}
                      <small>{p.id} · {p.age} yrs · {p.gender}</small>
                    </span>
                  </span>
                </td>
                <td>{p.department}</td>
                <td>{p.doctor}</td>
                <td className="muted">{p.admitted}</td>
                <td><span className={`badge ${statusClass(p.status)}`}>{p.status}</span></td>
                <td className="muted">{p.condition}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="empty">No patients match that search. Try a different name or filter.</p>
        )}
      </section>

      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Admit a patient">
            <h2>Admit a patient</h2>
            <p>Fill in the details — the patient appears at the top of the list, and their first appointment is booked with the chosen doctor for today.</p>
            <form onSubmit={addPatient}>
              <div className="form-grid">
                <div className="field full">
                  <label htmlFor="p-name">Full name</label>
                  <input id="p-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rahim Uddin" />
                </div>
                <div className="field">
                  <label htmlFor="p-age">Age</label>
                  <input id="p-age" type="number" min="0" max="120" required value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="45" />
                </div>
                <div className="field">
                  <label htmlFor="p-gender">Gender</label>
                  <select id="p-gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="p-dept">Department</label>
                  <select id="p-dept" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
                    {DEPARTMENTS.filter((d) => d !== "All").map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="p-doctor">Doctor</label>
                  <input id="p-doctor" value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} />
                </div>
                <div className="field">
                  <label htmlFor="p-time">First appointment (today)</label>
                  <select id="p-time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}>
                    {APPT_TIMES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="field full">
                  <label htmlFor="p-condition">Condition / notes</label>
                  <input id="p-condition" value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} placeholder="e.g. Chest pain — under observation" />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Admit Patient</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

// useSearchParams needs a Suspense boundary (Next.js App Router).
export default function PatientsPage() {
  return (
    <Suspense>
      <PatientsContent />
    </Suspense>
  );
}
