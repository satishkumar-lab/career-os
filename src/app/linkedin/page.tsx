import { AppLayout } from "@/components/layout/app-layout";
import { LinkedInPageContent } from "@/components/linkedin/linkedin-page-content";
import { streak } from "@/lib/mock/dashboard";

export default function LinkedInPage() {
  return (
    <AppLayout streakDays={streak.days} hasUnreadNotifications>
      <LinkedInPageContent />
    </AppLayout>
  );
}
