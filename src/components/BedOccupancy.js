"use client";

import { useEffect, useState } from "react";
import { bedOccupancy } from "../data/dashboard";

export default function BedOccupancy() {
  // Beds come live from the API so the donut always agrees with the
  // Bed management page; the fixed numbers are the fallback.
  const [live, setLive] = useState(null);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/beds")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.wards?.length) {
          const occupied = data.wards.reduce((s, w) => s + (w.occupied || 0), 0);
          const total = data.wards.reduce((s, w) => s + (w.total || 0), 0);
          setLive({
            percent: total ? Math.round((occupied / total) * 100) : 0,
            occupied,
            available: total - occupied,
            wards: data.wards.map((w) => ({ label: w.name, value: `${w.occupied}/${w.total}` })),
          });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const { percent, occupied, available, wards } = live || bedOccupancy;
  const R = 52;
  const C = 2 * Math.PI * R;
  const filled = (percent / 100) * C;

  return (
    <section className="card span-4">
      <div className="card-head">
        <h2>Bed Occupancy</h2>
      </div>

      <div className="donut-row">
        <div className="donut">
          <svg width="128" height="128" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r={R} fill="none" stroke="#e6efec" strokeWidth="13" />
            <circle
              cx="64"
              cy="64"
              r={R}
              fill="none"
              stroke="#0f766e"
              strokeWidth="13"
              strokeDasharray={`${filled} ${C}`}
              strokeLinecap="round"
              transform="rotate(-90 64 64)"
            />
          </svg>
          <div className="donut-center">
            <strong>{percent}%</strong>
            <span>occupied</span>
          </div>
        </div>

        <div className="legend">
          <div className="legend-row">
            <span className="swatch" />
            Occupied <b>{occupied} beds</b>
          </div>
          <div className="legend-row">
            <span className="swatch hollow" />
            Available <b>{available} beds</b>
          </div>
        </div>
      </div>

      <div className="ward-chips">
        {wards.map((w) => (
          <div key={w.label} className="ward-chip">
            <strong>{w.value}</strong>
            <span>{w.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
