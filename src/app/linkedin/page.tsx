import { AppLayout } from "@/components/layout/app-layout";
import { LinkedInPageContent } from "@/components/linkedin/linkedin-page-content";

export default function LinkedInPage() {
  return (
    <AppLayout hasUnreadNotifications>
      <LinkedInPageContent />
    </AppLayout>
  );
}
