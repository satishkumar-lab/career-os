import { AppLayout } from "@/components/layout/app-layout";
import { CertificationsPageContent } from "@/components/certifications/certifications-page-content";

export default function CertificationsPage() {
  return (
    <AppLayout hasUnreadNotifications>
      <CertificationsPageContent />
    </AppLayout>
  );
}
