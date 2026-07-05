import { Camera, FileText, Images, Target, TrendingUp } from "lucide-react";

import type { StatCardData } from "@/components/dashboard/types";
import type {
  ContentBreakdownItem,
  FollowerGrowthPoint,
  FollowerGrowthSummary,
} from "@/components/instagram/types";

export const instagramStats: StatCardData[] = [
  {
    id: "followers",
    label: "Followers",
    value: "1,048",
    trend: "+207 this month",
    icon: Camera,
    color: "#e1306c",
    tint: "rgba(225,48,108,0.09)",
  },
  {
    id: "target",
    label: "Target",
    value: "5,000",
    trend: "By Dec 2025",
    icon: Target,
    color: "#5b5bd6",
    tint: "rgba(91,91,214,0.09)",
  },
  {
    id: "total-posts",
    label: "Total Posts",
    value: "42",
    trend: "Published",
    icon: FileText,
    color: "#10b981",
    tint: "rgba(16,185,129,0.09)",
  },
  {
    id: "avg-reach",
    label: "Avg Reach",
    value: "2.4K",
    trend: "Per post",
    icon: TrendingUp,
    color: "#f59e0b",
    tint: "rgba(245,158,11,0.09)",
  },
];

export const followerGrowthSummary: FollowerGrowthSummary = {
  current: 1048,
  target: 5000,
  percent: 21,
  growthLabel: "+207 in 8 weeks",
  progressLabel: "1,048 / 5,000 goal · 21% there",
};

export const followerGrowthData: FollowerGrowthPoint[] = [
  { week: "W1", followers: 841 },
  { week: "W2", followers: 872 },
  { week: "W3", followers: 903 },
  { week: "W4", followers: 934 },
  { week: "W5", followers: 965 },
  { week: "W6", followers: 996 },
  { week: "W7", followers: 1022 },
  { week: "W8", followers: 1048 },
];

export const contentBreakdown: ContentBreakdownItem[] = [
  {
    id: "reels",
    label: "Reels",
    count: 18,
    avgReachLabel: "Avg reach: 3.2K",
    icon: Camera,
    cardBg: "#fff0f5",
    iconBg: "rgba(225,48,108,0.13)",
    iconColor: "#e1306c",
  },
  {
    id: "carousels",
    label: "Carousels",
    count: 14,
    avgReachLabel: "Avg reach: 2.1K",
    icon: Images,
    cardBg: "#eef0ff",
    iconBg: "rgba(91,91,214,0.13)",
    iconColor: "#5b5bd6",
  },
  {
    id: "static-posts",
    label: "Static Posts",
    count: 10,
    avgReachLabel: "Avg reach: 1.4K",
    icon: Camera,
    cardBg: "#fffbeb",
    iconBg: "rgba(245,158,11,0.13)",
    iconColor: "#f59e0b",
  },
];
