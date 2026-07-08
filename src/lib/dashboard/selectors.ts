import {
  Award,
  Briefcase,
  BookOpen,
  Calendar,
  Camera,
  Code2,
  ListChecks,
  LogIn,
  LogOut,
  Share2,
  Sparkles,
  Target,
} from "lucide-react";

import type {
  ActivityItem,
  AiRecommendation,
  GoalItem,
  QuickAction,
  SocialGrowthItem,
  StatCardData,
  TaskItem,
  UpcomingEvent,
} from "@/components/dashboard/types";
import { compareDashboardDates, getRelativeDateLabel, parseDashboardDate } from "@/lib/dashboard/date-utils";
import { toTaskItems } from "@/lib/dashboard/tasks-storage";
import { isGoalOnTrack } from "@/lib/goals/constants";
import { toGoals } from "@/lib/goals/storage";
import { buildFollowerGrowthSummary as buildInstagramFollowerSummary } from "@/lib/instagram/storage";
import { buildAiToolsStats } from "@/lib/ai-tools/storage";
import { buildJobTrackerStats } from "@/lib/job-tracker/storage";
import { buildLearningStats, isLearningCheckedIn } from "@/lib/learning/storage";
import { buildFollowerGrowthSummary as buildLinkedInFollowerSummary } from "@/lib/linkedin/storage";
import { buildProjectStats } from "@/lib/projects/storage";
import type { DashboardModuleStates } from "@/lib/dashboard/state";

export interface DashboardStreak {
  days: number;
  note: string;
}

export interface DashboardAiFocus {
  icon: typeof Sparkles;
  segments: { text: string; bold: boolean }[];
}

interface FocusCandidate {
  id: string;
  label: string;
  sortDate: number;
}

interface ActivityCandidate extends ActivityItem {
  sortIndex: number;
}

function parseStreakDays(value: string): number {
  const match = value.match(/(\d+)/);

  return match ? Number(match[1]) : 0;
}

function isActiveGoal(status: string): boolean {
  return status !== "Completed" && status !== "Archived";
}

function findStat(stats: StatCardData[], id: string): StatCardData | undefined {
  return stats.find((stat) => stat.id === id);
}

function stripSortDate<T extends { sortDate: number }>(item: T): Omit<T, "sortDate"> {
  const { sortDate: _ignored, ...rest } = item;
  void _ignored;
  return rest;
}

function stripSortIndex<T extends { sortIndex: number }>(item: T): Omit<T, "sortIndex"> {
  const { sortIndex: _ignored, ...rest } = item;
  void _ignored;
  return rest;
}

function buildTrendLabel(count: number, singular: string, plural: string, empty: string): string {
  if (count === 0) {
    return empty;
  }

  return count === 1 ? `1 ${singular}` : `${count} ${plural}`;
}

export function buildDashboardStreak(states: DashboardModuleStates): DashboardStreak {
  return {
    days: parseStreakDays(states.learning.dailyStreak),
    note: states.learning.dailyStreakTrend.replace(/\s*🔥\s*/g, "").trim() || "Keep it going",
  };
}

