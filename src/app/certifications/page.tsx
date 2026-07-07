import { AppLayout } from "@/components/layout/app-layout";
import { CertificationsPageContent } from "@/components/certifications/certifications-page-content";
import { streak } from "@/lib/mock/dashboard";

export default function CertificationsPage() {
  return (
    <AppLayout streakDays={streak.days} hasUnreadNotifications>
      <CertificationsPageContent />
    </AppLayout>
  );
}
