"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  Ambulance,
  ArrowRight,
  Brain,
  CalendarCheck,
  ChevronDown,
  Clock,
  HeartPulse,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Stethoscope,
  Syringe,
  Baby,
  Bone,
  Sparkles,
  X,
} from "lucide-react";
import ChatWidget from "../components/ChatWidget";
import { doctors } from "../data/hospital";
import { stats } from "../data/dashboard";

const SERVICES = [
  { icon: HeartPulse, name: "Cardiology", desc: "Heart check-ups, ECG, blood pressure and follow-up care." },
  { icon: Brain, name: "Neurology", desc: "Migraine, stroke follow-up and nerve-related treatment." },
  { icon: Bone, name: "Orthopedics", desc: "Fractures, joint pain and knee replacement care." },
  { icon: Baby, name: "Pediatrics", desc: "Child check-ups, fever, dengue care and vaccinations." },
  { icon: Stethoscope, name: "General Medicine", desc: "Fever, diabetes, check-ups and everyday health care." },
  { icon: Ambulance, name: "Emergency — 24/7", desc: "Accident, heart attack and critical care, day and night." },
];

const TIPS = [
  { tag: "Prevention", title: "Dengue season: check platelets early", text: "Fever for more than 2 days? Get a CBC test and drink plenty of fluids. Come in early — it saves lives." },
  { tag: "Heart health", title: "Know your blood pressure numbers", text: "High blood pressure has no symptoms. A 5-minute check at MediCore can catch it years early." },
  { tag: "Diabetes", title: "Sugar under control, life under control", text: "Regular sugar checks and a simple food routine keep diabetes from damaging eyes, kidneys and feet." },
];

const TESTIMONIALS = [
  { name: "Rahim Uddin", text: "Booked online at night, saw the doctor at 10 AM the next morning. No long waiting line — the booking ID system really works." },
  { name: "Fatima Begum", text: "My mother's heart check-up was done the same day. The doctors explained everything slowly and clearly." },
  { name: "Karim Hossain", text: "My son had dengue. The pediatric team checked his platelets daily and guided us at every step. Alhamdulillah, he is fine now." },
];

