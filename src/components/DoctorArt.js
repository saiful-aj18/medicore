// Flat doctor illustration drawn as inline SVG (no external image needed).
export default function DoctorArt() {
  return (
    <svg
      className="hero-art"
      viewBox="0 0 220 190"
      role="img"
      aria-label="Doctor holding a clipboard"
    >
      {/* floating medical icons */}
      <g fill="none" stroke="#0f766e" strokeWidth="4" strokeLinecap="round" opacity="0.45">
        <path d="M28 42h22M39 31v22" />
        <circle cx="176" cy="34" r="12" />
        <path d="M176 28v6M176 34h.01" />
      </g>
      <g fill="#0f766e" opacity="0.35">
        <rect x="188" y="58" width="8" height="26" rx="4" transform="rotate(35 192 71)" />
        <rect x="14" y="96" width="16" height="7" rx="3.5" transform="rotate(-20 22 100)" />
      </g>

      {/* body / coat */}
      <path d="M78 190V128c0-22 14-36 32-36s32 14 32 36v62z" fill="#f8fafc" stroke="#d7e3e0" strokeWidth="2" />
      <path d="M104 96l6 22 6-22" fill="#0ea5e9" />
      <path d="M98 92h24l-4 8h-16z" fill="#e0f2fe" />
      {/* stethoscope */}
      <path d="M88 104c0 18 6 26 12 26s10-6 10-14" fill="none" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
      <circle cx="110" cy="128" r="5" fill="#334155" />
      {/* head */}
      <circle cx="110" cy="58" r="26" fill="#fcd9b8" />
      <path d="M84 56c2-18 12-28 26-28s24 10 26 28c-4-8-10-12-14-10-6 3-20 3-26 0-4-2-9 2-12 10z" fill="#1f2937" />
      <circle cx="100" cy="58" r="2.6" fill="#1f2937" />
      <circle cx="120" cy="58" r="2.6" fill="#1f2937" />
      <path d="M102 72q8 6 16 0" fill="none" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />
      {/* arms */}
      <path d="M80 132c-12-2-20-8-24-16" fill="none" stroke="#f8fafc" strokeWidth="14" strokeLinecap="round" />
      <circle cx="54" cy="112" r="8" fill="#fcd9b8" />
      <path d="M54 104v16M46 112h16" stroke="#fcd9b8" strokeWidth="4" strokeLinecap="round" />
      <path d="M140 132c10-2 18-8 22-16" fill="none" stroke="#f8fafc" strokeWidth="14" strokeLinecap="round" />
      {/* clipboard */}
      <rect x="158" y="92" width="42" height="56" rx="6" fill="#0f766e" />
      <rect x="165" y="100" width="28" height="40" rx="3" fill="#fff" />
      <path d="M170 110h18M170 118h18M170 126h12" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="172" y="84" width="14" height="10" rx="5" fill="#334155" />
    </svg>
  );
}
