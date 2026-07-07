import { AppLayout } from "@/components/layout/app-layout";
import { GoalsPageContent } from "@/components/goals/goals-page-content";
import { streak } from "@/lib/mock/dashboard";

export default function GoalsPage() {
  return (
    <AppLayout streakDays={streak.days} hasUnreadNotifications>
      <GoalsPageContent />
    </AppLayout>
  );
}
