import { AppLayout } from "@/components/layout/app-layout";
import { GoalsPageContent } from "@/components/goals/goals-page-content";
import { streak } from "@/lib/mock/dashboard";

const currentUser = { name: "Alex Chen", status: "Open to roles", initials: "AC" };

export default function GoalsPage() {
  return (
    <AppLayout user={currentUser} streakDays={streak.days} hasUnreadNotifications>
      <GoalsPageContent />
    </AppLayout>
  );
}
