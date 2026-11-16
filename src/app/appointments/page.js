"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "../../components/DashboardShell";
import PageHeader from "../../components/PageHeader";
import { allAppointments } from "../../data/hospital";

const STATUSES = ["All", "Upcoming", "Completed", "Cancelled"];

export default function AppointmentsPage() {
  const [list, setList] = useState(allAppointments);
  const [status, setStatus] = useState("All");
  // Who is signed in — a doctor only ever sees their own appointments.
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

  // Load from MongoDB when connected — online bookings made on /book
  // show up here for every staff member. Without a database, fall back
  // to the seed list plus this browser's bookings (demo mode).
  useEffect(() => {
    let cancelled = false;
    fetch("/api/appointments")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.appointments) {
          const online = data.appointments.map((a) => ({
            id: a.id || a._id,
            time: a.time,
            patient: a.source === "Online" ? `${a.patient} (Online)` : a.patient,
            department: a.department,
            doctor: a.doctor,
            type: a.type,
            status: a.status,
          }));
          // Demo mode: also merge this browser's online bookings.
          if (data.mode === "demo") {
            try {
              const saved = JSON.parse(localStorage.getItem("medicare-bookings") || "[]");
              const local = saved.map((b) => ({
                time: b.time,
                patient: `${b.patient} (Online)`,
                department: b.department,
                doctor: b.doctor,
                type: "Online Booking",
                status: b.status || "Upcoming",
              }));
              setList([...local, ...online]);
              return;
            } catch { /* ignore */ }
          }
          setList(online);
        }
      })
      .catch(() => {
        try {
          const saved = JSON.parse(localStorage.getItem("medicare-bookings") || "[]");
          if (saved.length && !cancelled) {
            const online = saved.map((b) => ({
              time: b.time,
              patient: `${b.patient} (Online)`,
              department: b.department,
              doctor: b.doctor,
              type: "Online Booking",
              status: b.status || "Upcoming",
            }));
            setList((cur) => [...online, ...cur]);
          }
        } catch { /* ignore */ }
      });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    // A doctor only sees appointments assigned to them by name.
    const mine = isDoctor && me?.name ? list.filter((a) => a.doctor === me.name) : list;
    return status === "All" ? mine : mine.filter((a) => a.status === status);
  }, [list, status, isDoctor, me?.name]);

  async function setAppointmentStatus(patient, time, next) {
    setList((cur) =>
      cur.map((a) =>
        a.patient === patient && a.time === time ? { ...a, status: next } : a
      )
    );
    // Persist to MongoDB when connected; otherwise the change is local only.
    try {
      await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient: patient.replace(" (Online)", ""), time, status: next }),
      });
    } catch {
      /* demo mode — local change already applied */
    }
  }

  // Counts describe the appointments this staff member can see —
  // for a doctor, only their own schedule.
  const visible = isDoctor && me?.name ? list.filter((a) => a.doctor === me.name) : list;
  const counts = {
    total: visible.length,
    upcoming: visible.filter((a) => a.status === "Upcoming").length,
    completed: visible.filter((a) => a.status === "Completed").length,
    cancelled: visible.filter((a) => a.status === "Cancelled").length,
  };

  return (
    <DashboardShell>
      <PageHeader
        eyebrow="Hospital OPS"
        title={isDoctor ? "My Schedule" : "Appointments"}
        description={
          isDoctor
            ? "Your appointments for today — confirm, complete or cancel your own bookings."
            : "Today's schedule — confirm, complete or cancel an appointment. Bookings made on the public /book page show up here as “Online”."
        }
      />

      <div className="grid" style={{ marginBottom: 18 }}>
        {[
          { label: "Total today", value: counts.total, note: "All appointments" },
          { label: "Upcoming", value: counts.upcoming, note: "Yet to happen" },
          { label: "Completed", value: counts.completed, note: "Finished today" },
          { label: "Cancelled", value: counts.cancelled, note: "Cancelled today" },
        ].map((s) => (
          <article key={s.label} className="card stat span-3">
            <p className="label">{s.label}</p>
            <p className="value">{s.value}</p>
            <p className="note">{s.note}</p>
          </article>
        ))}
      </div>

      <div className="toolbar">
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
              <th>Time</th>
              <th>Patient</th>
              <th>Department</th>
              <th>Doctor</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={`${a.time}-${a.patient}`}>
                <td className="muted">{a.time}</td>
                <td style={{ fontWeight: 650 }}>{a.patient}</td>
                <td>{a.department}</td>
                <td>{a.doctor}</td>
                <td className="muted">{a.type}</td>
                <td><span className={`badge ${a.status.toLowerCase()}`}>{a.status}</span></td>
                <td>
                  {a.status === "Upcoming" && (
                    <>
                      <button type="button" className="btn-small" onClick={() => setAppointmentStatus(a.patient, a.time, "Completed")}>
                        Complete
                      </button>{" "}
                      <button type="button" className="btn-small danger" onClick={() => setAppointmentStatus(a.patient, a.time, "Cancelled")}>
                        Cancel
                      </button>
                    </>
                  )}
                  {a.status !== "Upcoming" && <span className="small-text">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="empty">No appointments with that status.</p>}
      </section>
    </DashboardShell>
  );
}
