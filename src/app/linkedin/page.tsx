import { AppLayout } from "@/components/layout/app-layout";
import { AiLinkedInAgentPageContent } from "@/components/linkedin-agent/ai-linkedin-agent-page-content";

export default function LinkedInPage() {
  return (
    <AppLayout hasUnreadNotifications>
      <AiLinkedInAgentPageContent />
    </AppLayout>
  );
}
