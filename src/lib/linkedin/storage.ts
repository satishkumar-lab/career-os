import type { StatCardData } from "@/components/dashboard/types";
import type {
  FollowerGrowthPoint,
  FollowerGrowthSummary,
  LinkedInPost,
  LinkedInPostStatus,
  LinkedInPostType,
} from "@/components/linkedin/types";
import { FileText, Globe, Target, TrendingUp } from "lucide-react";

import { linkedInPostSeeds } from "@/lib/mock/linkedin";
import {
  BASELINE_FOLLOWERS,
  FOLLOWER_TARGET,
  GROWTH_WEEKS,
  legacySeedDates,
  legacySeedFollowersGained,
  legacySeedImpressions,
  legacySeedLikes,
  LINKEDIN_STORAGE_KEY,
  linkedInPostStatuses,
  linkedInPostTypes,
  POSTS_PER_MONTH_GOAL,
} from "@/lib/linkedin/constants";
import { createItem, deleteItem, updateItem } from "@/lib/storage/crud";
import { readStorage, writeStorage } from "@/lib/storage/local-storage";

export interface PersistedLinkedInPost {
  id: string;
  postTitle: string;
  postType: LinkedInPostType;
  status: LinkedInPostStatus;
  publishDate: string;
  postUrl: string;
  topic: string;
  contentPillar: string;
  impressions: number;
  likes: number;
  comments: number;
  reposts: number;
  followersGained: number;
  notes: string;
  favourite: boolean;
  archived: boolean;
}

export interface LinkedInPersistedState {
  posts: PersistedLinkedInPost[];
}

export interface LinkedInPostInput {
  postTitle: string;
  postType: LinkedInPostType;
  status: LinkedInPostStatus;
  publishDate: string;
  postUrl: string;
  topic: string;
  contentPillar: string;
  impressions: number;
  likes: number;
  comments: number;
  reposts: number;
  followersGained: number;
  notes: string;
  favourite: boolean;
  archived: boolean;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

function isPostType(value: string): value is LinkedInPostType {
  return linkedInPostTypes.includes(value as LinkedInPostType);
}

function isPostStatus(value: string): value is LinkedInPostStatus {
  return linkedInPostStatuses.includes(value as LinkedInPostStatus);
}

function parseNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);

    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function parseReach(value: string): number {
  const normalized = value.replace(/,/g, "").trim().toUpperCase();

  if (normalized.endsWith("K")) {
    return Math.round(parseFloat(normalized.slice(0, -1)) * 1000);
  }

  return parseNumber(normalized, 0);
}

function parseLikesLabel(value: string): number {
  const match = value.match(/(\d+)/);

  return match ? Number(match[1]) : 0;
}

function migrateLinkedInPostRecord(raw: unknown): PersistedLinkedInPost {
  const record = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const rawId = typeof record.id === "string" ? record.id : "";
  const id = isUuid(rawId) ? rawId : crypto.randomUUID();
  const legacyId = rawId && !isUuid(rawId) ? rawId : undefined;

  let publishDate = typeof record.publishDate === "string" ? record.publishDate : "";

  if (!publishDate && typeof record.dateLabel === "string") {
    publishDate = record.dateLabel;
  }

  if (!publishDate && legacyId && legacyId in legacySeedDates) {
    publishDate = legacySeedDates[legacyId];
  }

  let impressions = parseNumber(record.impressions);

  if (!impressions && typeof record.reach === "string") {
    impressions = parseReach(record.reach);
  }

  if (!impressions && legacyId && legacyId in legacySeedImpressions) {
    impressions = legacySeedImpressions[legacyId];
  }

  let likes = parseNumber(record.likes);

  if (!likes && typeof record.likesLabel === "string") {
    likes = parseLikesLabel(record.likesLabel);
  }

  if (!likes && legacyId && legacyId in legacySeedLikes) {
    likes = legacySeedLikes[legacyId];
  }

  let followersGained = parseNumber(record.followersGained);

  if (!followersGained && legacyId && legacyId in legacySeedFollowersGained) {
    followersGained = legacySeedFollowersGained[legacyId];
  }

  return {
    id,
    postTitle:
      typeof record.postTitle === "string"
        ? record.postTitle
        : typeof record.title === "string"
          ? record.title
          : "",
    postType: typeof record.postType === "string" && isPostType(record.postType) ? record.postType : "Text",
    status:
      typeof record.status === "string" && isPostStatus(record.status) ? record.status : "Published",
    publishDate,
    postUrl: typeof record.postUrl === "string" ? record.postUrl : "",
    topic: typeof record.topic === "string" ? record.topic : "",
    contentPillar: typeof record.contentPillar === "string" ? record.contentPillar : "",
    impressions,
    likes,
    comments: parseNumber(record.comments),
    reposts: parseNumber(record.reposts),
    followersGained,
    notes: typeof record.notes === "string" ? record.notes : "",
    favourite: typeof record.favourite === "boolean" ? record.favourite : false,
    archived: typeof record.archived === "boolean" ? record.archived : false,
  };
}