export function buildDashboardStats(states: DashboardModuleStates): StatCardData[] {
  const learningStats = buildLearningStats(states.learning);
  const aiToolsStats = buildAiToolsStats(states.aiTools);
  const jobStats = buildJobTrackerStats(states.jobTracker);
  const projectStats = buildProjectStats(states.projects);

  const hoursStat = findStat(learningStats, "hours-this-week");
  const activeCoursesStat = findStat(learningStats, "active-courses");
  const toolsStat = findStat(aiToolsStats, "tools-tracked");
  const expertStat = findStat(aiToolsStats, "expert-level");
  const activeAppsStat = findStat(jobStats, "active");
  const interviewsStat = findStat(jobStats, "interviews");
  const totalProjectsStat = findStat(projectStats, "total-projects");
  const liveProjectsStat = findStat(projectStats, "live");
  const interviewCount = interviewsStat ? Number(interviewsStat.value) : 0;
  const liveCount = liveProjectsStat ? Number(liveProjectsStat.value) : 0;

  return [
    {
      id: "learning",
      label: "Learning",
      value: hoursStat?.value ?? "0h",
      sublabel: "this week",
      trend:
        activeCoursesStat && Number(activeCoursesStat.value) > 0
          ? `${activeCoursesStat.value} active courses`
          : "Check in to start",
      icon: BookOpen,
      color: "#e80584",
      tint: "rgba(232,5,132,0.09)",
    },
    {
      id: "ai-tools",
      label: "AI Tools",
      value: toolsStat?.value ?? "0",
      sublabel: "tracked",
      trend:
        expertStat && Number(expertStat.value) > 0
          ? `${expertStat.value} at expert level`
          : "Add AI tools",
      icon: Sparkles,
      color: "#5b5bd6",
      tint: "rgba(91,91,214,0.09)",
    },
    {
      id: "job-applications",
      label: "Job Applications",
      value: activeAppsStat?.value ?? "0",
      sublabel: "active",
      trend:
        interviewCount > 0
          ? buildTrendLabel(interviewCount, "interview", "interviews", "Track applications")
          : "Track applications",
      icon: Briefcase,
      color: "#10b981",
      tint: "rgba(16,185,129,0.09)",
    },
    {
      id: "projects",
      label: "Projects",
      value: totalProjectsStat?.value ?? "0",
      sublabel: "total",
      trend: liveCount > 0 ? `${liveCount} live` : "Add a project",
      icon: Code2,
      color: "#17a5fb",
      tint: "rgba(23,165,251,0.09)",
    },
  ];
}

export function buildDashboardGoals(states: DashboardModuleStates): GoalItem[] {
  const activeGoals = states.goals.goals
    .filter((goal) => !goal.archived && isActiveGoal(goal.status))
    .slice(0, 3);

  if (activeGoals.length === 0) {
    return [];
  }

  return toGoals(activeGoals).map((goal) => ({
    id: goal.id,
    label: goal.title,
    percent: goal.percent,
    dueLabel: goal.dueLabel || "No target date",
    color: goal.color,
    tint: goal.trackTint,
  }));
}

function buildFocusCandidates(states: DashboardModuleStates): FocusCandidate[] {
  const candidates: FocusCandidate[] = [];

  states.learning.courses
    .filter((course) => course.status === "active")
    .forEach((course) => {
      candidates.push({
        id: `learning-${course.id}`,
        label: course.moduleLabel
          ? `Continue ${course.title}`
          : `Continue ${course.title}`,
        sortDate: Number.MAX_SAFE_INTEGER - course.percent,
      });
    });

  states.jobTracker.applications
    .filter((application) => !application.archived && application.applicationStatus === "Active")
    .forEach((application) => {
      const interviewDate = parseDashboardDate(application.interviewDate);
      const relativeDate = getRelativeDateLabel(interviewDate);

      if (application.interviewDate) {
        candidates.push({
          id: `job-interview-${application.id}`,
          label: relativeDate
            ? `${application.companyName} Interview ${relativeDate}`
            : `${application.companyName} Interview ${application.interviewDate}`,
          sortDate: interviewDate,
        });
        return;
      }

      const currentPipelineStage = application.pipeline.find((stage) => stage.status === "Current");

      candidates.push({
        id: `job-pipeline-${application.id}`,
        label: currentPipelineStage
          ? `Prepare for ${application.companyName} ${currentPipelineStage.name}`
          : `Follow up on ${application.companyName} application`,
        sortDate: Number.MAX_SAFE_INTEGER,
      });
    });

  states.goals.goals
    .filter((goal) => !goal.archived && goal.status === "In Progress")
    .forEach((goal) => {
      candidates.push({
        id: `goal-${goal.id}`,
        label: goal.goalTitle,
        sortDate: parseDashboardDate(goal.targetDate),
      });
    });

  states.linkedIn.posts
    .filter((post) => !post.archived && post.status === "Scheduled")
    .forEach((post) => {
      candidates.push({
        id: `linkedin-${post.id}`,
        label: `Publish ${post.postTitle}`,
        sortDate: parseDashboardDate(post.publishDate),
      });
    });

  states.instagram.posts
    .filter((post) => !post.archived && post.status === "Scheduled")
    .forEach((post) => {
      candidates.push({
        id: `instagram-${post.id}`,
        label: `Upload ${post.postTitle}`,
        sortDate: parseDashboardDate(post.publishDate),
      });
    });

  states.projects.projects
    .filter((project) => !project.archived && project.status === "Building")
    .forEach((project) => {
      candidates.push({
        id: `project-${project.id}`,
        label: `Push ${project.name} forward`,
        sortDate: Number.MAX_SAFE_INTEGER,
      });
    });

  states.certifications.certifications
    .filter((certification) => !certification.archived && certification.status === "In Progress")
    .forEach((certification) => {
      candidates.push({
        id: `cert-${certification.id}`,
        label: `Update ${certification.name} study notes`,
        sortDate: parseDashboardDate(certification.examDate),
      });
    });

  states.portfolio.projects
    .filter((project) => !project.archived && project.status === "Draft")
    .forEach((project) => {
      candidates.push({
        id: `portfolio-${project.id}`,
        label: `Finish ${project.title} case study`,
        sortDate: Number.MAX_SAFE_INTEGER,
      });
    });

  return candidates;
}

