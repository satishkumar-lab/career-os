import { FileText, Globe, Target, TrendingUp } from "lucide-react";

import type { StatCardData } from "@/components/dashboard/types";
import type {
  FollowerGrowthPoint,
  FollowerGrowthSummary,
  LinkedInPost,
} from "@/components/linkedin/types";

export const linkedInStats: StatCardData[] = [
  {
    id: "followers",
    label: "Followers",
    value: "587",
    trend: "+52 this month",
    icon: Globe,
    color: "#0ea5e9",
    tint: "rgba(14,165,233,0.09)",
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
    id: "posts-per-month",
    label: "Posts / Month",
    value: "6",
    trend: "Goal: 8/month",
    trendUp: false,
    trendColor: "#e17100",
    icon: FileText,
    color: "#10b981",
    tint: "rgba(16,185,129,0.09)",
  },
  {
    id: "best-post-reach",
    label: "Best Post Reach",
    value: "8.9K",
    trend: "Jun 28 post",
    icon: TrendingUp,
    color: "#f59e0b",
    tint: "rgba(245,158,11,0.09)",
  },
];

export const followerGrowthSummary: FollowerGrowthSummary = {
  current: 587,
  target: 5000,
  percent: 12,
  growthLabel: "+275 in 8 weeks",
  progressLabel: "587 / 5,000 goal · 12% there",
};

export const followerGrowthData: FollowerGrowthPoint[] = [
  { week: "W1", followers: 312 },
  { week: "W2", followers: 346 },
  { week: "W3", followers: 378 },
  { week: "W4", followers: 412 },
  { week: "W5", followers: 455 },
  { week: "W6", followers: 498 },
  { week: "W7", followers: 542 },
  { week: "W8", followers: 587 },
];

export const linkedInPosts: LinkedInPost[] = [
  {
    id: "post-1",
    title: "5 metrics every PM should track",
    dateLabel: "Jul 3",
    reach: "4,200",
    likesLabel: "183 likes",
  },
  {
    id: "post-2",
    title: "How I got my first PM role",
    dateLabel: "Jun 28",
    reach: "8,900",
    likesLabel: "421 likes",
  },
  {
    id: "post-3",
    title: "AWS certification tips",
    dateLabel: "Jun 22",
    reach: "2,100",
    likesLabel: "89 likes",
  },
];
