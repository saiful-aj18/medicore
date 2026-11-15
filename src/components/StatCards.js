import { stats } from "../data/dashboard";

export default function StatCards() {
  return (
    <>
      {stats.map((s) => (
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