export function buildDashboardTasks(states: DashboardModuleStates): TaskItem[] {
  return toTaskItems(states.dashboardTasks.tasks);
}

export function buildDashboardAiRecommendations(states: DashboardModuleStates): AiRecommendation[] {
  const { tasks, ignoredSuggestionIds } = states.dashboardTasks;
  const addedSuggestionIds = new Set(
    tasks.map((task) => task.sourceSuggestionId).filter((id): id is string => Boolean(id))
  );
  const ignoredIds = new Set(ignoredSuggestionIds);

  return buildFocusCandidates(states)
    .filter((candidate) => !addedSuggestionIds.has(candidate.id) && !ignoredIds.has(candidate.id))
    .sort((left, right) => compareDashboardDates(left.sortDate, right.sortDate))
    .slice(0, 3)
    .map((candidate) => ({
      id: candidate.id,
      label: candidate.label,
    }));
}

export function buildDashboardUpcoming(states: DashboardModuleStates): UpcomingEvent[] {
  const events: Array<UpcomingEvent & { sortDate: number }> = [];

  states.jobTracker.applications
    .filter((application) => !application.archived && application.interviewDate)
    .forEach((application) => {
      const sortDate = parseDashboardDate(application.interviewDate);

      events.push({
        id: `job-${application.id}`,
        title: `${application.companyName} Interview`,
        dateLabel: `${application.interviewDate} · Interview`,
        icon: Calendar,
        color: "#5b5bd6",
        tint: "rgba(91,91,214,0.09)",
        badge: getRelativeDateLabel(sortDate) === "Tomorrow" || getRelativeDateLabel(sortDate) === "Today" ? "Soon" : undefined,
        sortDate,
      });
    });

  states.certifications.certifications
    .filter((certification) => !certification.archived && certification.examDate)
    .forEach((certification) => {
      events.push({
        id: `cert-${certification.id}`,
        title: certification.name,
        dateLabel: `${certification.examDate} · Cert`,
        icon: Award,
        color: "#10b981",
        tint: "rgba(16,185,129,0.09)",
        sortDate: parseDashboardDate(certification.examDate),
      });
    });

  states.linkedIn.posts
    .filter((post) => !post.archived && post.status === "Scheduled" && post.publishDate)
    .forEach((post) => {
      events.push({
        id: `linkedin-${post.id}`,
        title: post.postTitle,
        dateLabel: `${post.publishDate} · Content`,
        icon: Share2,
        color: "#8b5cf6",
        tint: "rgba(139,92,246,0.09)",
        sortDate: parseDashboardDate(post.publishDate),
      });
    });

  states.instagram.posts
    .filter((post) => !post.archived && post.status === "Scheduled" && post.publishDate)
    .forEach((post) => {
      events.push({
        id: `instagram-${post.id}`,
        title: post.postTitle,
        dateLabel: `${post.publishDate} · Content`,
        icon: Camera,
        color: "#e1306c",
        tint: "rgba(225,48,108,0.15)",
        sortDate: parseDashboardDate(post.publishDate),
      });
    });

  states.goals.goals
    .filter((goal) => !goal.archived && goal.targetDate && isActiveGoal(goal.status))
    .forEach((goal) => {
      events.push({
        id: `goal-${goal.id}`,
        title: goal.goalTitle,
        dateLabel: `Due ${goal.targetDate} · Goal`,
        icon: Target,
        color: "#f59e0b",
        tint: "rgba(245,158,11,0.09)",
        sortDate: parseDashboardDate(goal.targetDate),
      });
    });

  if (events.length === 0) {
    return [
      {
        id: "empty-upcoming",
        title: "Nothing upcoming yet",
        dateLabel: "Add dates across your modules",
        icon: Calendar,
        color: "#94a3b8",
        tint: "rgba(148,163,184,0.12)",
      },
    ];
  }

  return events
    .sort((left, right) => compareDashboardDates(left.sortDate, right.sortDate))
    .slice(0, 4)
    .map(stripSortDate);
}

