import { AppLayout } from "@/components/layout/app-layout";
import { ProjectsPageContent } from "@/components/projects/projects-page-content";

export default function ProjectsPage() {
  return (
    <AppLayout hasUnreadNotifications>
      <ProjectsPageContent />
    </AppLayout>
  );
}
