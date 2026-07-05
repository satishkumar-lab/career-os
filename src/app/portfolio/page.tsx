import { AppLayout } from "@/components/layout/app-layout";
import { StatsRow } from "@/components/dashboard/stats-row";
import { PortfolioHeader } from "@/components/portfolio/portfolio-header";
import { ProjectProgressTable } from "@/components/portfolio/project-progress-table";
import { streak } from "@/lib/mock/dashboard";
import { portfolioProjects, portfolioStats } from "@/lib/mock/portfolio";

const currentUser = { name: "Alex Chen", status: "Open to roles", initials: "AC" };

export default function PortfolioPage() {
  return (
    <AppLayout user={currentUser} streakDays={streak.days} hasUnreadNotifications>
      <div className="flex flex-col gap-6">
        <PortfolioHeader />

        <StatsRow stats={portfolioStats} />

        <ProjectProgressTable projects={portfolioProjects} />
      </div>
    </AppLayout>
  );
}
