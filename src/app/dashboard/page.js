import { cookies } from "next/headers";
import DashboardShell from "../../components/DashboardShell";
import HeroCard from "../../components/HeroCard";
import DoctorDashboard from "../../components/DoctorDashboard";
import AIAssistant from "../../components/AIAssistant";
import StatCards from "../../components/StatCards";
import AdmissionChart from "../../components/AdmissionChart";
import BedOccupancy from "../../components/BedOccupancy";
import DepartmentPerformance from "../../components/DepartmentPerformance";
import EmergencyAlerts from "../../components/EmergencyAlerts";
import Appointments from "../../components/Appointments";
import ActivityTimeline from "../../components/ActivityTimeline";
import { COOKIE_NAME, verifySession } from "../../lib/auth";

// The dashboard is role-aware. An admin sees the whole hospital.
// A doctor sees ONLY their own work — their patients, their schedule
// and their numbers — never the hospital-wide admin overview.
export default async function DashboardPage() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  const session = token ? await verifySession(token) : null;
  const isDoctor = session?.role === "doctor";

  return (
    <DashboardShell>
      {isDoctor ? (
        <DoctorDashboard />
      ) : (
        <div className="grid">
          <HeroCard />
          <AIAssistant />
          <StatCards />
          <AdmissionChart />
          <BedOccupancy />
          <DepartmentPerformance />
          <EmergencyAlerts />
          <Appointments />
          <ActivityTimeline />
        </div>
      )}
    </DashboardShell>
  );
}
