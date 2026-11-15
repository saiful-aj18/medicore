"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, Menu, MessageSquareText, Moon, Search, Sun } from "lucide-react";

export default function TopBar({ onMenuClick }) {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState("");

  // Apply dark mode on the <html> element and remember the choice.
  useEffect(() => {
    try {
      if (localStorage.getItem("medicore-theme") === "dark") setDark(true);
    } catch {
      /* storage unavailable — stay light */
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("medicore-theme", dark ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }, [dark]);

  function onSearch(event) {
    event.preventDefault();
    // Global search goes to Patients, the page that lists people.
    router.push("/patients");
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
      <button type="button" className="icon-btn" aria-label="Notifications">
        <Bell size={18} />
        <span className="dot" />
      </button>
      <button type="button" className="icon-btn" aria-label="Messages">
        <MessageSquareText size={18} />
        <span className="dot" />
      </button>

      <span className="topbar-user">
        <span className="avatar">DJ</span>
        <ChevronDown size={16} />
      </span>
    </header>
  );
}