export function buildDashboardQuickActions(states: DashboardModuleStates): QuickAction[] {
  const checkedIn = isLearningCheckedIn(states.learning);

  return [
    {
      id: "learning-session",
      label: checkedIn ? "Check Out" : "Check In",
      icon: checkedIn ? LogOut : LogIn,
      color: checkedIn ? "#10b981" : "#5b5bd6",
      tint: checkedIn ? "rgba(16,185,129,0.09)" : "rgba(91,91,214,0.09)",
    },
    {
      id: "add-task",
      label: "Add Task",
      icon: ListChecks,
      color: "#10b981",
      tint: "rgba(16,185,129,0.09)",
    },
    {
      id: "new-goal",
      label: "New Goal",
      icon: Target,
      color: "#f59e0b",
      tint: "rgba(245,158,11,0.09)",
    },
    {
      id: "log-app",
      label: "Log App",
      icon: Briefcase,
      color: "#8b5cf6",
      tint: "rgba(139,92,246,0.09)",
    },
  ];
}

function buildActivityCandidates(states: DashboardModuleStates): ActivityCandidate[] {
  const candidates: ActivityCandidate[] = [];

  states.learning.courses.forEach((course, index) => {
    if (course.status === "completed") {
      candidates.push({
        id: `learning-completed-${course.id}`,
        title: `Completed ${course.title}`,
        meta: "Learning · Course",
        color: "#5b5bd6",
        sortIndex: index,
      });
      return;
    }

    candidates.push({
      id: `learning-added-${course.id}`,
      title: `Added new ${course.title}`,
      meta: "Learning · Course",
      color: "#5b5bd6",
      sortIndex: index,
    });
  });

  states.certifications.certifications.forEach((certification, index) => {
    if (certification.archived) {
      return;
    }

    if (certification.status === "Completed") {
      candidates.push({
        id: `cert-completed-${certification.id}`,
        title: `Completed ${certification.name}`,
        meta: "Certifications · Certification",
        color: "#8b5cf6",
        sortIndex: index,
      });
      return;
    }

    candidates.push({
      id: `cert-added-${certification.id}`,
      title: `Added ${certification.name}`,
      meta: "Certifications · Certification",
      color: "#8b5cf6",
      sortIndex: index,
    });
  });

  states.projects.projects.forEach((project, index) => {
    if (project.archived) {
      return;
    }

    candidates.push({
      id: `project-added-${project.id}`,
      title: `Added ${project.name}`,
      meta: "Projects · Project",
      color: "#f97316",
      sortIndex: index,
    });
  });

  states.portfolio.projects.forEach((project, index) => {
    if (project.archived) {
      return;
    }

    if (project.status === "Published") {
      candidates.push({
        id: `portfolio-published-${project.id}`,
        title: `Published ${project.title}`,
        meta: "Portfolio · Case study",
        color: "#10b981",
        sortIndex: index,
      });
      return;
    }

    candidates.push({
      id: `portfolio-added-${project.id}`,
      title: `Added ${project.title}`,
      meta: "Portfolio · Case study",
      color: "#10b981",
      sortIndex: index,
    });
  });

  states.jobTracker.applications.forEach((application, index) => {
    if (application.archived) {
      return;
    }

    candidates.push({
      id: `job-applied-${application.id}`,
      title: `Applied to ${application.companyName}`,
      meta: "Job Tracker · Application",
      color: "#f59e0b",
      sortIndex: index,
    });
  });

  states.goals.goals.forEach((goal, index) => {
    if (goal.archived) {
      return;
    }

    if (goal.status === "Completed") {
      candidates.push({
        id: `goal-completed-${goal.id}`,
        title: `Completed ${goal.goalTitle}`,
        meta: "Goals · Goal",
        color: "#17a5fb",
        sortIndex: index,
      });
      return;
    }

    candidates.push({
      id: `goal-added-${goal.id}`,
      title: `Added ${goal.goalTitle}`,
      meta: "Goals · Goal",
      color: "#17a5fb",
      sortIndex: index,
    });
  });

  states.linkedIn.posts.forEach((post, index) => {
    if (post.archived) {
      return;
    }

    if (post.status === "Published") {
      candidates.push({
        id: `linkedin-published-${post.id}`,
        title: `Published ${post.postTitle}`,
        meta: "LinkedIn · Post",
        color: "#0a66c2",
        sortIndex: index,
      });
      return;
    }

    candidates.push({
      id: `linkedin-added-${post.id}`,
      title: `Added ${post.postTitle}`,
      meta: "LinkedIn · Post",
      color: "#0a66c2",
      sortIndex: index,
    });
  });

  states.instagram.posts.forEach((post, index) => {
    if (post.archived) {
      return;
    }

    if (post.status === "Published") {
      candidates.push({
        id: `instagram-published-${post.id}`,
        title: `Published ${post.postTitle}`,
        meta: "Instagram · Post",
        color: "#e1306c",
        sortIndex: index,
      });
      return;
    }

    candidates.push({
      id: `instagram-added-${post.id}`,
      title: `Added ${post.postTitle}`,
      meta: "Instagram · Post",
      color: "#e1306c",
      sortIndex: index,
    });
  });

  states.aiTools.tools.forEach((tool, index) => {
    if (tool.status === "archived") {
      return;
    }

    candidates.push({
      id: `ai-tool-added-${tool.id}`,
      title: `Added ${tool.name}`,
      meta: "AI Tools · Tool",
      color: "#5b5bd6",
      sortIndex: index,
    });
  });

  return candidates;
}