const FAQS = [
  { q: "How do I book an appointment?", a: "Go to the booking page, pick a department and doctor, choose a date and time, and confirm. You get a booking ID — show it at reception. No login needed." },
  { q: "What are the consultation fees?", a: "General Medicine ৳500, Pediatrics ৳600, Orthopedics ৳700, Cardiology and Neurology ৳800. Pay online with bKash, Nagad or card, or pay cash at the hospital." },
  { q: "What are the opening hours?", a: "Appointments run 8 AM – 10 PM every day. Emergency is open 24/7, including holidays." },
  { q: "Can I cancel or change my booking?", a: "Yes — call the hospital with your booking ID, or check your booking status on the booking page and contact reception." },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const topDoctors = doctors.filter((d) => d.status === "On Duty").slice(0, 4);

  return (
    <div className="landing">
      <header className="landing-nav">
        <Link href="/" className="book-brand">
          <span className="book-logo">M</span>
          <span><strong>MediCore</strong><small>General Hospital</small></span>
        </Link>
        <nav className="landing-links">
          <a href="#services">Services</a>
          <a href="#doctors">Doctors</a>
          <a href="#how">How it works</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>
        </nav>
        <span className="landing-nav-actions">
          <Link href="/login" className="link-muted">Staff login</Link>
          <Link href="/book" className="btn-primary">Book Appointment</Link>
          <button type="button" className="icon-btn landing-menu-btn" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen((v) => !v)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </span>
      </header>
      {menuOpen && (
        <nav className="landing-mobile-links" aria-label="Mobile navigation">
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#doctors" onClick={() => setMenuOpen(false)}>Doctors</a>
          <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          <Link href="/login" onClick={() => setMenuOpen(false)}>Staff login</Link>
        </nav>
      )}

      <section className="landing-hero">
        <div className="landing-hero-text">
          <p className="eyebrow">Dhaka · Open 8 AM – 10 PM · Emergency 24/7</p>
          <h1>Good health starts with the right doctor, at the right time.</h1>
          <p>Book a doctor online in under a minute — no waiting line, no phone calls. Cardiology, Neurology, Orthopedics, Pediatrics and more, all under one roof.</p>
          <div className="hero-actions">
            <Link href="/book" className="btn-primary" style={{ padding: "13px 24px" }}>
              Book Appointment <ArrowRight size={16} style={{ verticalAlign: "-3px" }} />
            </Link>
            <Link href="/book" className="btn-ghost" style={{ padding: "13px 24px" }}>Check Booking Status</Link>
          </div>
          <p className="landing-trust">
            <ShieldCheck size={15} /> Trusted by {stats[0].value} patients · {stats[2].value} doctors on duty today
          </p>
        </div>
        <div className="card landing-hero-card">
          <h2>Today at MediCore</h2>
          <div className="landing-mini-stats">
            <div><b>{stats[0].value}</b><span>Total patients</span></div>
            <div><b>{stats[1].value}</b><span>Beds available</span></div>
            <div><b>{stats[2].value}</b><span>Doctors on duty</span></div>
            <div><b style={{ color: "var(--red)" }}>{stats[3].value}</b><span>Emergency cases</span></div>
          </div>
          <div className="landing-emergency">
            <Ambulance size={20} />
            <span><b>Emergency?</b> Come straight in or call the hospital — Emergency is open 24/7.</span>
          </div>
          <Link href="/book" className="btn-primary" style={{ display: "block", textAlign: "center", marginTop: 14 }}>See doctors &amp; book →</Link>
        </div>
      </section>

      <section className="landing-rated" aria-label="Patient rating">
        <div className="landing-rated-inner">
          <div className="landing-rated-score">
            <span className="landing-rated-stars">★★★★★</span>
            <b>4.9 out of 5</b>
            <span>Rated by {stats[0].value} patients across Dhaka</span>
          </div>
          <div className="landing-rated-points">
            <span>✓ 98% would recommend us</span>
            <span>✓ Same-day appointments</span>
            <span>✓ Emergency open 24/7</span>
          </div>
        </div>
      </section>

      <section id="services" className="landing-section">
        <p className="eyebrow" style={{ textAlign: "center" }}>Our services</p>
        <h2>Care for every part of your health</h2>
        <p className="landing-sub">Six departments, one hospital. Every department has experienced doctors and same-day appointments.</p>
        <div className="landing-grid">
          {SERVICES.map((s) => (
            <article key={s.name} className="card landing-service">
              <span className="landing-service-icon"><s.icon size={22} /></span>
              <h3>{s.name}</h3>
              <p>{s.desc}</p>
              <Link href="/book" className="link-muted">Book →</Link>
            </article>
          ))}
        </div>
      </section>

      <section id="how" className="landing-section landing-alt">
        <p className="eyebrow" style={{ textAlign: "center" }}>How it works</p>
        <h2>Three steps, no waiting line</h2>
        <div className="landing-steps">
          {[
            { n: "1", t: "Pick your doctor", d: "Choose a department and doctor. See fees, rating and next free time." },
            { n: "2", t: "Pick a date & time", d: "Choose from today or the next 6 days, and a time that suits you." },
            { n: "3", t: "Confirm & pay", d: "Pay online with bKash, Nagad or card — or pay cash at the hospital. Get your booking ID." },
          ].map((s) => (
            <div key={s.n} className="card landing-step">
              <span className="step" style={{ width: 32, height: 32, fontSize: 15 }}>{s.n}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="doctors" className="landing-section">
        <p className="eyebrow" style={{ textAlign: "center" }}>Meet our doctors</p>
        <h2>Experienced doctors, on duty today</h2>
        <div className="doctor-grid">
          {topDoctors.map((d) => (
            <article key={d.name} className="card doctor-card">
              <div className="doctor-top">
                <img src={d.image} alt={d.name} className="doctor-photo" loading="lazy" />
                <div><h3>{d.name}</h3><p>{d.specialty}</p></div>
              </div>
              <div className="doctor-meta"><span>Experience</span><b>{d.experience}</b></div>
              <div className="doctor-meta"><span>Rating</span><b>★ {d.rating}</b></div>
              <div className="doctor-meta"><span>Next free</span><b>{d.nextFree}</b></div>
              <div className="doctor-foot">
                <span className="badge onduty">On Duty</span>
                <Link href="/book" className="btn-small">Book Now</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section landing-alt">
        <p className="eyebrow" style={{ textAlign: "center" }}><Sparkles size={13} style={{ verticalAlign: "-2px" }} /> Health tips</p>
        <h2>Stay healthy, stay informed</h2>
        <div className="landing-grid">
          {TIPS.map((t) => (
            <article key={t.title} className="card landing-service">
              <span className="badge onduty">{t.tag}</span>
              <h3 style={{ marginTop: 10 }}>{t.title}</h3>
              <p>{t.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <p className="eyebrow" style={{ textAlign: "center" }}>What patients say</p>
        <h2>Trusted by families across Dhaka</h2>
        <div className="landing-grid">
          {TESTIMONIALS.map((t) => (
            <article key={t.name} className="card landing-service">
              <p style={{ fontSize: 15, lineHeight: 1.6 }}>“{t.text}”</p>
              <p style={{ fontWeight: 700, margin: "12px 0 0" }}>— {t.name}</p>
              <p style={{ color: "#f59e0b", margin: "2px 0 0" }}>★★★★★</p>
            </article>
          ))}
        </div>
      </section>

      <section id="faq" className="landing-section landing-faq">
        <p className="eyebrow" style={{ textAlign: "center" }}>Questions</p>
        <h2>Frequently asked questions</h2>
        <div className="faq-list">
          {FAQS.map((f, i) => (
            <div key={f.q} className="card faq-item">
              <button type="button" onClick={() => setOpenFaq(openFaq === i ? -1 : i)} aria-expanded={openFaq === i}>
                {f.q} <ChevronDown size={17} style={{ transform: openFaq === i ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
              </button>
              {openFaq === i && <p>{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="landing-cta">
        <h2>Need a doctor today?</h2>
        <p>Appointments are open right now — book in under a minute.</p>
        <Link href="/book" className="btn-primary" style={{ padding: "13px 26px", background: "#fff", color: "var(--teal)" }}>
          Book Appointment <ArrowRight size={16} style={{ verticalAlign: "-3px" }} />
        </Link>
      </section>

      <footer id="contact" className="landing-footer">
        <div>
          <h3>MediCore General Hospital</h3>
          <p><MapPin size={14} style={{ verticalAlign: "-2px" }} /> Dhaka, Bangladesh</p>
          <p><Phone size={14} style={{ verticalAlign: "-2px" }} /> +880 1XXX-XXXXXX · Emergency 24/7</p>
          <p><Clock size={14} style={{ verticalAlign: "-2px" }} /> Appointments: 8 AM – 10 PM, every day</p>
        </div>
        <div>
          <h3>Quick links</h3>
          <p><Link href="/book">Book an appointment</Link></p>
          <p><Link href="/book">Check booking status</Link></p>
          <p><Link href="/login">Staff login</Link></p>
        </div>
        <div>
          <h3>Departments</h3>
          <p>Cardiology · Neurology · Orthopedics</p>
          <p>Pediatrics · General Medicine · Emergency</p>
        </div>
        <p className="landing-copy">© 2026 MediCore General Hospital. For emergencies, come straight to the hospital — do not wait for an online reply. <Activity size={13} style={{ verticalAlign: "-2px" }} /></p>
      </footer>

      <ChatWidget />
    </div>
  );
}
