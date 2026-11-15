import DashboardShell from "../../components/DashboardShell";
import HeroCard from "../../components/HeroCard";
import AIAssistant from "../../components/AIAssistant";
import StatCards from "../../components/StatCards";
import AdmissionChart from "../../components/AdmissionChart";
import BedOccupancy from "../../components/BedOccupancy";
import DepartmentPerformance from "../../components/DepartmentPerformance";
import EmergencyAlerts from "../../components/EmergencyAlerts";
import Appointments from "../../components/Appointments";
import ActivityTimeline from "../../components/ActivityTimeline";

export default function DashboardPage() {
  return (
    <DashboardShell>
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
    </DashboardShell>
  );
}
