import { AppLayout } from "@/components/layout/app-layout";
import { GoalsHeader } from "@/components/goals/goals-header";
import { GoalsList } from "@/components/goals/goals-list";
import { StatsRow } from "@/components/dashboard/stats-row";
import { streak } from "@/lib/mock/dashboard";
import { goals, goalsStats } from "@/lib/mock/goals";

const currentUser = { name: "Alex Chen", status: "Open to roles", initials: "AC" };

export default function GoalsPage() {
  return (
    <AppLayout user={currentUser} streakDays={streak.days} hasUnreadNotifications>
      <div className="flex flex-col gap-6">
        <GoalsHeader />

        <StatsRow stats={goalsStats} />

        <GoalsList goals={goals} />
      </div>
    </AppLayout>
  );
}
