import { appointments } from "../data/dashboard";

export default function Appointments() {
  return (
    <section className="card span-4">
      <div className="card-head">
        <h2>Today&apos;s appointments</h2>
        <a className="link-muted" href="#">
          View All
        </a>
      </div>
      <table className="appt-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Patient</th>
            <th>Department</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={`${a.time}-${a.patient}`}>
              <td className="time">{a.time}</td>
              <td>{a.patient}</td>
              <td>{a.department}</td>
              <td>
                <span className={`status ${a.status.toLowerCase()}`}>
                  {a.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
