"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "../../components/DashboardShell";
import PageHeader from "../../components/PageHeader";
import { wards as seedWards } from "../../data/hospital";

function bedStatus(index, occupiedCount) {
  if (index < occupiedCount) return "occupied";
  if (index === occupiedCount) return "cleaning";
  return "available";
}

function seedWardBeds(w) {
  const sampleOccupied = Math.round((w.occupied / w.total) * w.beds.length);
  return { ...w, id: w.name, beds: w.beds.map((label, i) => ({ label, status: bedStatus(i, sampleOccupied) })) };
}

export default function BedsPage() {
  const [ward, setWard] = useState("All");
  const [wards, setWards] = useState(seedWards.map(seedWardBeds));

  // Load from MongoDB when connected; otherwise keep the seed wards.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/beds")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.wards?.length) setWards(data.wards);
      })
      .catch(() => { /* demo mode — keep seed wards */ });
    return () => { cancelled = true; };
  }, []);

  const total = wards.reduce((s, w) => s + w.total, 0);
  const occupied = wards.reduce((s, w) => s + w.occupied, 0);

  const shown = useMemo(
    () => (ward === "All" ? wards : wards.filter((w) => w.name === ward)),
    [ward, wards]
  );

  // Tap a bed to cycle it: available -> occupied -> cleaning -> available.
  async function cycleBed(wardName, bed) {
    const next = bed.status === "available" ? "occupied" : bed.status === "occupied" ? "cleaning" : "available";
    setWards((cur) =>
      cur.map((w) => {
        if (w.name !== wardName) return w;
        const beds = w.beds.map((b) => (b.label === bed.label ? { ...b, status: next } : b));
        const delta = (next === "occupied" ? 1 : 0) - (bed.status === "occupied" ? 1 : 0);
        return { ...w, beds, occupied: Math.max(0, Math.min(w.total, w.occupied + delta)) };
      })
    );
    // Persist to MongoDB when connected; otherwise the change is local only.
    try {
      await fetch("/api/beds", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ward: wardName, bed: bed.label, status: next }),
      });
    } catch {
      /* demo mode — local change already applied */
    }
  }

  return (
    <DashboardShell>
      <PageHeader
        eyebrow="Hospital OPS"
        title="Bed management"
        description={`${occupied} of ${total} beds occupied (${Math.round((occupied / total) * 100)}%) · ${total - occupied} beds free right now.`}
      />

      <div className="toolbar">
        <select className="select" value={ward} onChange={(e) => setWard(e.target.value)} aria-label="Filter by ward">
          <option>All</option>
          {wards.map((w) => (
            <option key={w.name}>{w.name}</option>
          ))}
        </select>
        <span className="muted" style={{ fontSize: 13 }}>
          <span className="badge critical">Occupied</span>{" "}
          <span className="badge low">Available</span>{" "}
          <span className="badge medium">Cleaning</span>
        </span>
      </div>

      <div className="ward-grid">
        {shown.map((w) => {
          const pct = Math.round((w.occupied / w.total) * 100);
          return (
            <section key={w.name} className="card">
              <div className="ward-head">
                <h3>{w.name} Ward</h3>
                <span>{w.occupied}/{w.total} beds</span>
              </div>
              <div className="bar" style={{ marginTop: 12 }}>
                <i style={{ width: `${pct}%` }} />
              </div>
              <p className="small-text" style={{ marginTop: 8 }}>{pct}% occupied · {w.total - w.occupied} free</p>
              <div className="bed-grid">
                {w.beds.map((bed) => (
                  <button
                    key={bed.label}
                    type="button"
                    className={`bed ${bed.status}`}
                    onClick={() => cycleBed(w.name, bed)}
                    title={`${bed.label} — ${bed.status} (tap to change)`}
                  >
                    {bed.label}
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <section className="card">
        <div className="card-head"><h2>Ward summary</h2></div>
        <table className="data-table">
          <thead>
            <tr><th>Ward</th><th>Total beds</th><th>Occupied</th><th>Available</th><th>Occupancy</th></tr>
          </thead>
          <tbody>
            {wards.map((w) => (
              <tr key={w.name}>
                <td style={{ fontWeight: 650 }}>{w.name}</td>
                <td>{w.total}</td>
                <td>{w.occupied}</td>
                <td>{w.total - w.occupied}</td>
                <td>{Math.round((w.occupied / w.total) * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </DashboardShell>
  );
}
