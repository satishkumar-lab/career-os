import type { StatCardData } from "@/components/dashboard/types";
import type {
  ContentBreakdownItem,
  FollowerGrowthPoint,
  FollowerGrowthSummary,
  InstagramContentType,
  InstagramPost,
  InstagramPostStatus,
} from "@/components/instagram/types";
import { Camera, FileText, Target, TrendingUp } from "lucide-react";

import {
  BASELINE_FOLLOWERS,
  contentBreakdownBuckets,
  FOLLOWER_TARGET,
  GROWTH_WEEKS,
  INSTAGRAM_STORAGE_KEY,
  instagramContentTypes,
  instagramPostStatuses,
  legacySeedDates,
  legacySeedFollowersGained,
  legacySeedLikes,
  legacySeedReach,
  legacySeedTitles,
} from "@/lib/instagram/constants";
import { instagramBreakdownIcons } from "@/lib/instagram/icons";
import { createItem, deleteItem, updateItem } from "@/lib/storage/crud";
import { readStorage, writeStorage } from "@/lib/storage/local-storage";

export interface PersistedInstagramPost {
  id: string;
  postTitle: string;
  contentType: InstagramContentType;
  status: InstagramPostStatus;
  publishDate: string;
  postUrl: string;
  caption: string;
  topic: string;
  contentPillar: string;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  followersGained: number;
  hashtags: string;
  notes: string;
  favourite: boolean;
  archived: boolean;
}

export interface InstagramPersistedState {
  posts: PersistedInstagramPost[];
}