function migrateLinkedInState(raw: unknown): LinkedInPersistedState {
  if (!raw || typeof raw !== "object" || !("posts" in raw) || !Array.isArray(raw.posts)) {
    return createSeedState();
  }

  const state = raw as { posts: unknown[] };

  return {
    posts: state.posts.map(migrateLinkedInPostRecord),
  };
}

function createSeedState(): LinkedInPersistedState {
  return {
    posts: linkedInPostSeeds.map((post) => ({
      id: crypto.randomUUID(),
      postTitle: post.title,
      postType: "Text" as LinkedInPostType,
      status: "Published" as LinkedInPostStatus,
      publishDate: legacySeedDates[post.id] ?? "",
      postUrl: "",
      topic: "",
      contentPillar: "",
      impressions: legacySeedImpressions[post.id] ?? 0,
      likes: legacySeedLikes[post.id] ?? 0,
      comments: 0,
      reposts: 0,
      followersGained: legacySeedFollowersGained[post.id] ?? 0,
      notes: "",
      favourite: false,
      archived: false,
    })),
  };
}

function normalizeLinkedInPost(
  input: LinkedInPostInput,
  existing?: PersistedLinkedInPost
): PersistedLinkedInPost {
  return {
    id: existing?.id ?? crypto.randomUUID(),
    postTitle: input.postTitle.trim(),
    postType: input.postType,
    status: input.status,
    publishDate: input.publishDate.trim(),
    postUrl: input.postUrl.trim(),
    topic: input.topic.trim(),
    contentPillar: input.contentPillar.trim(),
    impressions: input.impressions,
    likes: input.likes,
    comments: input.comments,
    reposts: input.reposts,
    followersGained: input.followersGained,
    notes: input.notes.trim(),
    favourite: input.favourite,
    archived: input.archived,
  };
}

function getVisiblePosts(state: LinkedInPersistedState): PersistedLinkedInPost[] {
  return state.posts.filter((post) => !post.archived);
}

function getCurrentFollowers(state: LinkedInPersistedState): number {
  const gained = getVisiblePosts(state)
    .filter((post) => post.status === "Published")
    .reduce((total, post) => total + post.followersGained, 0);

  return BASELINE_FOLLOWERS + gained;
}

function formatImpressions(value: number): string {
  return value.toLocaleString("en-US");
}

function formatReachShort(value: number): string {
  if (value >= 1000) {
    const formatted = (value / 1000).toFixed(1).replace(/\.0$/, "");
    return `${formatted}K`;
  }

  return value.toLocaleString("en-US");
}

function formatTarget(value: number): string {
  return value.toLocaleString("en-US");
}

