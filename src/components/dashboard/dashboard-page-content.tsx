"use client";

import { useMemo } from "react";

import { AppLayout } from "@/components/layout/app-layout";
import { ActiveGoalsCard } from "@/components/dashboard/active-goals-card";
import { AiFocusCard } from "@/components/dashboard/ai-focus-card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { QuickActionsCard } from "@/components/dashboard/quick-actions-card";
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card";
import { SocialGrowthCard } from "@/components/dashboard/social-growth-card";
import { StatsRow } from "@/components/dashboard/stats-row";
import { TodayTasksCard } from "@/components/dashboard/today-tasks-card";
import { UpcomingCard } from "@/components/dashboard/upcoming-card";
import { buildDashboardData } from "@/lib/dashboard/selectors";
import { useDashboardState } from "@/lib/dashboard/use-dashboard-state";
import { useProfile } from "@/lib/settings/profile-context";

export function DashboardPageContent() {
  const [state] = useDashboardState();

  const dashboardData = useMemo(
    () => (state ? buildDashboardData(state) : null),
    [state]
  );

  return (
    <AppLayout
      streakDays={dashboardData?.streak.days}
      hasUnreadNotifications
    >
      {dashboardData ? <DashboardCards dashboardData={dashboardData} /> : null}
    </AppLayout>
  );
}

function DashboardCards({
  dashboardData,
}: {
  dashboardData: NonNullable<ReturnType<typeof buildDashboardData>>;
}) {
  const { profile } = useProfile();
  const {
    streak,
    stats,
    tasks,
    goals,
    upcomingEvents,
    quickActions,
    recentActivity,
    socialGrowth,
    aiFocus,
  } = dashboardData;

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader name={profile.name} streakDays={streak.days} streakNote={streak.note} />

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
  );
}
