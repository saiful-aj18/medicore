// Shared demo data for the inner pages.
// All pages read from here so names, doctors and departments stay consistent.

export const patients = [
  { id: "P-1042", name: "John Smith", age: 45, gender: "Male", department: "Cardiology", doctor: "Dr. James Wilson", admitted: "Nov 12, 2026", status: "Admitted", condition: "Chest pain — under observation" },
  { id: "P-1043", name: "Emily Davis", age: 32, gender: "Female", department: "Neurology", doctor: "Dr. Emily Davis", admitted: "Nov 13, 2026", status: "Admitted", condition: "Migraine — MRI scheduled" },
  { id: "P-1044", name: "Michael Brown", age: 58, gender: "Male", department: "Orthopedics", doctor: "Dr. Michael Brown", admitted: "Nov 11, 2026", status: "Critical", condition: "Fractured leg — post surgery" },
  { id: "P-1045", name: "Daniel Taylor", age: 27, gender: "Male", department: "General", doctor: "Dr. Robert Lee", admitted: "Nov 14, 2026", status: "Recovering", condition: "Viral fever — IV fluids" },
  { id: "P-1046", name: "Sarah Johnson", age: 61, gender: "Female", department: "Cardiology", doctor: "Dr. James Wilson", admitted: "Nov 10, 2026", status: "Critical", condition: "Heart attack — ICU, Bed 7" },
  { id: "P-1047", name: "David Miller", age: 39, gender: "Male", department: "Emergency", doctor: "Dr. Michael Brown", admitted: "Nov 14, 2026", status: "Admitted", condition: "Road accident — Emergency, Bed 3" },
  { id: "P-1048", name: "Aisha Rahman", age: 24, gender: "Female", department: "Pediatrics", doctor: "Dr. Emily Davis", admitted: "Nov 13, 2026", status: "Recovering", condition: "Dengue — platelet count rising" },
  { id: "P-1049", name: "Robert Wilson", age: 52, gender: "Male", department: "Neurology", doctor: "Dr. Robert Lee", admitted: "Nov 09, 2026", status: "Discharged", condition: "Stroke rehab — discharged today" },
  { id: "P-1050", name: "Maria Garcia", age: 47, gender: "Female", department: "General Medicine", doctor: "Dr. James Wilson", admitted: "Nov 14, 2026", status: "Admitted", condition: "Diabetes check-up — sugar monitoring" },
  { id: "P-1051", name: "James Anderson", age: 66, gender: "Male", department: "Orthopedics", doctor: "Dr. Michael Brown", admitted: "Nov 12, 2026", status: "Recovering", condition: "Knee replacement — physiotherapy" },
];

export const doctors = [
  { name: "Dr. James Wilson", specialty: "Cardiology", experience: "14 yrs", patientsToday: 12, rating: 4.9, status: "On Duty", nextFree: "02:00 PM" },
  { name: "Dr. Emily Davis", specialty: "Neurology", experience: "11 yrs", patientsToday: 9, rating: 4.8, status: "On Duty", nextFree: "03:30 PM" },
  { name: "Dr. Michael Brown", specialty: "Orthopedics", experience: "16 yrs", patientsToday: 10, rating: 4.7, status: "On Duty", nextFree: "01:00 PM" },
  { name: "Dr. Robert Lee", specialty: "General Medicine", experience: "9 yrs", patientsToday: 14, rating: 4.8, status: "On Duty", nextFree: "04:00 PM" },
  { name: "Dr. Sarah Chen", specialty: "Pediatrics", experience: "8 yrs", patientsToday: 11, rating: 4.9, status: "On Duty", nextFree: "02:30 PM" },
  { name: "Dr. Ahmed Khan", specialty: "Emergency", experience: "12 yrs", patientsToday: 18, rating: 4.6, status: "On Duty", nextFree: "06:00 PM" },
  { name: "Dr. Priya Sharma", specialty: "Cardiology", experience: "7 yrs", patientsToday: 8, rating: 4.8, status: "Off Duty", nextFree: "Tomorrow 09:00 AM" },
  { name: "Dr. David Kim", specialty: "Neurology", experience: "10 yrs", patientsToday: 0, rating: 4.7, status: "On Leave", nextFree: "Mon, Nov 17" },
];

