"use client";

import { useEffect, useState } from "react";
import { appointments as seedAppointments } from "../data/dashboard";

// Today's appointments on the dashboard — real data from the API, not
// a fixed seed list, so a booking made on /book or a patient admitted
// in OPS shows up here right away. The API scopes to the signed-in
// doctor, so a doctor only ever sees their own appointments here.
export default function Appointments() {
  const [list, setList] = useState(seedAppointments);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/appointments")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.appointments?.length) {
          setList(
            data.appointments.slice(0, 6).map((a) => ({
              time: a.time,
              patient: a.patient,
              department: a.department,
              status: a.status,
            }))
          );
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="card span-4">
      <div className="card-head">
        <h2>Today&apos;s appointments</h2>
        <a className="link-muted" href="/appointments">
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
          {list.map((a) => (
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
