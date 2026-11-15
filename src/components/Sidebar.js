"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  BarChart3,
  BedDouble,
  CalendarCheck,
  CalendarDays,
  Home,
  LogOut,
  Settings,
  Siren,
  Stethoscope,
  Users,
} from "lucide-react";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Patients", href: "/patients", icon: Users },
  { label: "Doctors", href: "/doctors", icon: Stethoscope },
  { label: "Appointments", href: "/appointments", icon: CalendarDays },
  { label: "Bed management", href: "/beds", icon: BedDouble },
  { label: "Emergency", href: "/emergency", icon: Siren },
  { label: "Pharmacy", href: "/pharmacy", icon: Activity },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Patient Booking", href: "/book", icon: CalendarCheck },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar({ open = false, onClose = () => {} }) {
  const pathname = usePathname() || "/";
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      {open && <button type="button" className="sidebar-backdrop" aria-label="Close menu" onClick={onClose} />}
      <aside className={`sidebar${open ? " open" : ""}`}>
      <div className="brand">
        <Link href="/" onClick={onClose}>
          <h1>MediCore</h1>
          <p>Hospital OPS</p>
        </Link>
      </div>

      <nav className="nav" aria-label="Main navigation">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`nav-item${active ? " active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="help-card">
        <h3>Need help?</h3>
        <p>We&apos;re here 24/7 for anything urgent.</p>
        <button type="button" className="help-btn">
          Contact Support
        </button>
      </div>

      <div className="sidebar-user">
        <span className="avatar small">DJ</span>
        <span>
          <span className="name">Dr. Johnson</span>
          <br />
          <span className="role">Administrator</span>
        </span>
        <button type="button" className="logout-btn" onClick={logout} aria-label="Log out" title="Log out">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
    </>
  );
}