export const allAppointments = [
  { time: "09:00 AM", patient: "John Smith", department: "Cardiology", doctor: "Dr. James Wilson", type: "Follow-up", status: "Completed" },
  { time: "10:30 AM", patient: "Emily Davis", department: "Neurology", doctor: "Dr. Emily Davis", type: "Consultation", status: "Upcoming" },
  { time: "11:00 AM", patient: "Aisha Rahman", department: "Pediatrics", doctor: "Dr. Sarah Chen", type: "Check-up", status: "Upcoming" },
  { time: "12:00 PM", patient: "Michael Brown", department: "Orthopedics", doctor: "Dr. Michael Brown", type: "Post-surgery", status: "Upcoming" },
  { time: "01:30 PM", patient: "Maria Garcia", department: "General Medicine", doctor: "Dr. Robert Lee", type: "Consultation", status: "Upcoming" },
  { time: "02:00 PM", patient: "David Miller", department: "Emergency", doctor: "Dr. Ahmed Khan", type: "Follow-up", status: "Upcoming" },
  { time: "03:00 PM", patient: "Sarah Johnson", department: "Cardiology", doctor: "Dr. James Wilson", type: "ICU Review", status: "Upcoming" },
  { time: "04:00 PM", patient: "Daniel Taylor", department: "General", doctor: "Dr. Robert Lee", type: "Check-up", status: "Cancelled" },
];

export const wards = [
  { name: "ICU", total: 30, occupied: 22, beds: ["ICU-01", "ICU-02", "ICU-03", "ICU-04", "ICU-05", "ICU-06", "ICU-07", "ICU-08", "ICU-09", "ICU-10", "ICU-11", "ICU-12"] },
  { name: "General", total: 70, occupied: 50, beds: ["G-01", "G-02", "G-03", "G-04", "G-05", "G-06", "G-07", "G-08", "G-09", "G-10", "G-11", "G-12"] },
  { name: "Private", total: 20, occupied: 14, beds: ["P-01", "P-02", "P-03", "P-04", "P-05", "P-06", "P-07", "P-08"] },
];

export const medicines = [
  { name: "Paracetamol 500mg", category: "Pain Relief", stock: 120, unit: "tablets", status: "In Stock" },
  { name: "Amoxicillin 250mg", category: "Antibiotic", stock: 85, unit: "capsules", status: "In Stock" },
  { name: "Insulin Glargine", category: "Diabetes", stock: 18, unit: "vials", status: "Low Stock" },
  { name: "Salbutamol Inhaler", category: "Respiratory", stock: 42, unit: "inhalers", status: "In Stock" },
  { name: "Omeprazole 20mg", category: "Gastric", stock: 9, unit: "tablets", status: "Low Stock" },
  { name: "Ceftriaxone 1g", category: "Antibiotic", stock: 24, unit: "vials", status: "In Stock" },
  { name: "Morphine 10mg", category: "Pain Relief", stock: 6, unit: "ampoules", status: "Critical" },
  { name: "Metformin 500mg", category: "Diabetes", stock: 210, unit: "tablets", status: "In Stock" },
  { name: "Azithromycin 500mg", category: "Antibiotic", stock: 64, unit: "tablets", status: "In Stock" },
  { name: "ORS Sachets", category: "Rehydration", stock: 320, unit: "sachets", status: "In Stock" },
];

export const emergencyCases = [
  { id: "E-201", patient: "Sarah Johnson", case: "Heart attack", bed: "ICU, Bed 7", doctor: "Dr. Emily Davis", arrived: "08:15 AM", priority: "High", status: "In Treatment" },
  { id: "E-202", patient: "David Miller", case: "Road accident", bed: "Emergency, Bed 3", doctor: "Dr. Michael Brown", arrived: "09:05 AM", priority: "Medium", status: "In Treatment" },
  { id: "E-203", patient: "John Smith", case: "Critical — chest pain", bed: "ICU, Bed 12", doctor: "Dr. James Wilson", arrived: "09:40 AM", priority: "High", status: "Critical" },
  { id: "E-204", patient: "Rahim Uddin", case: "Fracture — left arm", bed: "Emergency, Bed 5", doctor: "Dr. Ahmed Khan", arrived: "10:20 AM", priority: "Low", status: "Waiting" },
  { id: "E-205", patient: "Fatima Begum", case: "Breathing difficulty", bed: "Emergency, Bed 8", doctor: "Dr. Ahmed Khan", arrived: "10:45 AM", priority: "High", status: "In Treatment" },
];

export const weeklyAdmissions = [
  { label: "Mon", admitted: 42, discharged: 31 },
  { label: "Tue", admitted: 55, discharged: 40 },
  { label: "Wed", admitted: 38, discharged: 45 },
  { label: "Thu", admitted: 61, discharged: 38 },
  { label: "Fri", admitted: 58, discharged: 52 },
  { label: "Sat", admitted: 47, discharged: 44 },
  { label: "Sun", admitted: 35, discharged: 30 },
];
