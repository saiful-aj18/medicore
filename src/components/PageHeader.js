"use client";

import Link from "next/link";

// Shared page heading for the inner pages.
export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="page-head">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="page-title">{title}</h1>
        {description && <p className="page-desc">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function initials(name) {
  return name
    .split(" ")
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function avatarColor(name) {
  const colors = ["#0f766e", "#2563eb", "#7c3aed", "#b45309", "#be185d", "#0891b2"];
  let sum = 0;
  for (const ch of name) sum += ch.charCodeAt(0);
  return colors[sum % colors.length];
}

export function BackLink() {
  return (
    <Link href="/dashboard" className="link-muted" style={{ display: "inline-block", marginBottom: 12 }}>
      ← Back to Dashboard
    </Link>
  );
}
