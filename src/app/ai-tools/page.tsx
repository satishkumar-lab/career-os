import { AppLayout } from "@/components/layout/app-layout";
import { AiToolsPageContent } from "@/components/ai-tools/ai-tools-page-content";
import { streak } from "@/lib/mock/dashboard";

export default function AiToolsPage() {
  return (
    <AppLayout streakDays={streak.days} hasUnreadNotifications>
      <AiToolsPageContent />
    </AppLayout>
  );
}
