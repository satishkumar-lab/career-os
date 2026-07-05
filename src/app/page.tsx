import { AppLayout } from "@/components/layout/app-layout";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatsRow } from "@/components/dashboard/stats-row";
import { TodayTasksCard } from "@/components/dashboard/today-tasks-card";
import { ActiveGoalsCard } from "@/components/dashboard/active-goals-card";
import { UpcomingCard } from "@/components/dashboard/upcoming-card";
import { QuickActionsCard } from "@/components/dashboard/quick-actions-card";
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card";
import { SocialGrowthCard } from "@/components/dashboard/social-growth-card";
import { AiFocusCard } from "@/components/dashboard/ai-focus-card";
import {
  aiFocus,
  goals,
  quickActions,
  recentActivity,
  socialGrowth,
  stats,
  streak,
  tasks,
  upcomingEvents,
} from "@/lib/mock/dashboard";

export const dynamic = "force-dynamic";

const currentUser = { name: "Alex Chen", status: "Open to roles", initials: "AC" };

export default function DashboardPage() {
  return (
    <AppLayout user={currentUser} streakDays={streak.days} hasUnreadNotifications>
      <div className="flex flex-col gap-6">
        <DashboardHeader name={currentUser.name} streakDays={streak.days} streakNote={streak.note} />

        <StatsRow stats={stats} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <TodayTasksCard initialTasks={tasks} />
          <ActiveGoalsCard goals={goals} />
          <div className="flex flex-col gap-4">
            <UpcomingCard events={upcomingEvents} />
            <QuickActionsCard actions={quickActions} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <RecentActivityCard activity={recentActivity} className="lg:col-span-2" />
          <div className="flex flex-col gap-4">
            <SocialGrowthCard items={socialGrowth} />
            <AiFocusCard icon={aiFocus.icon} segments={aiFocus.segments} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
