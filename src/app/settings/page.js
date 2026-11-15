"use client";

import { useState } from "react";
import DashboardShell from "../../components/DashboardShell";
import PageHeader from "../../components/PageHeader";

const NOTIFICATIONS = [
  { key: "icu", title: "ICU occupancy alerts", desc: "Notify me when ICU goes above 85%." },
  { key: "stock", title: "Low medicine stock", desc: "Notify me when any medicine runs low." },
  { key: "emergency", title: "Emergency cases", desc: "Notify me about every new emergency case." },
  { key: "followup", title: "Follow-up reminders", desc: "Daily list of patients needing follow-up." },
];

export default function SettingsPage() {
  const [name, setName] = useState("Dr. Johnson");
  const [role, setRole] = useState("Administrator");
  const [email, setEmail] = useState("dr.johnson@medicore.hospital");
  const [hospital, setHospital] = useState("MediCore General Hospital");
  const [toggles, setToggles] = useState({ icu: true, stock: true, emergency: true, followup: false });
  const [saved, setSaved] = useState("");

  function save(e) {
    e.preventDefault();
    setSaved("Settings saved.");
    setTimeout(() => setSaved(""), 3000);
  }

  return (
    <DashboardShell>
      <PageHeader
        eyebrow="Hospital OPS"
        title="Settings"
        description="Your profile, hospital details and notifications."
      />

      <div className="grid">
        <section className="card span-6">
          <div className="card-head"><h2>Profile</h2></div>
          <form onSubmit={save}>
            <div className="form-grid">
              <div className="field full">
                <label htmlFor="s-name">Full name</label>
                <input id="s-name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="s-role">Role</label>
                <input id="s-role" value={role} onChange={(e) => setRole(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="s-email">Email</label>
                <input id="s-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="field full">
                <label htmlFor="s-hospital">Hospital name</label>
                <input id="s-hospital" value={hospital} onChange={(e) => setHospital(e.target.value)} />
              </div>
            </div>
            <div className="modal-actions" style={{ justifyContent: "flex-start" }}>
              <button type="submit" className="btn-primary">Save Profile</button>
              {saved && <span className="saved-note">{saved}</span>}
            </div>
          </form>
        </section>

        <section className="card span-6">
          <div className="card-head"><h2>Notifications</h2></div>
          {NOTIFICATIONS.map((n) => (
            <div key={n.key} className="setting-row">
              <div>
                <h3>{n.title}</h3>
                <p>{n.desc}</p>
              </div>
              <button
                type="button"
                className={`toggle${toggles[n.key] ? " on" : ""}`}
                role="switch"
                aria-checked={toggles[n.key]}
                aria-label={n.title}
                onClick={() => setToggles((t) => ({ ...t, [n.key]: !t[n.key] }))}
              />
            </div>
          ))}
          <p className="small-text" style={{ marginTop: 14 }}>
            Demo note: settings are saved in this browser only. Connect an API
            later to save them for the whole hospital.
          </p>
        </section>
      </div>
    </DashboardShell>
  );
}
