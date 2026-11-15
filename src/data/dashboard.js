// Every number on the dashboard lives here.
// Swap these for a real API call later — the components only read this file.

export const stats = [
  {
    label: "Total patients",
    value: "1,248",
    note: "↑ 12% vs yesterday",
    noteTone: "up",
  },
  {
    label: "Occupied beds",
    value: "86",
    note: "of 120 total beds",
    noteTone: "muted",
  },
  {
    label: "Doctors on duty",
    value: "42",
    note: "Scheduled today",
    noteTone: "muted",
  },
  {
    label: "Emergency cases",
    value: "18",
    note: "High priority — see alerts",
    noteTone: "danger",
    valueTone: "danger",
  },
];

export const aiInsights = [
  "ICU occupancy may reach 90% by evening.",
  "3 medicines are running low.",
  "5 patients need follow-up today.",
];

export const departments = [
  { name: "Cardiology", value: 88 },
  { name: "Emergency", value: 93, danger: true },
  { name: "Neurology", value: 80 },
  { name: "General Medicine", value: 79 },
  { name: "Orthopedics", value: 75 },
  { name: "Pediatrics", value: 65 },
];

export const emergencyAlerts = [
  {
    title: "Critical patient — ICU, Bed 12",
    doctor: "Dr. James Wilson",
    level: "High",
  },
  {
    title: "Accident case — Emergency, Bed 3",
    doctor: "Dr. Michael Brown",
    level: "Medium",
  },
  {
    title: "Heart attack — ICU, Bed 7",
    doctor: "Dr. Emily Davis",
    level: "High",
  },
];

export const appointments = [
  { time: "09:00 AM", patient: "John Smith", department: "Cardiology", status: "Completed" },
  { time: "10:30 AM", patient: "Emily Davis", department: "Neurology", status: "Upcoming" },
  { time: "12:00 PM", patient: "Michael Brown", department: "Orthopedics", status: "Upcoming" },
  { time: "04:00 PM", patient: "Daniel Taylor", department: "General", status: "Cancelled" },
];

export const activity = [
  { text: "New patient John Smith admitted", time: "10:30 AM" },
  { text: "Paracetamol stock updated", time: "09:45 AM" },
  { text: "Appointment completed with Emily Davis", time: "09:30 AM" },
  { text: "Dr. Robert Lee joined Cardiology", time: "09:00 AM" },
];

// Patient Admission Trend — one value per day, Mon–Sun.
export const admissionTrend = [
  { day: "Mon", value: 62 },
  { day: "Tue", value: 78 },
  { day: "Wed", value: 48 },
  { day: "Thu", value: 66 },
  { day: "Fri", value: 84 },
  { day: "Sat", value: 92 },
  { day: "Sun", value: 80 },
];

export const bedOccupancy = {
  percent: 72,
  occupied: 86,
  available: 34,
  wards: [
    { label: "ICU", value: "22/30" },
    { label: "General", value: "50/70" },
    { label: "Private", value: "14/20" },
  ],
};
