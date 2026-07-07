import { AppLayout } from "@/components/layout/app-layout";
import { AiToolsPageContent } from "@/components/ai-tools/ai-tools-page-content";

export default function AiToolsPage() {
  return (
    <AppLayout hasUnreadNotifications>
      <AiToolsPageContent />
    </AppLayout>
  );
}