export function buildDashboardActivity(states: DashboardModuleStates): ActivityItem[] {
  const activity = buildActivityCandidates(states)
    .sort((left, right) => right.sortIndex - left.sortIndex)
    .slice(0, 4)
    .map(stripSortIndex);

  if (activity.length === 0) {
    return [
      {
        id: "empty-activity",
        title: "No recent activity yet",
        meta: "Updates will appear as you work",
        color: "#94a3b8",
      },
    ];
  }

  return activity;
}

export function buildDashboardSocialGrowth(states: DashboardModuleStates): SocialGrowthItem[] {
  const linkedInSummary = buildLinkedInFollowerSummary(states.linkedIn);
  const instagramSummary = buildInstagramFollowerSummary(states.instagram);
  const linkedInDelta = linkedInSummary.growthLabel.replace(/^\+/, "+");
  const instagramDelta = instagramSummary.growthLabel.replace(/^\+/, "+");

  return [
    {
      id: "linkedin",
      platform: "LinkedIn",
      icon: Share2,
      value: linkedInSummary.current.toLocaleString("en-US"),
      delta: linkedInDelta.startsWith("+") ? linkedInDelta : `+${linkedInDelta}`,
      goalLabel: linkedInSummary.progressLabel,
      percent: linkedInSummary.percent,
      color: "#0a66c2",
      tint: "rgba(10,102,194,0.15)",
    },
    {
      id: "instagram",
      platform: "Instagram",
      icon: Camera,
      value: instagramSummary.current.toLocaleString("en-US"),
      delta: instagramDelta.startsWith("+") ? instagramDelta : `+${instagramDelta}`,
      goalLabel: instagramSummary.progressLabel,
      percent: instagramSummary.percent,
      color: "#e1306c",
      tint: "rgba(225,48,108,0.15)",
    },
  ];
}

