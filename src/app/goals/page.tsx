import { AppLayout } from "@/components/layout/app-layout";
import { GoalsPageContent } from "@/components/goals/goals-page-content";

export default function GoalsPage() {
  return (
    <AppLayout hasUnreadNotifications>
      <GoalsPageContent />
    </AppLayout>
  );
}
