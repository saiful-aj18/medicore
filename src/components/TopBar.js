"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, Menu, Moon, Search, Sun } from "lucide-react";

export default function TopBar({ onMenuClick }) {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState("");
  // The signed-in staff member's initials — not a fixed "DJ", so a
  // doctor sees their own initials here.
  const [initials, setInitials] = useState("DJ");
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user?.name) {
          setInitials(
            data.user.name
              .replace(/^Dr\.?\s+/i, "")
              .split(/\s+/)
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
          );
        }
      })
      .catch(() => {});
  }, []);

  // Apply dark mode on the <html> element and remember the choice.
  useEffect(() => {
    try {
      if (localStorage.getItem("medicare-theme") === "dark") setDark(true);
    } catch {
      /* storage unavailable — stay light */
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("medicare-theme", dark ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }, [dark]);

  function onSearch(event) {
    event.preventDefault();
    // Global search goes to Patients, the page that lists people —
    // carry the query along in the URL so the list is actually filtered.
    const q = query.trim();
    router.push(q ? `/patients?q=${encodeURIComponent(q)}` : "/patients");
  }

  return (
    <header className="topbar">
      <button type="button" className="icon-btn menu-btn" aria-label="Open menu" onClick={onMenuClick}>
        <Menu size={20} />
      </button>
      <form className="search" onSubmit={onSearch}>
        <Search size={16} />
        <input
          type="search"
          placeholder="Search anything..."
          aria-label="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      <span className="topbar-spacer" />

      <button
        type="button"
        className="icon-btn"
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        onClick={() => setDark((v) => !v)}
      >
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <Link href="/settings" className="topbar-user" aria-label="My profile and settings">
        <span className="avatar">{initials}</span>
        <ChevronDown size={16} />
      </Link>
    </header>
  );
}
