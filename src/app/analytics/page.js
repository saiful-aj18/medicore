import DashboardShell from "../../components/DashboardShell";
import PageHeader from "../../components/PageHeader";
import AdmissionChart from "../../components/AdmissionChart";
import BedOccupancy from "../../components/BedOccupancy";
import DepartmentPerformance from "../../components/DepartmentPerformance";
import { weeklyAdmissions } from "../../data/hospital";
import { departments } from "../../data/dashboard";

export default function AnalyticsPage() {
  const max = Math.max(...weeklyAdmissions.map((d) => Math.max(d.admitted, d.discharged)));

  return (
    <DashboardShell>
      <PageHeader
        eyebrow="Hospital OPS"
        title="Analytics"
        description="Admissions, discharges and department performance — this week at a glance."
      />

      <div className="grid" style={{ marginBottom: 18 }}>
        {[
          { label: "Admissions this week", value: weeklyAdmissions.reduce((s, d) => s + d.admitted, 0), note: "Across all departments" },
          { label: "Discharges this week", value: weeklyAdmissions.reduce((s, d) => s + d.discharged, 0), note: "Patients sent home" },
          { label: "Avg. occupancy", value: "72%", note: "86 of 120 beds" },
          { label: "Top department", value: "Emergency", note: "93% performance" },
        ].map((s) => (
          <article key={s.label} className="card stat span-3">
            <p className="label">{s.label}</p>
            <p className="value" style={{ fontSize: 26 }}>{s.value}</p>
            <p className="note">{s.note}</p>
          </article>
        ))}
      </div>

      <div className="grid">
        <section className="card span-6">
          <div className="card-head"><h2>Admissions vs discharges</h2></div>
          <div className="bar-row">
            {weeklyAdmissions.map((d) => (
              <div key={d.label} className="bar-col">
                <div className="bar-pair">
                  <i style={{ height: `${(d.admitted / max) * 130}px` }} title={`Admitted: ${d.admitted}`} />
                  <i className="out" style={{ height: `${(d.discharged / max) * 130}px` }} title={`Discharged: ${d.discharged}`} />
                </div>
                <span>{d.label}</span>
              </div>
            ))}
          </div>
          <div className="analytics-legend">
            <span><i style={{ background: "#0f766e" }} />Admitted</span>
            <span><i style={{ background: "#9db8b3" }} />Discharged</span>
          </div>
        </section>

        <AdmissionChart />
        <BedOccupancy />
        <DepartmentPerformance />

        <section className="card span-8">
          <div className="card-head"><h2>Department ranking</h2></div>
          <table className="data-table">
            <thead>
              <tr><th>#</th><th>Department</th><th>Performance</th><th>Trend</th></tr>
            </thead>
            <tbody>
              {[...departments].sort((a, b) => b.value - a.value).map((d, i) => (
                <tr key={d.name}>
                  <td>{i + 1}</td>
                  <td style={{ fontWeight: 650 }}>{d.name}</td>
                  <td>{d.value}%</td>
                  <td className="muted">{i < 2 ? "↑ Improving" : "→ Stable"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </DashboardShell>
  );
}