function getMonthKeyFromPublishDate(publishDate: string): string | null {
  const match = publishDate.match(/^([A-Za-z]{3})\s+(\d{1,2})$/);

  if (!match) {
    return null;
  }

  const monthMap: Record<string, string> = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  const month = monthMap[match[1]];

  if (!month) {
    return null;
  }

  return `2026-${month}`;
}

function getCurrentMonthKey(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
}

export function toLinkedInPost(post: PersistedLinkedInPost): LinkedInPost {
  return {
    id: post.id,
    title: post.postTitle,
    dateLabel: post.publishDate,
    reach: formatImpressions(post.impressions),
    likesLabel: `${post.likes} likes`,
    favourite: post.favourite,
    archived: post.archived,
  };
}

export function toLinkedInPosts(posts: PersistedLinkedInPost[]): LinkedInPost[] {
  return posts.map(toLinkedInPost);
}

export function buildFollowerGrowthSummary(state: LinkedInPersistedState): FollowerGrowthSummary {
  const current = getCurrentFollowers(state);
  const gained = current - BASELINE_FOLLOWERS;
  const percent = Math.round((current / FOLLOWER_TARGET) * 100);

  return {
    current,
    target: FOLLOWER_TARGET,
    percent,
    growthLabel: `+${gained} in ${GROWTH_WEEKS} weeks`,
    progressLabel: `${current.toLocaleString("en-US")} / ${formatTarget(FOLLOWER_TARGET)} goal · ${percent}% there`,
  };
}

export function buildFollowerGrowthData(state: LinkedInPersistedState): FollowerGrowthPoint[] {
  const current = getCurrentFollowers(state);
  const range = current - BASELINE_FOLLOWERS;

  return Array.from({ length: GROWTH_WEEKS }, (_, index) => {
    const progress = index / (GROWTH_WEEKS - 1);

    return {
      week: `W${index + 1}`,
      followers: Math.round(BASELINE_FOLLOWERS + range * progress),
    };
  });
}

export function buildLinkedInStats(state: LinkedInPersistedState): StatCardData[] {
  const visiblePosts = getVisiblePosts(state);
  const publishedPosts = visiblePosts.filter((post) => post.status === "Published");
  const currentFollowers = getCurrentFollowers(state);
  const currentMonthKey = getCurrentMonthKey();
  const followersThisMonth = publishedPosts
    .filter((post) => getMonthKeyFromPublishDate(post.publishDate) === currentMonthKey)
    .reduce((total, post) => total + post.followersGained, 0);
  const postsThisMonth = publishedPosts.filter(
    (post) => getMonthKeyFromPublishDate(post.publishDate) === currentMonthKey
  ).length;
  const bestPost = publishedPosts.reduce<PersistedLinkedInPost | undefined>((best, post) => {
    if (!best || post.impressions > best.impressions) {
      return post;
    }

    return best;
  }, undefined);

  return [
    {
      id: "followers",
      label: "Followers",
      value: String(currentFollowers),
      trend: `+${followersThisMonth} this month`,
      icon: Globe,
      color: "#0ea5e9",
      tint: "rgba(14,165,233,0.09)",
    },
    {
      id: "target",
      label: "Target",
      value: formatTarget(FOLLOWER_TARGET),
      trend: "By Dec 2025",
      icon: Target,
      color: "#5b5bd6",
      tint: "rgba(91,91,214,0.09)",
    },
    {
      id: "posts-per-month",
      label: "Posts / Month",
      value: String(postsThisMonth),
      trend: `Goal: ${POSTS_PER_MONTH_GOAL}/month`,
      trendUp: postsThisMonth >= POSTS_PER_MONTH_GOAL,
      trendColor: postsThisMonth >= POSTS_PER_MONTH_GOAL ? undefined : "#e17100",
      icon: FileText,
      color: "#10b981",
      tint: "rgba(16,185,129,0.09)",
    },
    {
      id: "best-post-reach",
      label: "Best Post Reach",
      value: bestPost ? formatReachShort(bestPost.impressions) : "0",
      trend: bestPost?.publishDate ? `${bestPost.publishDate} post` : "No posts yet",
      icon: TrendingUp,
      color: "#f59e0b",
      tint: "rgba(245,158,11,0.09)",
    },
  ];
}

