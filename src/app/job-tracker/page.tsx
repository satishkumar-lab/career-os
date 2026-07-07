import { AppLayout } from "@/components/layout/app-layout";
import { JobTrackerPageContent } from "@/components/job-tracker/job-tracker-page-content";

export default function JobTrackerPage() {
  return (
    <AppLayout hasUnreadNotifications>
      <JobTrackerPageContent />
    </AppLayout>
  );
}
