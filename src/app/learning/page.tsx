import { AppLayout } from "@/components/layout/app-layout";
import { LearningPageContent } from "@/components/learning/learning-page-content";

export default function LearningPage() {
  return (
    <AppLayout hasUnreadNotifications>
      <LearningPageContent />
    </AppLayout>
  );
}
