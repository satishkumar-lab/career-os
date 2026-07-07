import { AppLayout } from "@/components/layout/app-layout";
import { LearningPageContent } from "@/components/learning/learning-page-content";
import { streak } from "@/lib/mock/dashboard";

const currentUser = { name: "Alex Chen", status: "Open to roles", initials: "AC" };

export default function LearningPage() {
  return (
    <AppLayout user={currentUser} streakDays={streak.days} hasUnreadNotifications>
      <LearningPageContent />
    </AppLayout>
  );
}
