import { AppLayout } from "@/components/layout/app-layout";
import { LearningPageContent } from "@/components/learning/learning-page-content";
import { streak } from "@/lib/mock/dashboard";

export default function LearningPage() {
  return (
    <AppLayout streakDays={streak.days} hasUnreadNotifications>
      <LearningPageContent />
    </AppLayout>
  );
}
