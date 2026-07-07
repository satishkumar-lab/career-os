export type LinkedInPostType = "Text" | "Carousel" | "Image" | "Video" | "Article";

export type LinkedInPostStatus = "Draft" | "Scheduled" | "Published" | "Archived";

export interface FollowerGrowthPoint {
  week: string;
  followers: number;
}

export interface LinkedInPost {
  id: string;
  title: string;
  dateLabel: string;
  reach: string;
  likesLabel: string;
  favourite: boolean;
  archived: boolean;
}

export interface FollowerGrowthSummary {
  current: number;
  target: number;
  percent: number;
  growthLabel: string;
  progressLabel: string;
}
