import type { LucideIcon } from "lucide-react";

export interface FollowerGrowthPoint {
  week: string;
  followers: number;
}

export interface FollowerGrowthSummary {
  current: number;
  target: number;
  percent: number;
  growthLabel: string;
  progressLabel: string;
}

export interface ContentBreakdownItem {
  id: string;
  label: string;
  count: number;
  avgReachLabel: string;
  icon: LucideIcon;
  cardBg: string;
  iconBg: string;
  iconColor: string;
}
