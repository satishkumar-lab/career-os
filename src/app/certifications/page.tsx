import { AppLayout } from "@/components/layout/app-layout";
import { StatsRow } from "@/components/dashboard/stats-row";
import { CertificationsHeader } from "@/components/certifications/certifications-header";
import { CertificationsList } from "@/components/certifications/certifications-list";
import { streak } from "@/lib/mock/dashboard";
import { certificationStats, certifications } from "@/lib/mock/certifications";

const currentUser = { name: "Alex Chen", status: "Open to roles", initials: "AC" };

export default function CertificationsPage() {
  return (
    <AppLayout user={currentUser} streakDays={streak.days} hasUnreadNotifications>
      <div className="flex flex-col gap-6">
        <CertificationsHeader />

        <StatsRow stats={certificationStats} />

        <CertificationsList certifications={certifications} />
      </div>
    </AppLayout>
  );
}
