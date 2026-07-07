import { AppLayout } from "@/components/layout/app-layout";
import { JobTrackerPageContent } from "@/components/job-tracker/job-tracker-page-content";
import { streak } from "@/lib/mock/dashboard";

export default function JobTrackerPage() {
  return (
    <AppLayout streakDays={streak.days} hasUnreadNotifications>
      <JobTrackerPageContent />
    </AppLayout>
  );
}
