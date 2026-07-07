import { AppLayout } from "@/components/layout/app-layout";
import { CertificationsPageContent } from "@/components/certifications/certifications-page-content";
import { streak } from "@/lib/mock/dashboard";

const currentUser = { name: "Alex Chen", status: "Open to roles", initials: "AC" };

export default function CertificationsPage() {
  return (
    <AppLayout user={currentUser} streakDays={streak.days} hasUnreadNotifications>
      <CertificationsPageContent />
    </AppLayout>
  );
}
