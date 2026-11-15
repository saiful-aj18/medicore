"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "../../components/DashboardShell";
import PageHeader from "../../components/PageHeader";
import { medicines as seedMedicines } from "../../data/hospital";

const FILTERS = ["All", "In Stock", "Low Stock", "Critical"];

export default function PharmacyPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [list, setList] = useState(seedMedicines);

  // Load from MongoDB when connected; otherwise keep the seed list.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/medicines")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.medicines?.length) setList(data.medicines);
      })
      .catch(() => { /* demo mode — keep seed list */ });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter(
      (m) =>
        (!q || m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q)) &&
        (filter === "All" || m.status === filter)
    );
  }, [list, query, filter]);

  const lowCount = list.filter((m) => m.status !== "In Stock").length;

  async function reorder(name) {
    // Optimistic: mark reordered locally, then persist to MongoDB.
    try {
      const res = await fetch("/api/medicines", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, action: "reorder" }),
      });
      if (res.ok) {
        const { medicine } = await res.json();
        setList((cur) => cur.map((m) => (m.name === name ? medicine : m)));
        return;
      }
      throw new Error("no db");
    } catch {
      // Demo mode — restock locally (+100 units, back in stock).
      setList((cur) =>
        cur.map((m) => (m.name === name ? { ...m, stock: m.stock + 100, status: "In Stock" } : m))
      );
    }
  }

  return (
    <DashboardShell>
      <PageHeader
        eyebrow="Hospital OPS"
        title="Pharmacy"
        description={`${list.length} medicines tracked · ${lowCount} medicine${lowCount === 1 ? "" : "s"} running low.`}
      />

      <div className="toolbar">
        <label className="search">
          <input
            type="search"
            placeholder="Search medicine or category..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search medicines"
          />
        </label>
        <select className="select" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by stock status">
          {FILTERS.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
        <span className="muted" style={{ fontSize: 13 }}>{filtered.length} shown</span>
      </div>

      <section className="card table-card">
        <table className="data-table">
          <thead>
            <tr><th>Medicine</th><th>Category</th><th>Stock</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.name}>
                <td style={{ fontWeight: 650 }}>{m.name}</td>
                <td>{m.category}</td>
                <td>{m.stock} {m.unit}</td>
                <td>
                  <span className={`badge ${m.status === "In Stock" ? "instock" : m.status === "Low Stock" ? "lowstock" : "criticalstock"}`}>
                    {m.status}
                  </span>
                </td>
                <td>
                  {m.status !== "In Stock" ? (
                    <button type="button" className="btn-small" onClick={() => reorder(m.name)}>Reorder</button>
                  ) : (
                    <span className="small-text">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="empty">No medicines match that search.</p>}
      </section>
    </DashboardShell>
  );
}
