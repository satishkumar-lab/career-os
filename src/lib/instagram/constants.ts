import type { InstagramContentType, InstagramPostStatus } from "@/components/instagram/types";

export const INSTAGRAM_STORAGE_KEY = "career-os-instagram";

export const FOLLOWER_TARGET = 5000;
export const BASELINE_FOLLOWERS = 0;
export const GROWTH_WEEKS = 8;

export const instagramContentTypes: InstagramContentType[] = [
  "Carousel",
  "Reel",
  "Single Image",
  "Story",
  "Video",
];

export const instagramPostStatuses: InstagramPostStatus[] = [
  "Idea",
  "Draft",
  "Scheduled",
  "Published",
  "Archived",
];

export const instagramPostFormSchema = {
  postTitle: { required: true },
  contentType: { required: true },
  status: { required: true },
  postUrl: { url: true },
  reach: { min: 0 },
  likes: { min: 0 },
  comments: { min: 0 },
  shares: { min: 0 },
  saves: { min: 0 },
  followersGained: { min: 0 },
};

export const contentBreakdownBuckets = [
  {
    id: "reels",
    label: "Reels",
    types: ["Reel"] as InstagramContentType[],
    cardBg: "#fff0f5",
    iconBg: "rgba(225,48,108,0.13)",
    iconColor: "#e1306c",
    iconKey: "reels" as const,
  },
  {
    id: "carousels",
    label: "Carousels",
    types: ["Carousel"] as InstagramContentType[],
    cardBg: "#eef0ff",
    iconBg: "rgba(91,91,214,0.13)",
    iconColor: "#5b5bd6",
    iconKey: "carousels" as const,
  },
  {
    id: "static-posts",
    label: "Static Posts",
    types: ["Single Image", "Story", "Video"] as InstagramContentType[],
    cardBg: "#fffbeb",
    iconBg: "rgba(245,158,11,0.13)",
    iconColor: "#f59e0b",
    iconKey: "static-posts" as const,
  },
];

export const seedDistribution: Array<{ contentType: InstagramContentType; count: number; reach: number }> = [
  { contentType: "Reel", count: 18, reach: 3200 },
  { contentType: "Carousel", count: 14, reach: 2100 },
  { contentType: "Single Image", count: 10, reach: 1400 },
];

export const legacySeedTitles: Record<string, string> = {
  "seed-reel": "PM metrics reel",
  "seed-carousel": "Career tips carousel",
  "seed-static": "Behind the scenes post",
};

export const legacySeedDates: Record<string, string> = {
  "seed-reel": "Jul 2",
  "seed-carousel": "Jun 25",
  "seed-static": "Jun 18",
};

export const legacySeedReach: Record<string, number> = {
  "seed-reel": 3200,
  "seed-carousel": 2100,
  "seed-static": 1400,
};

export const legacySeedLikes: Record<string, number> = {
  "seed-reel": 142,
  "seed-carousel": 98,
  "seed-static": 64,
};

export const legacySeedFollowersGained: Record<string, number> = {
  "seed-reel": 80,
  "seed-carousel": 70,
  "seed-static": 57,
};