export function initLinkedInState(): LinkedInPersistedState {
  const existing = readStorage<unknown>(LINKEDIN_STORAGE_KEY);

  if (!existing) {
    const seed = createSeedState();
    writeStorage(LINKEDIN_STORAGE_KEY, seed);
    return seed;
  }

  const migrated = migrateLinkedInState(existing);
  writeStorage(LINKEDIN_STORAGE_KEY, migrated);
  return migrated;
}

export function getLinkedInState(): LinkedInPersistedState {
  const existing = readStorage<unknown>(LINKEDIN_STORAGE_KEY);

  if (!existing) {
    return createSeedState();
  }

  return migrateLinkedInState(existing);
}

export function saveLinkedInState(state: LinkedInPersistedState): LinkedInPersistedState {
  writeStorage(LINKEDIN_STORAGE_KEY, state);
  return state;
}

export function addLinkedInPost(
  state: LinkedInPersistedState,
  input: LinkedInPostInput
): LinkedInPersistedState {
  const nextState = {
    ...state,
    posts: createItem(state.posts, normalizeLinkedInPost(input)),
  };

  return saveLinkedInState(nextState);
}

export function editLinkedInPost(
  state: LinkedInPersistedState,
  id: string,
  input: LinkedInPostInput
): LinkedInPersistedState {
  const existing = state.posts.find((post) => post.id === id);

  if (!existing) {
    return state;
  }

  const nextState = {
    ...state,
    posts: updateItem(state.posts, id, normalizeLinkedInPost(input, existing)),
  };

  return saveLinkedInState(nextState);
}

export function removeLinkedInPost(
  state: LinkedInPersistedState,
  id: string
): LinkedInPersistedState {
  const nextState = {
    ...state,
    posts: deleteItem(state.posts, id),
  };

  return saveLinkedInState(nextState);
}

export function archiveLinkedInPost(
  state: LinkedInPersistedState,
  id: string
): LinkedInPersistedState {
  const existing = state.posts.find((post) => post.id === id);

  if (!existing) {
    return state;
  }

  const nextState = {
    ...state,
    posts: updateItem(state.posts, id, { archived: true }),
  };

  return saveLinkedInState(nextState);
}

export function restoreLinkedInPost(
  state: LinkedInPersistedState,
  id: string
): LinkedInPersistedState {
  const existing = state.posts.find((post) => post.id === id);

  if (!existing) {
    return state;
  }

  const nextState = {
    ...state,
    posts: updateItem(state.posts, id, { archived: false }),
  };

  return saveLinkedInState(nextState);
}

export function setLinkedInPostFavourite(
  state: LinkedInPersistedState,
  id: string,
  favourite: boolean
): LinkedInPersistedState {
  const existing = state.posts.find((post) => post.id === id);

  if (!existing) {
    return state;
  }

  const nextState = {
    ...state,
    posts: updateItem(state.posts, id, { favourite }),
  };

  return saveLinkedInState(nextState);
}

export function linkedInPostToInput(post: PersistedLinkedInPost): LinkedInPostInput {
  return {
    postTitle: post.postTitle,
    postType: post.postType,
    status: post.status,
    publishDate: post.publishDate,
    postUrl: post.postUrl,
    topic: post.topic,
    contentPillar: post.contentPillar,
    impressions: post.impressions,
    likes: post.likes,
    comments: post.comments,
    reposts: post.reposts,
    followersGained: post.followersGained,
    notes: post.notes,
    favourite: post.favourite,
    archived: post.archived,
  };
}

export function findPersistedLinkedInPost(
  state: LinkedInPersistedState,
  id: string
): PersistedLinkedInPost | undefined {
  return state.posts.find((post) => post.id === id);
}
