"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarCheck, CheckCircle2, Clock, MapPin, Phone, Search, Stethoscope } from "lucide-react";
import { doctors as seedDoctors, doctorPhoto } from "../../data/hospital";
import { avatarColor, initials } from "../../components/PageHeader";
import ChatWidget from "../../components/ChatWidget";

const DEPARTMENTS = ["All", "Cardiology", "Neurology", "Orthopedics", "General Medicine", "Pediatrics", "Emergency"];
const SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];
const FEES = {
  Cardiology: 800,
  Neurology: 800,
  Orthopedics: 700,
  "General Medicine": 500,
  Pediatrics: 600,
  Emergency: 1000,
};

function nextDays(n) {
  const out = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out.push({
      key: d.toISOString().slice(0, 10),
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "short" }),
      day: d.getDate(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
    });
  }
  return out;
}

export default function BookPage() {
  const days = useMemo(() => nextDays(7), []);
  const [dept, setDept] = useState("All");
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState(days[0].key);
  const [slot, setSlot] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", age: "", reason: "" });
  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [paying, setPaying] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [error, setError] = useState("");
  const [lookup, setLookup] = useState("");
  const [lookupResult, setLookupResult] = useState(undefined);
  const [myBookings, setMyBookings] = useState([]);
  const [doctorList, setDoctorList] = useState(seedDoctors);

  useEffect(() => {
    try {
      setMyBookings(JSON.parse(localStorage.getItem("medicore-bookings") || "[]"));
    } catch { /* ignore */ }
  }, []);

  // Doctor duty status comes from MongoDB when connected, so a doctor
  // marked off duty in OPS is unbookable here too.
  useEffect(() => {
    fetch("/api/doctors")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.doctors?.length) setDoctorList(data.doctors);
      })
      .catch(() => { /* demo mode — keep seed list */ });
  }, []);

  const shownDoctors = useMemo(
    () => doctorList.filter((d) => dept === "All" || d.specialty === dept),
    [dept, doctorList]
  );

  const selectedDay = days.find((d) => d.key === date);

  async function confirmBooking(e) {
    e.preventDefault();
    if (!doctor) return setError("Please choose a doctor first.");
    if (!slot) return setError("Please choose a time slot.");
    if (!form.name.trim() || form.phone.trim().length < 11) {
      return setError("Please enter your full name and an 11-digit phone number.");
    }
    const fee = FEES[doctor.specialty] || 600;
    const bookingId = `MC-${Math.floor(1000 + Math.random() * 9000)}`;

    // Online payment goes through the payment gateway first.
    // Cash bookings skip payment and are paid at the hospital.
    let payment = { method: "Cash at hospital", status: "Pay at hospital", paymentId: null };
    if (paymentMethod !== "cash") {
      setPaying(true);
      setError("");
      try {
        const res = await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: fee, method: paymentMethod, bookingId }),
        });
        const data = await res.json().catch(() => ({}));
        payment = {
          method: paymentMethod === "bkash" ? "bKash" : paymentMethod === "nagad" ? "Nagad" : "Card",
          status: "Paid",
          paymentId: data.paymentId || `MC-PAY-${Math.floor(100000 + Math.random() * 900000)}`,
        };
      } catch {
        payment = {
          method: paymentMethod,
          status: "Paid",
          paymentId: `MC-PAY-${Math.floor(100000 + Math.random() * 900000)}`,
        };
      }
      // Let the patient see the gateway processing state.
      await new Promise((r) => setTimeout(r, 1400));
      setPaying(false);
    }

    const booking = {
      id: bookingId,
      patient: form.name.trim(),
      phone: form.phone.trim(),
      age: form.age || "—",
      department: doctor.specialty,
      doctor: doctor.name,
      date: selectedDay ? `${selectedDay.label}, ${selectedDay.day} ${selectedDay.month}` : date,
      time: slot,
      reason: form.reason.trim() || "Consultation",
      fee,
      status: "Upcoming",
      paymentMethod: payment.method,
      paymentStatus: payment.status,
      paymentId: payment.paymentId,
    };
    // Save to MongoDB when connected — the booking then appears in the
    // hospital's Appointments list for every staff member. Without a
    // database, save in this browser only (demo mode).
    let savedToDb = false;
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          patient: booking.patient,
          phone: booking.phone,
          age: booking.age,
          department: booking.department,
          doctor: booking.doctor,
          date: booking.date,
          time: booking.time,
          reason: booking.reason,
          fee: booking.fee,
          type: "Online Booking",
          paymentMethod: booking.paymentMethod,
          paymentStatus: booking.paymentStatus,
          paymentId: booking.paymentId,
        }),
      });
      savedToDb = res.ok;
    } catch { /* demo fallback below */ }
    if (!savedToDb) {
      try {
        const saved = JSON.parse(localStorage.getItem("medicore-bookings") || "[]");
        localStorage.setItem("medicore-bookings", JSON.stringify([booking, ...saved]));
      } catch { /* ignore */ }
    }
    setMyBookings((cur) => [booking, ...cur]);
    setError("");
    setConfirmed(booking);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function checkStatus(e) {
    e.preventDefault();
    const q = lookup.trim().toLowerCase();
    if (!q) return;
    // Clear the previous result right away — a failed search must never
    // leave the old booking on screen.
    setLookupResult(undefined);
    // Ask the database first (works from any device); fall back to this
    // browser's bookings in demo mode.
    try {
      const res = await fetch(`/api/appointments?search=${encodeURIComponent(lookup.trim())}`);
      if (res.ok) {
        const data = await res.json();
        const list = (data.appointments || []).map((a) => ({
          id: a.bookingId || a.id,
          patient: a.patient,
          doctor: a.doctor,
          date: a.date,
          time: a.time,
          status: a.status,
        }));
        if (list.length) {
          setLookupResult(list[0]);
          return;
        }
        if (data.mode === "db") {
          setLookupResult(null);
          return;
        }
      }
    } catch { /* demo fallback below */ }
    const found = myBookings.find(
      (b) => b.id.toLowerCase() === q || b.phone.toLowerCase() === q || b.patient.toLowerCase().includes(q)
    );
    setLookupResult(found || null);
  }

  return (
    <div className="book-page">
      <header className="book-topbar">
        <Link href="/book" className="book-brand">
          <span className="book-logo">M</span>
          <span>
            <strong>MediCore</strong>
            <small>General Hospital</small>
          </span>
        </Link>
        <span className="book-top-actions">
          <span className="book-contact"><Phone size={15} /> +880 1XXX-XXXXXX</span>
          <Link href="/dashboard" className="btn-ghost">Staff login →</Link>
        </span>
      </header>

      <main className="book-main">
        {confirmed ? (
          <section className="card book-confirm">
            <CheckCircle2 size={44} color="#0f766e" />
            <h1>Appointment confirmed!</h1>
            <p className="muted">Show this booking ID at the reception when you arrive.</p>
            <p className="book-id">{confirmed.id}</p>
            <div className="book-summary">
              <div><span>Patient</span><b>{confirmed.patient}</b></div>
              <div><span>Doctor</span><b>{confirmed.doctor}</b></div>
              <div><span>Department</span><b>{confirmed.department}</b></div>
              <div><span>Date &amp; time</span><b>{confirmed.date} · {confirmed.time}</b></div>
              <div><span>Consultation fee</span><b>৳{confirmed.fee} · {confirmed.paymentStatus === "Paid" ? `Paid via ${confirmed.paymentMethod} (${confirmed.paymentId})` : "Pay at hospital"}</b></div>
            </div>
            <div className="hero-actions" style={{ justifyContent: "center" }}>
              <button type="button" className="btn-primary" onClick={() => { setConfirmed(null); setDoctor(null); setSlot(""); setForm({ name: "", phone: "", age: "", reason: "" }); }}>
                Book Another Appointment
              </button>
              <Link href="/dashboard" className="btn-ghost">Go to Hospital Dashboard</Link>
            </div>
          </section>
        ) : (
          <>
            <section className="book-hero">
              <p className="eyebrow">No login needed</p>
              <h1>Book an appointment in under a minute.</h1>
              <p>Pick a department, choose your doctor, pick a time — done. Your booking appears in the hospital&apos;s Appointments list right away.</p>
              <p className="book-meta">
                <span><MapPin size={14} /> Dhaka, Bangladesh</span>
                <span><Clock size={14} /> Open 8 AM – 10 PM, every day</span>
              </p>
            </section>

            <form onSubmit={confirmBooking}>
              <section className="card book-section">
                <h2><span className="step">1</span> Choose a department</h2>
                <div className="chip-row">
                  {DEPARTMENTS.map((d) => (
                    <button key={d} type="button" className={`chip${dept === d ? " active" : ""}`} onClick={() => { setDept(d); setDoctor(null); }}>
                      {d}
                    </button>
                  ))}
                </div>
              </section>

              <section className="card book-section">
                <h2><span className="step">2</span> Choose your doctor</h2>
                <div className="doctor-grid">
                  {shownDoctors.map((d) => {
                    const bookable = d.status === "On Duty";
                    return (
                      <button
                        key={d.name}
                        type="button"
                        disabled={!bookable}
                        className={`card doctor-card book-doctor${doctor?.name === d.name ? " selected" : ""}`}
                        onClick={() => setDoctor(d)}
                      >
                        <span className="doctor-top">
                          {doctorPhoto(d.name) ? (
                            <img src={doctorPhoto(d.name)} alt={d.name} className="doctor-photo" loading="lazy" />
                          ) : (
                            <span className="avatar" style={{ background: avatarColor(d.name) }}>{initials(d.name.replace("Dr. ", ""))}</span>
                          )}
                          <span style={{ textAlign: "left" }}>
                            <h3>{d.name}</h3>
                            <p>{d.specialty} · {d.experience} exp.</p>
                          </span>
                        </span>
                        <span className="doctor-meta"><span>Rating</span><b>★ {d.rating}</b></span>
                        <span className="doctor-meta"><span>Fee</span><b>৳{FEES[d.specialty] || 600}</b></span>
                        <span className="doctor-meta"><span>Next free</span><b>{d.nextFree}</b></span>
                        <span className={`badge ${bookable ? "onduty" : "offduty"}`} style={{ alignSelf: "flex-start", marginTop: 6 }}>
                          {bookable ? "Available today" : d.status}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {shownDoctors.length === 0 && <p className="empty">No doctors in this department.</p>}
              </section>

              <section className="card book-section">
                <h2><span className="step">3</span> Pick a date &amp; time</h2>
                <div className="chip-row">
                  {days.map((d) => (
                    <button key={d.key} type="button" className={`chip date-chip${date === d.key ? " active" : ""}`} onClick={() => setDate(d.key)}>
                      <b>{d.label}</b>
                      <span>{d.day} {d.month}</span>
                    </button>
                  ))}
                </div>
                <div className="chip-row" style={{ marginTop: 12 }}>
                  {SLOTS.map((s) => (
                    <button key={s} type="button" className={`chip${slot === s ? " active" : ""}`} onClick={() => setSlot(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </section>

              <section className="card book-section">
                <h2><span className="step">4</span> Your details</h2>
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="b-name">Full name</label>
                    <input id="b-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rahim Uddin" />
                  </div>
                  <div className="field">
                    <label htmlFor="b-phone">Phone number</label>
                    <input id="b-phone" type="tel" required minLength={11} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="01XXXXXXXXX" />
                  </div>
                  <div className="field">
                    <label htmlFor="b-age">Age</label>
                    <input id="b-age" type="number" min="0" max="120" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="45" />
                  </div>
                  <div className="field">
                    <label htmlFor="b-reason">Reason for visit</label>
                    <input id="b-reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="e.g. Chest pain, fever..." />
                  </div>
                </div>
                {doctor && (
                  <p className="book-review">
                    <Stethoscope size={15} /> {doctor.name} · {doctor.specialty} · {selectedDay?.label}, {selectedDay?.day} {selectedDay?.month}
                    {slot ? ` · ${slot}` : " · pick a time above"} · ৳{FEES[doctor.specialty] || 600}
                  </p>
                )}
                {error && <p className="book-error">{error}</p>}
                <h3 style={{ fontSize: 14, margin: "18px 0 10px" }}>5 · Payment{doctor ? ` — ৳${FEES[doctor.specialty] || 600}` : ""}</h3>
                <div className="chip-row" role="radiogroup" aria-label="Payment method">
                  {[
                    { key: "bkash", label: "bKash" },
                    { key: "nagad", label: "Nagad" },
                    { key: "card", label: "Card" },
                    { key: "cash", label: "Cash at hospital" },
                  ].map((m) => (
                    <button key={m.key} type="button" className={`chip${paymentMethod === m.key ? " active" : ""}`} onClick={() => setPaymentMethod(m.key)}>
                      {m.label}
                    </button>
                  ))}
                </div>
                <p className="small-text" style={{ marginTop: 8 }}>
                  {paymentMethod === "cash"
                    ? "No payment now — pay at the hospital reception."
                    : "Demo gateway: no real money moves. Set SSLCommerz credentials in .env.local for live payments."}
                </p>
                <div className="modal-actions" style={{ justifyContent: "flex-start" }}>
                  <button type="submit" className="btn-primary" disabled={paying} style={{ padding: "12px 26px" }}>
                    <CalendarCheck size={16} style={{ verticalAlign: "-3px", marginRight: 6 }} />
                    {paying ? "Processing payment…" : paymentMethod === "cash" ? "Confirm Appointment" : `Pay ৳${doctor ? FEES[doctor.specialty] || 600 : ""} & Confirm`}
                  </button>
                </div>
              </section>
            </form>

            <section className="card book-section">
              <h2><Search size={16} style={{ verticalAlign: "-2px" }} /> Check your booking status</h2>
              <p className="muted" style={{ fontSize: 13.5, marginTop: 4 }}>Enter your booking ID (e.g. MC-1234), phone number or name.</p>
              <form onSubmit={checkStatus} className="toolbar" style={{ marginTop: 12, marginBottom: 0 }}>
                <label className="search">
                  <input value={lookup} onChange={(e) => setLookup(e.target.value)} placeholder="MC-1234 or 01XXXXXXXXX" aria-label="Booking ID or phone" />
                </label>
                <button type="submit" className="btn-primary">Check Status</button>
              </form>
              {lookupResult === null && <p className="book-error" style={{ marginTop: 12 }}>No booking found for that. Check the ID or phone number and try again.</p>}
              {lookupResult && (
                <div className="book-summary" style={{ marginTop: 14 }}>
                  <div><span>Booking ID</span><b>{lookupResult.id}</b></div>
                  <div><span>Patient</span><b>{lookupResult.patient}</b></div>
                  <div><span>Doctor</span><b>{lookupResult.doctor}</b></div>
                  <div><span>Date &amp; time</span><b>{lookupResult.date} · {lookupResult.time}</b></div>
                  <div><span>Status</span><b>{lookupResult.status}</b></div>
                </div>
              )}
              {myBookings.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <h3 style={{ fontSize: 14, margin: "0 0 8px" }}>Your bookings on this device</h3>
                  {myBookings.map((b) => (
                    <p key={b.id} className="small-text" style={{ margin: "4px 0" }}>
                      <b style={{ color: "var(--ink)" }}>{b.id}</b> — {b.patient} · {b.doctor} · {b.date} · {b.time} · {b.status}
                    </p>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <footer className="book-footer">
        MediCore General Hospital · Emergency? Call the hospital directly — this page is for routine appointments only.
      </footer>
      <ChatWidget />
    </div>
  );
}
