import { emergencyAlerts } from "../data/dashboard";

export default function EmergencyAlerts() {
  return (
    <section className="card alerts-card span-4">
      <div className="card-head">
        <h2>Emergency Alerts</h2>
        <a className="link-muted" href="#">
          View All
        </a>
      </div>
      <div>
        {emergencyAlerts.map((a) => (
          <div key={a.title} className="alert-item">
            <div className="alert-top">
              <strong>
                {a.title}
                <span className="doctor">{a.doctor}</span>
              </strong>
              <span className={`pill${a.level === "Medium" ? " medium" : ""}`}>
                {a.level}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
