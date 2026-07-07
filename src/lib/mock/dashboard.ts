import {
  Award,
  Briefcase,
  BookOpen,
  Calendar,
  Camera,
  Clock,
  Flag,
  Flame,
  ListChecks,
  Share2,
  Sparkles,
  Target,
} from "lucide-react";

import type {
  ActivityItem,
  GoalItem,
  QuickAction,
  SocialGrowthItem,
  StatCardData,
  TaskItem,
  UpcomingEvent,
} from "@/components/dashboard/types";

/**
 * Mock data standing in for the CareerOS API/Supabase queries. Shapes
 * mirror what the real endpoints are expected to return, so wiring up
 * live data later is a drop-in replacement for these constants.
 */

export const streak = { days: 0, note: "Start a streak" };

export const stats: StatCardData[] = [
  {
    id: "goals-active",
    label: "Goals Active",
    value: "3",
    sublabel: "2 on track",
    trend: "+1 this month",
    icon: Flag,
    color: "#17a5fb",
    tint: "rgba(23,165,251,0.09)",
  },
  {
    id: "learning-hrs",
    label: "Learning Hrs",
    value: "8.5h",
    sublabel: "this week",
    trend: "+2.1h vs last week",
    icon: BookOpen,
    color: "#e80584",
    tint: "rgba(232,5,132,0.09)",
  },
  {
    id: "streak",
    label: "Streak",
    value: "14d",
    sublabel: "personal best",
    trend: "Keep it going! 🔥",
    icon: Flame,
    color: "#f59e0b",
    tint: "rgba(245,158,11,0.09)",
  },
  {
    id: "applications",
    label: "Applications",
    value: "4",
    sublabel: "active",
    trend: "1 technical round",
    icon: Briefcase,
    color: "#10b981",
    tint: "rgba(16,185,129,0.09)",
  },
];

export const tasks: TaskItem[] = [
  { id: "task-1", label: "Complete Module 7 of Product Analytics", done: false },
  { id: "task-2", label: "Push Fintech Dashboard to GitHub", done: true },
  { id: "task-3", label: "Write LinkedIn post on PM metrics", done: false },
  { id: "task-4", label: "Practice system design for Figma interview", done: false },
  { id: "task-5", label: "Update AWS cert study notes", done: true },
];

export const goals: GoalItem[] = [
  {
    id: "goal-1",
    label: "Land Senior PM role",
    percent: 68,
    dueLabel: "Due Q3 2025",
    color: "#5b5bd6",
    tint: "rgba(91,91,214,0.13)",
  },
  {
    id: "goal-2",
    label: "AWS Certification",
    percent: 81,
    dueLabel: "Due Aug 2025",
    color: "#10b981",
    tint: "rgba(16,185,129,0.13)",
  },
  {
    id: "goal-3",
    label: "5K LinkedIn followers",
    percent: 42,
    dueLabel: "Due Dec 2025",
    color: "#f59e0b",
    tint: "rgba(245,158,11,0.13)",
  },
];

export const upcomingEvents: UpcomingEvent[] = [
  {
    id: "event-1",
    title: "Figma Interview",
    dateLabel: "Jul 8 · Interview",
    icon: Calendar,
    color: "#5b5bd6",
    tint: "rgba(91,91,214,0.09)",
    badge: "Soon",
  },
  {
    id: "event-2",
    title: "AWS Exam Registration",
    dateLabel: "Jul 10 · Cert",
    icon: Award,
    color: "#10b981",
    tint: "rgba(16,185,129,0.09)",
  },
  {
    id: "event-3",
    title: "LinkedIn Article",
    dateLabel: "Jul 10 · Content",
    icon: Share2,
    color: "#8b5cf6",
    tint: "rgba(139,92,246,0.09)",
  },
  {
    id: "event-4",
    title: "AWS Exam",
    dateLabel: "Jul 18 · Cert",
    icon: Award,
    color: "#10b981",
    tint: "rgba(16,185,129,0.09)",
  },
];

export const quickActions: QuickAction[] = [
  { id: "log-hours", label: "Log Hours", icon: Clock, color: "#5b5bd6", tint: "rgba(91,91,214,0.09)" },
  { id: "add-task", label: "Add Task", icon: ListChecks, color: "#10b981", tint: "rgba(16,185,129,0.09)" },
  { id: "new-goal", label: "New Goal", icon: Target, color: "#f59e0b", tint: "rgba(245,158,11,0.09)" },
  { id: "log-app", label: "Log App", icon: Briefcase, color: "#8b5cf6", tint: "rgba(139,92,246,0.09)" },
];

export const recentActivity: ActivityItem[] = [
  { id: "activity-1", title: "Completed Module 6: Cohort Analysis", meta: "Learning · 2h ago", color: "#5b5bd6" },
  { id: "activity-2", title: "Published Fintech Dashboard case study", meta: "Portfolio · Yesterday", color: "#10b981" },
  { id: "activity-3", title: "Applied to Stripe — Senior PM", meta: "Jobs · 2 days ago", color: "#f59e0b" },
  { id: "activity-4", title: "Earned 12 career points this week", meta: "Achievement · 3 days ago", color: "#8b5cf6" },
];

export const socialGrowth: SocialGrowthItem[] = [
  {
    id: "linkedin",
    platform: "LinkedIn",
    icon: Share2,
    value: "587",
    delta: "+52",
    goalLabel: "587 / 5,000 goal",
    percent: 11.7,
    color: "#0a66c2",
    tint: "rgba(10,102,194,0.15)",
  },
  {
    id: "instagram",
    platform: "Instagram",
    icon: Camera,
    value: "1,048",
    delta: "+207",
    goalLabel: "1,048 / 5,000 goal",
    percent: 21,
    color: "#e1306c",
    tint: "rgba(225,48,108,0.15)",
  },
];

export const aiFocus = {
  icon: Sparkles,
  segments: [
    { text: "Figma interview in ", bold: false },
    { text: "3 days", bold: true },
    { text: ". AWS exam in ", bold: false },
    { text: "13 days", bold: true },
    { text: ". Both on track — prep for the interview today.", bold: false },
  ],
};
