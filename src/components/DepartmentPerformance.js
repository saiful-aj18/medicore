import { departments } from "../data/dashboard";

export default function DepartmentPerformance() {
  return (
    <section className="card span-4">
      <div className="card-head">
        <h2>Department performance</h2>
      </div>
      <div>
        {departments.map((d) => (
          <div key={d.name} className="dept-row">
            <div className="dept-top">
              <span>{d.name}</span>
              <b>{d.value}%</b>
            </div>
            <div className="bar">
              <i className={d.danger ? "danger" : ""} style={{ width: `${d.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
