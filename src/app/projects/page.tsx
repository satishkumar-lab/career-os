import { AppLayout } from "@/components/layout/app-layout";
import { ProjectsPageContent } from "@/components/projects/projects-page-content";
import { streak } from "@/lib/mock/dashboard";

const currentUser = { name: "Alex Chen", status: "Open to roles", initials: "AC" };

export default function ProjectsPage() {
  return (
    <AppLayout user={currentUser} streakDays={streak.days} hasUnreadNotifications>
      <ProjectsPageContent />
    </AppLayout>
  );
}
