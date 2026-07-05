import { BookOpen, Clock, Flame, GraduationCap } from "lucide-react";

import type { StatCardData } from "@/components/dashboard/types";
import type { Course, WeeklyHoursPoint } from "@/components/learning/types";

/**
 * Mock data standing in for the CareerOS API/Supabase queries for the
 * Learning page. Shapes mirror the expected real endpoints.
 */

export const learningStats: StatCardData[] = [
  {
    id: "hours-this-week",
    label: "Hours This Week",
    value: "8.5h",
    sublabel: "this week",
    trend: "+2.1h vs last week",
    icon: Clock,
    color: "#3b82f6",
    tint: "rgba(59,130,246,0.09)",
  },
  {
    id: "daily-streak",
    label: "Daily Streak",
    value: "14d",
    sublabel: "personal best",
    trend: "Personal best 🔥",
    icon: Flame,
    color: "#f59e0b",
    tint: "rgba(245,158,11,0.09)",
  },
  {
    id: "active-courses",
    label: "Active Courses",
    value: "3",
    sublabel: "in progress",
    trend: "In progress",
    icon: BookOpen,
    color: "#5b5bd6",
    tint: "rgba(91,91,214,0.09)",
  },
  {
    id: "completed",
    label: "Completed",
    value: "2",
    sublabel: "all time",
    trend: "All time",
    icon: GraduationCap,
    color: "#10b981",
    tint: "rgba(16,185,129,0.09)",
  },
];

export const weeklyHours: WeeklyHoursPoint[] = [
  { label: "Mon", hours: 1.5 },
  { label: "Tue", hours: 2.2 },
  { label: "Wed", hours: 1.8 },
  { label: "Thu", hours: 2.8 },
  { label: "Fri", hours: 2.1 },
  { label: "Sat", hours: 2.6 },
  { label: "Sun", hours: 3 },
];

export const weeklyHoursTotal = "16h this week";

export const courses: Course[] = [
  {
    id: "course-1",
    title: "Product Analytics Masterclass",
    provider: "Mixpanel",
    moduleLabel: "Module 7/12",
    timeLeftLabel: "4.5h left",
    percent: 67,
    color: "#5b5bd6",
    tint: "rgba(91,91,214,0.09)",
    icon: "analytics",
    status: "active",
  },
  {
    id: "course-2",
    title: "Leadership Fundamentals",
    provider: "Reforge",
    moduleLabel: "Module 4/11",
    timeLeftLabel: "12h left",
    percent: 34,
    color: "#8b5cf6",
    tint: "rgba(139,92,246,0.09)",
    icon: "leadership",
    status: "active",
  },
  {
    id: "course-3",
    title: "AWS Solutions Architect",
    provider: "AWS Training",
    moduleLabel: "Module 10/13",
    timeLeftLabel: "2h left",
    percent: 81,
    color: "#10b981",
    tint: "rgba(16,185,129,0.09)",
    icon: "cloud",
    status: "active",
  },
  {
    id: "course-4",
    title: "UX Research Fundamentals",
    provider: "Coursera",
    moduleLabel: "Module 8/8",
    timeLeftLabel: "Completed Jun 12",
    percent: 100,
    color: "#10b981",
    tint: "rgba(16,185,129,0.09)",
    icon: "leadership",
    status: "completed",
  },
  {
    id: "course-5",
    title: "SQL for Analysts",
    provider: "DataCamp",
    moduleLabel: "Module 6/6",
    timeLeftLabel: "Completed May 28",
    percent: 100,
    color: "#10b981",
    tint: "rgba(16,185,129,0.09)",
    icon: "analytics",
    status: "completed",
  },
];
