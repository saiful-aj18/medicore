"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { doctors } from "../data/hospital";

const QUICK = ["Book an appointment", "Doctor fees", "Opening hours", "Emergency help"];

function reply(text) {
  const t = text.toLowerCase();
  if (/(emergency|accident|ambulance|urgent|critical)/.test(t)) {
    return "For an emergency, please come straight to the hospital or call the hospital directly — do not wait for a chat reply. Our Emergency department is open 24/7, and the ambulance service runs day and night.";
  }
  if (/(book|appointment|serial)/.test(t)) {
    return "You can book in under a minute on the booking page: pick a department, choose your doctor, pick a date and time, and confirm. You get a booking ID (like MC-1234) to show at reception. Want me to take you there?";
  }
  if (/(fee|price|cost|charge|payment|pay|bkash|nagad|card)/.test(t)) {
    return "Consultation fees are ৳500–৳1000 depending on the doctor — General Medicine ৳500, Pediatrics ৳600, Orthopedics ৳700, Cardiology and Neurology ৳800. You can pay online with bKash, Nagad or card while booking, or pay cash at the hospital.";
  }
  if (/(hour|open|close|time|when)/.test(t)) {
    return "We are open 8 AM – 10 PM every day for appointments. Emergency is open 24/7.";
  }
  if (/(doctor|specialist)/.test(t)) {
    const names = doctors.filter((d) => d.status === "On Duty").slice(0, 4).map((d) => `${d.name} (${d.specialty})`).join(", ");
    return `Our doctors on duty today include: ${names}. Tell me a department — Cardiology, Neurology, Orthopedics, Pediatrics or General Medicine — and I will tell you who is available.`;
  }
  if (/(cardiology|heart)/.test(t)) return "Cardiology: Dr. James Wilson (14 yrs, ৳800) and Dr. Priya Sharma. They handle heart check-ups, ECG and follow-ups. Book from the booking page.";
  if (/(neurology|neuro|brain|migraine)/.test(t)) return "Neurology: Dr. Emily Davis (11 yrs, ৳800) and Dr. David Kim. They handle migraine, stroke follow-up and nerve problems.";
  if (/(pediatric|child|baby|kid)/.test(t)) return "Pediatrics: Dr. Sarah Chen (8 yrs, ৳600) — child check-ups, fever, dengue care and vaccinations.";
  if (/(ortho|bone|fracture|knee)/.test(t)) return "Orthopedics: Dr. Michael Brown (16 yrs, ৳700) — fractures, knee replacement follow-up and physiotherapy.";
  if (/(location|address|where|dhaka)/.test(t)) return "MediCore General Hospital is in Dhaka, Bangladesh. Come to the reception with your booking ID, or call us for directions.";
  if (/(cancel|change|reschedule)/.test(t)) return "To cancel or change an appointment, call the hospital with your booking ID, or check your booking status on the booking page and contact reception. Online bookings can be cancelled from the Appointments list by staff.";
  if (/(hi|hello|assalam|salam|hey)\b/.test(t)) return "Assalamu Alaikum! I am MediCore's assistant. I can help you book an appointment, find a doctor, check fees and hours, or guide you in an emergency. What do you need?";
  if (/(thank|thanks|shukran)/.test(t)) return "You're welcome! Get well soon — and remember, for anything urgent, come straight to Emergency.";
  return "I can help with booking an appointment, doctor fees, opening hours, departments, and emergency help. Try one of the quick options below, or ask me in your own words.";
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Assalamu Alaikum! I am MediCore's assistant. Need a doctor, a booking, or the fees? Ask me anything." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  function send(text) {
    const clean = String(text || "").trim();
    if (!clean || typing) return;
    setMessages((m) => [...m, { from: "user", text: clean }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: reply(clean) }]);
      setTyping(false);
    }, 700);
  }

  return (
    <>
      {!open && (
        <button type="button" className="chat-fab" onClick={() => setOpen(true)} aria-label="Chat with MediCore assistant">
          <MessageCircle size={22} />
          <span>Ask MediCore</span>
        </button>
      )}
      {open && (
        <div className="chat-panel" role="dialog" aria-label="MediCore assistant chat">
          <div className="chat-head">
            <span className="chat-head-icon"><Bot size={18} /></span>
            <span>
              <strong>MediCore Assistant</strong>
              <small>Online · replies instantly</small>
            </span>
            <button type="button" className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat">
              <X size={18} />
            </button>
          </div>
          <div className="chat-body">
            {messages.map((m, i) => (
              <p key={i} className={`chat-msg ${m.from}`}>{m.text}</p>
            ))}
            {typing && <p className="chat-msg bot typing">Typing…</p>}
            <span ref={endRef} />
          </div>
          <div className="chat-quick">
            {QUICK.map((q) => (
              <button key={q} type="button" onClick={() => send(q)}>{q}</button>
            ))}
          </div>
          <form className="chat-input" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question…" aria-label="Type your question" />
            <button type="submit" aria-label="Send message"><Send size={16} /></button>
          </form>
        </div>
      )}
    </>
  );
}
