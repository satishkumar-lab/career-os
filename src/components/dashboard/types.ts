import type { LucideIcon } from "lucide-react";

export interface StatCardData {
  id: string;
  label: string;
  value: string;
  sublabel?: string;
  trend: string;
  trendUp?: boolean;
  trendColor?: string;
  icon: LucideIcon;
  color: string;
  tint: string;
}

export interface TaskItem {
  id: string;
  label: string;
  done: boolean;
}

export interface GoalItem {
  id: string;
  label: string;
  percent: number;
  dueLabel: string;
  color: string;
  tint: string;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  dateLabel: string;
  icon: LucideIcon;
  color: string;
  tint: string;
  badge?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  tint: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  meta: string;
  color: string;
}

export interface SocialGrowthItem {
  id: string;
  platform: string;
  icon: LucideIcon;
  value: string;
  delta: string;
  goalLabel: string;
  percent: number;
  color: string;
  tint: string;
}
