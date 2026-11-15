import DoctorArt from "./DoctorArt";

export default function HeroCard() {
  return (
    <section className="card hero span-8">
      <div className="hero-text">
        <p className="eyebrow">Good morning</p>
        <h1>Here&apos;s how the hospital stands, Dr. Johnson.</h1>
        <p>
          18 appointments today · ICU trending toward 90% by evening · 3
          medicines running low.
        </p>
        <div className="hero-actions">
          <button type="button" className="btn-primary">
            View Schedule
          </button>
          <button type="button" className="btn-ghost">
            Review ICU Status
          </button>
        </div>
      </div>
      <DoctorArt />
    </section>
  );
}
