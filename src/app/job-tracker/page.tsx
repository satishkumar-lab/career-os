import { AppLayout } from "@/components/layout/app-layout";
import { JobTrackerPageContent } from "@/components/job-tracker/job-tracker-page-content";
import { streak } from "@/lib/mock/dashboard";

const currentUser = { name: "Alex Chen", status: "Open to roles", initials: "AC" };

export default function JobTrackerPage() {
  return (
    <AppLayout user={currentUser} streakDays={streak.days} hasUnreadNotifications>
      <JobTrackerPageContent />
    </AppLayout>
  );
}
