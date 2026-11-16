"use client";

import { useEffect, useState } from "react";
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

// Every staff member sees only the pages their role may open.
// Admin: the full hospital OPS area (10 items).
// Doctor: just their own work — Dashboard, My Patients, My Schedule,
// Patient Booking and Settings (5 items). The labels switch to the
// doctor's wording ("My Patients", "My Schedule") for their own pages.
const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: Home, roles: ["admin", "doctor"] },
  { label: "Patients", href: "/patients", icon: Users, roles: ["admin", "doctor"], doctorLabel: "My Patients" },
  { label: "Doctors", href: "/doctors", icon: Stethoscope, roles: ["admin"] },
  { label: "Appointments", href: "/appointments", icon: CalendarDays, roles: ["admin", "doctor"], doctorLabel: "My Schedule" },
  { label: "Bed management", href: "/beds", icon: BedDouble, roles: ["admin"] },
  { label: "Emergency", href: "/emergency", icon: Siren, roles: ["admin"] },
  { label: "Pharmacy", href: "/pharmacy", icon: Activity, roles: ["admin"] },
  { label: "Analytics", href: "/analytics", icon: BarChart3, roles: ["admin"] },
  { label: "Patient Booking", href: "/book", icon: CalendarCheck, roles: ["admin", "doctor"] },
  { label: "Settings", href: "/settings", icon: Settings, roles: ["admin", "doctor"] },
];

export default function Sidebar({ open = false, onClose = () => {} }) {
  const pathname = usePathname() || "/";
  const router = useRouter();

  // Show the signed-in staff member, not a fixed name.
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);
  const name = user?.name || "Dr. Johnson";
  const roleLabel = user?.role === "doctor" ? "Doctor" : "Administrator";
  const initials =
    name
      .replace(/^Dr\.\s*/, "")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "DJ";

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
          <h1>MediCare</h1>
          <p>Hospital OPS</p>
        </Link>
      </div>

      <nav className="nav" aria-label="Main navigation">
        {NAV.filter((item) => item.roles.includes(user?.role || "admin")).map(
          ({ label, href, icon: Icon, doctorLabel }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            const text = user?.role === "doctor" && doctorLabel ? doctorLabel : label;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`nav-item${active ? " active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={18} />
                {text}
              </Link>
            );
          }
        )}
      </nav>

      <div className="help-card">
        <h3>Need help?</h3>
        <p>We&apos;re here 24/7 for anything urgent.</p>
        <a className="help-btn" href="mailto:admin@medicare.hospital">
          Contact Support
        </a>
      </div>

      <div className="sidebar-user">
        <span className="avatar small">{initials}</span>
        <span>
          <span className="name">{name}</span>
          <br />
          <span className="role">{roleLabel}</span>
        </span>
        <button type="button" className="logout-btn" onClick={logout} aria-label="Log out" title="Log out">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
    </>
  );
}