export interface InstagramPostInput {
  postTitle: string;
  contentType: InstagramContentType;
  status: InstagramPostStatus;
  publishDate: string;
  postUrl: string;
  caption: string;
  topic: string;
  contentPillar: string;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  followersGained: number;
  hashtags: string;
  notes: string;
  favourite: boolean;
  archived: boolean;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

function isContentType(value: string): value is InstagramContentType {
  return instagramContentTypes.includes(value as InstagramContentType);
}

function isPostStatus(value: string): value is InstagramPostStatus {
  return instagramPostStatuses.includes(value as InstagramPostStatus);
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

function migrateInstagramPostRecord(raw: unknown): PersistedInstagramPost {
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

  let reach = parseNumber(record.reach);

  if (!reach && typeof record.reachLabel === "string") {
    reach = parseReach(record.reachLabel);
  }

  if (!reach && legacyId && legacyId in legacySeedReach) {
    reach = legacySeedReach[legacyId];
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
          : legacyId && legacyId in legacySeedTitles
            ? legacySeedTitles[legacyId]
            : "",
    contentType:
      typeof record.contentType === "string" && isContentType(record.contentType)
        ? record.contentType
        : "Single Image",
    status:
      typeof record.status === "string" && isPostStatus(record.status) ? record.status : "Published",
    publishDate,
    postUrl: typeof record.postUrl === "string" ? record.postUrl : "",
    caption: typeof record.caption === "string" ? record.caption : "",
    topic: typeof record.topic === "string" ? record.topic : "",
    contentPillar: typeof record.contentPillar === "string" ? record.contentPillar : "",
    reach,
    likes,
    comments: parseNumber(record.comments),
    shares: parseNumber(record.shares),
    saves: parseNumber(record.saves),
    followersGained,
    hashtags: typeof record.hashtags === "string" ? record.hashtags : "",
    notes: typeof record.notes === "string" ? record.notes : "",
    favourite: typeof record.favourite === "boolean" ? record.favourite : false,
    archived: typeof record.archived === "boolean" ? record.archived : false,
  };
}

function migrateInstagramState(raw: unknown): InstagramPersistedState {
  if (!raw || typeof raw !== "object" || !("posts" in raw) || !Array.isArray(raw.posts)) {
    return createSeedState();
  }

  const state = raw as { posts: unknown[] };

  return {
    posts: state.posts.map(migrateInstagramPostRecord),
  };
}

function createSeedState(): InstagramPersistedState {
  return {
    posts: [],
  };
}

function normalizeInstagramPost(
  input: InstagramPostInput,
  existing?: PersistedInstagramPost
): PersistedInstagramPost {
  return {
    id: existing?.id ?? crypto.randomUUID(),
    postTitle: input.postTitle.trim(),
    contentType: input.contentType,
    status: input.status,
    publishDate: input.publishDate.trim(),
    postUrl: input.postUrl.trim(),
    caption: input.caption.trim(),
    topic: input.topic.trim(),
    contentPillar: input.contentPillar.trim(),
    reach: input.reach,
    likes: input.likes,
    comments: input.comments,
    shares: input.shares,
    saves: input.saves,
    followersGained: input.followersGained,
    hashtags: input.hashtags.trim(),
    notes: input.notes.trim(),
    favourite: input.favourite,
    archived: input.archived,
  };
}

function getVisiblePosts(state: InstagramPersistedState): PersistedInstagramPost[] {
  return state.posts.filter((post) => !post.archived);
}

function getPublishedPosts(state: InstagramPersistedState): PersistedInstagramPost[] {
  return getVisiblePosts(state).filter((post) => post.status === "Published");
}

function getCurrentFollowers(state: InstagramPersistedState): number {
  const gained = getPublishedPosts(state).reduce((total, post) => total + post.followersGained, 0);

  return BASELINE_FOLLOWERS + gained;
}

function formatTarget(value: number): string {
  return value.toLocaleString("en-US");
}

function formatReachShort(value: number): string {
  if (value >= 1000) {
    const formatted = (value / 1000).toFixed(1).replace(/\.0$/, "");
    return `${formatted}K`;
  }

  return value.toLocaleString("en-US");
}

function formatImpressions(value: number): string {
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

export function toInstagramPost(post: PersistedInstagramPost): InstagramPost {
  return {
    id: post.id,
    title: post.postTitle,
    dateLabel: post.publishDate,
    reach: formatImpressions(post.reach),
    likesLabel: `${post.likes} likes`,
    favourite: post.favourite,
    archived: post.archived,
  };
}

export function toInstagramPosts(posts: PersistedInstagramPost[]): InstagramPost[] {
  return posts.map(toInstagramPost);
}

export function buildFollowerGrowthSummary(state: InstagramPersistedState): FollowerGrowthSummary {
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

export function buildFollowerGrowthData(state: InstagramPersistedState): FollowerGrowthPoint[] {
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

export function buildContentBreakdown(state: InstagramPersistedState): ContentBreakdownItem[] {
  const publishedPosts = getPublishedPosts(state);

  return contentBreakdownBuckets.map((bucket) => {
    const bucketPosts = publishedPosts.filter((post) => bucket.types.includes(post.contentType));
    const count = bucketPosts.length;
    const averageReach =
      count > 0
        ? Math.round(bucketPosts.reduce((total, post) => total + post.reach, 0) / count)
        : 0;

    return {
      id: bucket.id,
      label: bucket.label,
      count,
      avgReachLabel: `Avg reach: ${formatReachShort(averageReach)}`,
      icon: instagramBreakdownIcons[bucket.iconKey],
      cardBg: bucket.cardBg,
      iconBg: bucket.iconBg,
      iconColor: bucket.iconColor,
    };
  });
}

export function buildInstagramStats(state: InstagramPersistedState): StatCardData[] {
  const publishedPosts = getPublishedPosts(state);
  const currentFollowers = getCurrentFollowers(state);
  const currentMonthKey = getCurrentMonthKey();
  const followersThisMonth = publishedPosts
    .filter((post) => getMonthKeyFromPublishDate(post.publishDate) === currentMonthKey)
    .reduce((total, post) => total + post.followersGained, 0);
  const totalReach = publishedPosts.reduce((total, post) => total + post.reach, 0);
  const averageReach =
    publishedPosts.length > 0 ? Math.round(totalReach / publishedPosts.length) : 0;

  return [
    {
      id: "followers",
      label: "Followers",
      value: formatTarget(currentFollowers),
      trend: `+${followersThisMonth} this month`,
      icon: Camera,
      color: "#e1306c",
      tint: "rgba(225,48,108,0.09)",
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
      id: "total-posts",
      label: "Total Posts",
      value: String(publishedPosts.length),
      trend: "Published",
      icon: FileText,
      color: "#10b981",
      tint: "rgba(16,185,129,0.09)",
    },
    {
      id: "avg-reach",
      label: "Avg Reach",
      value: formatReachShort(averageReach),
      trend: "Per post",
      icon: TrendingUp,
      color: "#f59e0b",
      tint: "rgba(245,158,11,0.09)",
    },
  ];
}

export function initInstagramState(): InstagramPersistedState {
  const existing = readStorage<unknown>(INSTAGRAM_STORAGE_KEY);

  if (!existing) {
    const seed = createSeedState();
    writeStorage(INSTAGRAM_STORAGE_KEY, seed);
    return seed;
  }

  const migrated = migrateInstagramState(existing);
  writeStorage(INSTAGRAM_STORAGE_KEY, migrated);
  return migrated;
}

export function getInstagramState(): InstagramPersistedState {
  const existing = readStorage<unknown>(INSTAGRAM_STORAGE_KEY);

  if (!existing) {
    return createSeedState();
  }

  return migrateInstagramState(existing);
}

export function saveInstagramState(state: InstagramPersistedState): InstagramPersistedState {
  writeStorage(INSTAGRAM_STORAGE_KEY, state);
  return state;
}

export function addInstagramPost(
  state: InstagramPersistedState,
  input: InstagramPostInput
): InstagramPersistedState {
  const nextState = {
    ...state,
    posts: createItem(state.posts, normalizeInstagramPost(input)),
  };

  return saveInstagramState(nextState);
}

export function editInstagramPost(
  state: InstagramPersistedState,
  id: string,
  input: InstagramPostInput
): InstagramPersistedState {
  const existing = state.posts.find((post) => post.id === id);

  if (!existing) {
    return state;
  }

  const nextState = {
    ...state,
    posts: updateItem(state.posts, id, normalizeInstagramPost(input, existing)),
  };

  return saveInstagramState(nextState);
}

export function removeInstagramPost(
  state: InstagramPersistedState,
  id: string
): InstagramPersistedState {
  const nextState = {
    ...state,
    posts: deleteItem(state.posts, id),
  };

  return saveInstagramState(nextState);
}

export function archiveInstagramPost(
  state: InstagramPersistedState,
  id: string
): InstagramPersistedState {
  const existing = state.posts.find((post) => post.id === id);

  if (!existing) {
    return state;
  }

  const nextState = {
    ...state,
    posts: updateItem(state.posts, id, { archived: true }),
  };

  return saveInstagramState(nextState);
}

export function restoreInstagramPost(
  state: InstagramPersistedState,
  id: string
): InstagramPersistedState {
  const existing = state.posts.find((post) => post.id === id);

  if (!existing) {
    return state;
  }

  const nextState = {
    ...state,
    posts: updateItem(state.posts, id, { archived: false }),
  };

  return saveInstagramState(nextState);
}

export function setInstagramPostFavourite(
  state: InstagramPersistedState,
  id: string,
  favourite: boolean
): InstagramPersistedState {
  const existing = state.posts.find((post) => post.id === id);

  if (!existing) {
    return state;
  }

  const nextState = {
    ...state,
    posts: updateItem(state.posts, id, { favourite }),
  };

  return saveInstagramState(nextState);
}

export function instagramPostToInput(post: PersistedInstagramPost): InstagramPostInput {
  return {
    postTitle: post.postTitle,
    contentType: post.contentType,
    status: post.status,
    publishDate: post.publishDate,
    postUrl: post.postUrl,
    caption: post.caption,
    topic: post.topic,
    contentPillar: post.contentPillar,
    reach: post.reach,
    likes: post.likes,
    comments: post.comments,
    shares: post.shares,
    saves: post.saves,
    followersGained: post.followersGained,
    hashtags: post.hashtags,
    notes: post.notes,
    favourite: post.favourite,
    archived: post.archived,
  };
}

export function findPersistedInstagramPost(
  state: InstagramPersistedState,
  id: string
): PersistedInstagramPost | undefined {
  return state.posts.find((post) => post.id === id);
}

export function getFeaturedInstagramPosts(state: InstagramPersistedState): PersistedInstagramPost[] {
  return state.posts
    .filter((post) => post.publishDate !== "")
    .sort((left, right) => {
      if (left.publishDate === right.publishDate) {
        return left.postTitle.localeCompare(right.postTitle);
      }

      return right.publishDate.localeCompare(left.publishDate);
    })
    .slice(0, 10);
}
