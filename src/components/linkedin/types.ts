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
}

export interface FollowerGrowthSummary {
  current: number;
  target: number;
  percent: number;
  growthLabel: string;
  progressLabel: string;
}
