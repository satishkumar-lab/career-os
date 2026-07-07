import { AppLayout } from "@/components/layout/app-layout";
import { ProjectsPageContent } from "@/components/projects/projects-page-content";
import { streak } from "@/lib/mock/dashboard";

export default function ProjectsPage() {
  return (
    <AppLayout streakDays={streak.days} hasUnreadNotifications>
      <ProjectsPageContent />
    </AppLayout>
  );
}
