import { DashboardPageContent } from "@/components/dashboard/dashboard-page-content";

const currentUser = { name: "Alex Chen", status: "Open to roles", initials: "AC" };

export default function DashboardPage() {
  return <DashboardPageContent user={currentUser} />;
}
