import type { LucideIcon } from "lucide-react";

export type InstagramContentType = "Carousel" | "Reel" | "Single Image" | "Story" | "Video";

export type InstagramPostStatus = "Idea" | "Draft" | "Scheduled" | "Published" | "Archived";

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

export interface InstagramPost {
  id: string;
  title: string;
  dateLabel: string;
  reach: string;
  likesLabel: string;
  favourite: boolean;
  archived: boolean;
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
