import { AppLayout } from "@/components/layout/app-layout";
import { StatsRow } from "@/components/dashboard/stats-row";
import { ProjectsHeader } from "@/components/projects/projects-header";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import { streak } from "@/lib/mock/dashboard";
import { projectStats, projects } from "@/lib/mock/projects";

const currentUser = { name: "Alex Chen", status: "Open to roles", initials: "AC" };

export default function ProjectsPage() {
  return (
    <AppLayout user={currentUser} streakDays={streak.days} hasUnreadNotifications>
      <div className="flex flex-col gap-6">
        <ProjectsHeader />

        <StatsRow stats={projectStats} />

        <ProjectsGrid projects={projects} />
      </div>
    </AppLayout>
  );
}
