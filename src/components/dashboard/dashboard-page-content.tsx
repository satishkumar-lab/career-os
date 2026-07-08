"use client";

import { useMemo, useState } from "react";

import { GoalFormModal } from "@/components/goals/goal-form-modal";
import { JobApplicationFormModal } from "@/components/job-tracker/job-application-form-modal";
import { AppLayout } from "@/components/layout/app-layout";
import { ActiveGoalsCard } from "@/components/dashboard/active-goals-card";
import { AiFocusCard } from "@/components/dashboard/ai-focus-card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { LogHoursModal } from "@/components/dashboard/log-hours-modal";
import { QuickActionsCard } from "@/components/dashboard/quick-actions-card";
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card";
import { SocialGrowthCard } from "@/components/dashboard/social-growth-card";
import { StatsRow } from "@/components/dashboard/stats-row";
import { TaskFormModal } from "@/components/dashboard/task-form-modal";
import { TodayTasksCard } from "@/components/dashboard/today-tasks-card";
import { UpcomingCard } from "@/components/dashboard/upcoming-card";
import { ToastProvider, useToast } from "@/components/shared/toast-provider";
import { buildDashboardData } from "@/lib/dashboard/selectors";
import { loadDashboardModuleStates } from "@/lib/dashboard/state";
import {
  addDashboardTask,
  addTaskFromSuggestion,
  ignoreDashboardSuggestion,
  toggleDashboardTask,
  type DashboardTaskInput,
} from "@/lib/dashboard/tasks-storage";
import { useDashboardState } from "@/lib/dashboard/use-dashboard-state";
import { addGoal, type GoalInput } from "@/lib/goals/storage";
import { addJobApplication, type JobApplicationInput } from "@/lib/job-tracker/storage";
import { logLearningHours } from "@/lib/learning/storage";
import { useProfile } from "@/lib/settings/profile-context";

export function DashboardPageContent() {
  return (
    <ToastProvider>
      <DashboardPageInner />
    </ToastProvider>
  );
}

function DashboardPageInner() {
  const [state, setState] = useDashboardState();

  const dashboardData = useMemo(
    () => (state ? buildDashboardData(state) : null),
    [state]
  );

  return (
    <AppLayout
      streakDays={dashboardData?.streak.days}
      hasUnreadNotifications
    >
      {dashboardData && state ? (
        <DashboardCards dashboardData={dashboardData} onRefresh={() => setState(loadDashboardModuleStates())} />
      ) : null}
    </AppLayout>
  );
}

function DashboardCards({
  dashboardData,
  onRefresh,
}: {
  dashboardData: NonNullable<ReturnType<typeof buildDashboardData>>;
  onRefresh: () => void;
}) {
  const { profile } = useProfile();
  const { showToast } = useToast();

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [logHoursModalOpen, setLogHoursModalOpen] = useState(false);
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);

  const {
    streak,
    stats,
    tasks,
    aiRecommendations,
    goals,
    upcomingEvents,
    quickActions,
    recentActivity,
    socialGrowth,
    aiFocus,
  } = dashboardData;

  const handleSaveTask = (input: DashboardTaskInput) => {
    const current = loadDashboardModuleStates();
    addDashboardTask(current.dashboardTasks, input);
    onRefresh();
    showToast("Task added successfully.");
  };

  const handleToggleTask = (id: string) => {
    const current = loadDashboardModuleStates();
    toggleDashboardTask(current.dashboardTasks, id);
    onRefresh();
  };

  const handleAddSuggestion = (suggestionId: string) => {
    const suggestion = aiRecommendations.find((item) => item.id === suggestionId);

    if (!suggestion) {
      return;
    }

    const current = loadDashboardModuleStates();
    addTaskFromSuggestion(current.dashboardTasks, suggestion.id, suggestion.label);
    onRefresh();
    showToast("Suggestion added to today's tasks.");
  };

  const handleIgnoreSuggestion = (suggestionId: string) => {
    const current = loadDashboardModuleStates();
    ignoreDashboardSuggestion(current.dashboardTasks, suggestionId);
    onRefresh();
  };

  const handleLogHours = (hours: number) => {
    const current = loadDashboardModuleStates();
    logLearningHours(current.learning, hours);
    onRefresh();
    showToast("Learning hours logged.");
  };

  const handleSaveGoal = (input: GoalInput) => {
    const current = loadDashboardModuleStates();
    addGoal(current.goals, input);
    onRefresh();
    showToast("Goal added successfully.");
  };

  const handleSaveApplication = (input: JobApplicationInput) => {
    const current = loadDashboardModuleStates();
    addJobApplication(current.jobTracker, input);
    onRefresh();
    showToast("Application logged successfully.");
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case "log-hours":
        setLogHoursModalOpen(true);
        break;
      case "add-task":
        setTaskModalOpen(true);
        break;
      case "new-goal":
        setGoalModalOpen(true);
        break;
      case "log-app":
        setApplicationModalOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader name={profile.name} streakDays={streak.days} streakNote={streak.note} />

      <StatsRow stats={stats} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <TodayTasksCard
          tasks={tasks}
          suggestions={aiRecommendations}
          onAddTask={() => setTaskModalOpen(true)}
          onToggleTask={handleToggleTask}
          onAddSuggestion={handleAddSuggestion}
          onIgnoreSuggestion={handleIgnoreSuggestion}
        />
        <ActiveGoalsCard goals={goals} />
        <div className="flex flex-col gap-4">
          <UpcomingCard events={upcomingEvents} />
          <QuickActionsCard actions={quickActions} onActionClick={handleQuickAction} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RecentActivityCard activity={recentActivity} className="lg:col-span-2" />
        <div className="flex flex-col gap-4">
          <SocialGrowthCard items={socialGrowth} />
          <AiFocusCard icon={aiFocus.icon} segments={aiFocus.segments} />
        </div>
      </div>

      <TaskFormModal
        open={taskModalOpen}
        onOpenChange={setTaskModalOpen}
        onSave={handleSaveTask}
      />
      <LogHoursModal
        open={logHoursModalOpen}
        onOpenChange={setLogHoursModalOpen}
        onSave={handleLogHours}
      />
      <GoalFormModal
        open={goalModalOpen}
        onOpenChange={setGoalModalOpen}
        onSave={handleSaveGoal}
      />
      <JobApplicationFormModal
        open={applicationModalOpen}
        onOpenChange={setApplicationModalOpen}
        onSave={handleSaveApplication}
      />
    </div>
  );
}
