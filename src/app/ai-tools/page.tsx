import { AppLayout } from "@/components/layout/app-layout";
import { StatsRow } from "@/components/dashboard/stats-row";
import { AiToolsHeader } from "@/components/ai-tools/ai-tools-header";
import { AiToolsGrid } from "@/components/ai-tools/ai-tools-grid";
import { streak } from "@/lib/mock/dashboard";
import { aiTools, aiToolsStats } from "@/lib/mock/ai-tools";

const currentUser = { name: "Alex Chen", status: "Open to roles", initials: "AC" };

export default function AiToolsPage() {
  return (
    <AppLayout user={currentUser} streakDays={streak.days} hasUnreadNotifications>
      <div className="flex flex-col gap-6">
        <AiToolsHeader />

        <StatsRow stats={aiToolsStats} />

        <AiToolsGrid tools={aiTools} />
      </div>
    </AppLayout>
  );
}