export function buildDashboardAiFocus(states: DashboardModuleStates): DashboardAiFocus {
  const focusItems = buildFocusCandidates(states).sort((left, right) =>
    compareDashboardDates(left.sortDate, right.sortDate)
  );
  const nextFocus = focusItems[0];
  const nextInterview = states.jobTracker.applications.find(
    (application) =>
      !application.archived &&
      application.applicationStatus === "Active" &&
      application.interviewDate
  );
  const nextCertification = states.certifications.certifications.find(
    (certification) =>
      !certification.archived &&
      certification.status === "In Progress" &&
      certification.examDate
  );
  const behindGoals = states.goals.goals.filter(
    (goal) => !goal.archived && isActiveGoal(goal.status) && !isGoalOnTrack(goal.status, goal.progress)
  ).length;
  const scheduledLinkedIn = states.linkedIn.posts.filter(
    (post) => !post.archived && post.status === "Scheduled"
  ).length;

  if (!nextFocus && behindGoals === 0 && scheduledLinkedIn === 0) {
    return {
      icon: Sparkles,
      segments: [
        {
          text: "Add activity across your modules to unlock personalized focus insights.",
          bold: false,
        },
      ],
    };
  }

  const segments: { text: string; bold: boolean }[] = [];

  if (nextInterview) {
    const relativeDate = getRelativeDateLabel(parseDashboardDate(nextInterview.interviewDate));
    segments.push({ text: `${nextInterview.companyName} interview `, bold: false });
    segments.push({ text: relativeDate || nextInterview.interviewDate, bold: true });
    segments.push({ text: ". ", bold: false });
  }

  if (nextCertification) {
    segments.push({ text: `${nextCertification.name} exam on `, bold: false });
    segments.push({ text: nextCertification.examDate, bold: true });
    segments.push({ text: ". ", bold: false });
  }

  if (scheduledLinkedIn > 0) {
    segments.push({ text: `${scheduledLinkedIn} LinkedIn post`, bold: false });
    segments.push({ text: scheduledLinkedIn === 1 ? " is" : "s are", bold: false });
    segments.push({ text: " scheduled", bold: true });
    segments.push({ text: ". ", bold: false });
  }

  if (behindGoals > 0) {
    segments.push({ text: `${behindGoals} goal`, bold: false });
    segments.push({ text: behindGoals === 1 ? " needs" : "s need", bold: false });
    segments.push({ text: " attention", bold: true });
    segments.push({ text: " today.", bold: false });
  } else if (nextFocus) {
    segments.push({ text: "Top focus: ", bold: false });
    segments.push({ text: nextFocus.label, bold: true });
    segments.push({ text: ".", bold: false });
  } else {
    segments.push({ text: "Stay focused on your highest-impact work today.", bold: false });
  }

  return {
    icon: Sparkles,
    segments,
  };
}

export function buildDashboardData(states: DashboardModuleStates) {
  return {
    streak: buildDashboardStreak(states),
    stats: buildDashboardStats(states),
    tasks: buildDashboardTasks(states),
    aiRecommendations: buildDashboardAiRecommendations(states),
    goals: buildDashboardGoals(states),
    upcomingEvents: buildDashboardUpcoming(states),
    quickActions: buildDashboardQuickActions(states),
    recentActivity: buildDashboardActivity(states),
    socialGrowth: buildDashboardSocialGrowth(states),
    aiFocus: buildDashboardAiFocus(states),
  };
}
