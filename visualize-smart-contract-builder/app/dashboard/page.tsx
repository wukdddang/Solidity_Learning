import { DashboardProvider } from "./_context/dashboard.context";
import DashboardContent from "./_ui/dashboard-content";

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
