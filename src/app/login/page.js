"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Login failed. Try again.");
        setBusy(false);
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("Could not reach the server. Try again.");
      setBusy(false);
    }
  }

  function fillDemo(role) {
    if (role === "admin") {
      setEmail("admin@medicore.hospital");
      setPassword("admin123");
    } else {
      setEmail("doctor@medicore.hospital");
      setPassword("doctor123");
    }
    setError("");
  }

  return (
    <div className="login-page">
      <div className="card login-card">
        <Link href="/" className="book-brand" style={{ justifyContent: "center" }}>
          <span className="book-logo">M</span>
          <span style={{ textAlign: "left" }}>
            <strong>MediCore</strong>
            <small>General Hospital</small>
          </span>
        </Link>
        <h1>Staff login</h1>
        <p className="muted">Sign in to open the hospital OPS dashboard.</p>

        <form onSubmit={submit} style={{ marginTop: 18 }}>
          <div className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
            <div className="field">
              <label htmlFor="login-email">Email</label>
              <input id="login-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@medicore.hospital" />
            </div>
            <div className="field">
              <label htmlFor="login-password">Password</label>
              <input id="login-password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
          </div>
          {error && <p className="book-error">{error}</p>}
          <button type="submit" className="btn-primary" disabled={busy} style={{ width: "100%", marginTop: 16, padding: "12px" }}>
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="login-demo">
          <p>Demo accounts — click to fill in:</p>
          <button type="button" className="btn-small" onClick={() => fillDemo("admin")}>Admin · admin123</button>{" "}
          <button type="button" className="btn-small" onClick={() => fillDemo("doctor")}>Doctor · doctor123</button>
          <p className="small-text" style={{ marginTop: 10 }}>
            Change these accounts and set <code>JWT_SECRET</code> in <code>.env.local</code> before going live.
          </p>
        </div>

        <p className="small-text" style={{ textAlign: "center", marginTop: 14 }}>
          Are you a patient? <Link href="/book" style={{ color: "var(--teal)", fontWeight: 700 }}>Book an appointment →</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
