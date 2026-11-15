"use client";

import { useEffect, useState } from "react";
import { stats } from "../data/dashboard";

export default function StatCards() {
  // Beds come live from the API so this card always agrees with the
  // Bed management page; the other stats stay as the fixed overview.
  const [beds, setBeds] = useState(null);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/beds")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.wards?.length) {
          const occupied = data.wards.reduce((s, w) => s + (w.occupied || 0), 0);
          const total = data.wards.reduce((s, w) => s + (w.total || 0), 0);
          setBeds({ occupied, total });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const shown = stats.map((s) =>
    s.label === "Occupied beds" && beds
      ? { ...s, value: String(beds.occupied), note: `of ${beds.total} total beds` }
      : s
  );

  return (
    <>
      {shown.map((s) => (
        <article key={s.label} className="card stat span-3">
          <p className="label">{s.label}</p>
          <p className={`value${s.valueTone === "danger" ? " danger" : ""}`}>
            {s.value}
          </p>
          <p className={`note${s.noteTone === "up" ? " up" : s.noteTone === "danger" ? " danger" : ""}`}>
            {s.note}
          </p>
        </article>
      ))}
    </>
  );
}
