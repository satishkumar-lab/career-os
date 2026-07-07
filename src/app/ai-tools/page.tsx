import { AppLayout } from "@/components/layout/app-layout";
import { AiToolsPageContent } from "@/components/ai-tools/ai-tools-page-content";
import { streak } from "@/lib/mock/dashboard";

const currentUser = { name: "Alex Chen", status: "Open to roles", initials: "AC" };

export default function AiToolsPage() {
  return (
    <AppLayout user={currentUser} streakDays={streak.days} hasUnreadNotifications>
      <AiToolsPageContent />
    </AppLayout>
  );
}
