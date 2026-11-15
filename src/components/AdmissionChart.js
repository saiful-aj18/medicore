import { admissionTrend } from "../data/dashboard";

// Smooth SVG line chart. Points are scaled from the data (max = 100).
export default function AdmissionChart() {
  const W = 560;
  const H = 150;
  const PAD = 8;
  const max = 100;

  const points = admissionTrend.map((d, i) => ({
    x: PAD + (i * (W - PAD * 2)) / (admissionTrend.length - 1),
    y: H - PAD - (d.value / max) * (H - PAD * 2),
  }));

  // Catmull-Rom -> cubic bezier for a smooth curve.
  const line = points
    .map((p, i) => {
      if (i === 0) return `M ${p.x},${p.y}`;
      const prev = points[i - 1];
      const prevPrev = points[i - 2] || prev;
      const next = points[i + 1] || p;
      const c1x = prev.x + (p.x - prevPrev.x) / 6;
      const c1y = prev.y + (p.y - prevPrev.y) / 6;
      const c2x = p.x - (next.x - prev.x) / 6;
      const c2y = p.y - (next.y - prev.y) / 6;
      return `C ${c1x},${c1y} ${c2x},${c2y} ${p.x},${p.y}`;
    })
    .join(" ");

  const area = `${line} L ${points[points.length - 1].x},${H} L ${points[0].x},${H} Z`;

  return (
    <section className="card span-4">
      <div className="card-head">
        <h2>Patient Admission Trend</h2>
        <span className="link-muted">This Week</span>
      </div>
      <div className="chart-wrap">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height="150"
          preserveAspectRatio="none"
          role="img"
          aria-label="Patient admissions this week"
        >
          <defs>
            <linearGradient id="admitFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f766e" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#0f766e" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#admitFill)" />
          <path d={line} fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="chart-days">
          {admissionTrend.map((d) => (
            <span key={d.day}>{d.day}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
