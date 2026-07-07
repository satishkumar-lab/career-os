import type { LinkedInPostStatus, LinkedInPostType } from "@/components/linkedin/types";

export const LINKEDIN_STORAGE_KEY = "career-os-linkedin";

export const FOLLOWER_TARGET = 5000;
export const BASELINE_FOLLOWERS = 312;
export const GROWTH_WEEKS = 8;
export const POSTS_PER_MONTH_GOAL = 8;

export const linkedInPostTypes: LinkedInPostType[] = [
  "Text",
  "Carousel",
  "Image",
  "Video",
  "Article",
];

export const linkedInPostStatuses: LinkedInPostStatus[] = [
  "Draft",
  "Scheduled",
  "Published",
  "Archived",
];

export const linkedInPostFormSchema = {
  postTitle: { required: true },
  postType: { required: true },
  status: { required: true },
  postUrl: { url: true },
  impressions: { min: 0 },
  likes: { min: 0 },
  comments: { min: 0 },
  reposts: { min: 0 },
  followersGained: { min: 0 },
};

export const legacySeedDates: Record<string, string> = {
  "post-1": "Jul 3",
  "post-2": "Jun 28",
  "post-3": "Jun 22",
};

export const legacySeedImpressions: Record<string, number> = {
  "post-1": 4200,
  "post-2": 8900,
  "post-3": 2100,
};

export const legacySeedLikes: Record<string, number> = {
  "post-1": 183,
  "post-2": 421,
  "post-3": 89,
};

export const legacySeedFollowersGained: Record<string, number> = {
  "post-1": 50,
  "post-2": 150,
  "post-3": 75,
};
