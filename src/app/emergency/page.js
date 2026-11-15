"use client";

import { useEffect, useState } from "react";
import DashboardShell from "../../components/DashboardShell";
import PageHeader from "../../components/PageHeader";
import { emergencyCases } from "../../data/hospital";
import { emergencyAlerts } from "../../data/dashboard";

export default function EmergencyPage() {
  const [cases, setCases] = useState(emergencyCases);

  // Load from MongoDB when connected; otherwise keep the seed list.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/emergency")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.cases?.length) setCases(data.cases);
      })
      .catch(() => { /* demo mode — keep seed list */ });
    return () => { cancelled = true; };
  }, []);

  function nextStatus(status) {
    return status === "Waiting" ? "In Treatment" : status === "In Treatment" ? "Critical" : "In Treatment";
  }

  async function advance(id) {
    const current = cases.find((c) => c.id === id);
    if (!current) return;
    const next = nextStatus(current.status);
    setCases((cur) => cur.map((c) => (c.id === id ? { ...c, status: next } : c)));
    // Persist to MongoDB when connected; otherwise the change is local only.
    try {
      await fetch("/api/emergency", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: next }),
      });
    } catch {
      /* demo mode — local change already applied */
    }
  }

  return (
    <DashboardShell>
      <PageHeader
        eyebrow="Hospital OPS"
        title="Emergency"
        description={`${cases.length} active emergency cases · 18 emergency cases today · ICU trending toward 90% by evening.`}
      />

      <div className="grid" style={{ marginBottom: 18 }}>
        <section className="card alerts-card span-6">
          <div className="card-head"><h2>Emergency Alerts</h2></div>
          {emergencyAlerts.map((a) => (
            <div key={a.title} className="alert-item">
              <div className="alert-top">
                <strong>
                  {a.title}
                  <span className="doctor">{a.doctor}</span>
                </strong>
                <span className={`pill${a.level === "Medium" ? " medium" : ""}`}>{a.level}</span>
              </div>
            </div>
          ))}
        </section>
        <section className="card span-6">
          <div className="card-head"><h2>Triage — what to do first</h2></div>
          <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.6, margin: "6px 0 0" }}>
            <b style={{ color: "var(--ink)" }}>High priority first:</b> heart attack (ICU, Bed 7) and
            critical chest pain (ICU, Bed 12). Then breathing difficulty (Emergency, Bed 8).
            The accident case (Bed 3) is stable. Keep 2 ICU beds free for incoming
            emergencies — ICU is at 22/30 and trending toward 90% by evening.
          </p>
        </section>
      </div>

      <section className="card table-card">
        <table className="data-table">
          <thead>
            <tr><th>Case</th><th>Patient</th><th>Bed</th><th>Doctor</th><th>Arrived</th><th>Priority</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.id}>
                <td style={{ fontWeight: 650 }}>{c.case}<small className="small-text" style={{ display: "block" }}>{c.id}</small></td>
                <td>{c.patient}</td>
                <td>{c.bed}</td>
                <td>{c.doctor}</td>
                <td className="muted">{c.arrived}</td>
                <td><span className={`badge ${c.priority.toLowerCase()}`}>{c.priority}</span></td>
                <td><span className={`badge ${c.status === "Critical" ? "critical" : c.status === "Waiting" ? "waiting" : "intreatment"}`}>{c.status}</span></td>
                <td>
                  <button type="button" className="btn-small" onClick={() => advance(c.id)}>
                    Update Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </DashboardShell>
  );
}
