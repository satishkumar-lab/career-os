import type { StatCardData } from "@/components/dashboard/types";
import type {
  Goal,
  GoalCategory,
  GoalDisplayCategory,
  GoalPriority,
  GoalWorkflowStatus,
} from "@/components/goals/types";
import { BarChart3, CheckCircle2, Flag, TrendingDown } from "lucide-react";

import {
  categoryColors,
  getCategoryDisplayLabel,
  getGoalDisplayStatus,
  GOALS_STORAGE_KEY,
  goalCategories,
  goalPriorities,
  goalWorkflowStatuses,
  isGoalOnTrack,
  legacySeedCategories,
  legacySeedColors,
  legacySeedPriorities,
  legacySeedProgress,
  legacySeedTargetDates,
  legacySeedTitles,
} from "@/lib/goals/constants";
import { createItem, deleteItem, updateItem } from "@/lib/storage/crud";
import { readStorage, writeStorage } from "@/lib/storage/local-storage";

export interface PersistedGoal {
  id: string;
  goalTitle: string;
  category: GoalCategory;
  priority: GoalPriority;
  status: GoalWorkflowStatus;
  targetDate: string;
  progress: number;
  notes: string;
  favourite: boolean;
  archived: boolean;
  colorKey?: string;
}

export interface GoalsPersistedState {
  goals: PersistedGoal[];
}

export interface GoalInput {
  goalTitle: string;
  category: GoalCategory;
  priority: GoalPriority;
  status: GoalWorkflowStatus;
  targetDate: string;
  progress: number;
  notes: string;
  favourite: boolean;
  archived: boolean;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

function isGoalCategory(value: string): value is GoalCategory {
  return goalCategories.includes(value as GoalCategory);
}

function isGoalPriority(value: string): value is GoalPriority {
  return goalPriorities.includes(value as GoalPriority);
}

function isGoalWorkflowStatus(value: string): value is GoalWorkflowStatus {
  return goalWorkflowStatuses.includes(value as GoalWorkflowStatus);
}

function migrateGoalRecord(raw: unknown): PersistedGoal {
  const record = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const rawId = typeof record.id === "string" ? record.id : "";
  const id = isUuid(rawId) ? rawId : crypto.randomUUID();
  const legacyId = rawId && !isUuid(rawId) ? rawId : undefined;

  let targetDate = typeof record.targetDate === "string" ? record.targetDate : "";

  if (!targetDate && typeof record.dueLabel === "string") {
    targetDate = record.dueLabel.replace(/^Due\s+/i, "");
  }

  if (!targetDate && legacyId && legacyId in legacySeedTargetDates) {
    targetDate = legacySeedTargetDates[legacyId];
  }

  let category: GoalCategory = "Personal";

  if (typeof record.category === "string") {
    if (record.category === "Branding") {
      category = "Social Media";
    } else if (isGoalCategory(record.category)) {
      category = record.category;
    }
  } else if (legacyId && legacyId in legacySeedCategories) {
    category = legacySeedCategories[legacyId];
  }

  let status: GoalWorkflowStatus = "In Progress";

  if (typeof record.status === "string") {
    if (record.status === "On Track" || record.status === "Behind") {
      status = "In Progress";
    } else if (isGoalWorkflowStatus(record.status)) {
      status = record.status;
    }
  }

  const progress =
    typeof record.progress === "number"
      ? record.progress
      : typeof record.percent === "number"
        ? record.percent
        : legacyId && legacyId in legacySeedProgress
          ? legacySeedProgress[legacyId]
          : 0;

  const colorKey =
    typeof record.colorKey === "string"
      ? record.colorKey
      : legacyId && legacyId in legacySeedColors
        ? legacyId
        : undefined;

  return {
    id,
    goalTitle:
      typeof record.goalTitle === "string"
        ? record.goalTitle
        : typeof record.title === "string"
          ? record.title
          : legacyId && legacyId in legacySeedTitles
            ? legacySeedTitles[legacyId]
            : "",
    category,
    priority:
      typeof record.priority === "string" && isGoalPriority(record.priority)
        ? record.priority
        : legacyId && legacyId in legacySeedPriorities
          ? legacySeedPriorities[legacyId]
          : "Medium",
    status,
    targetDate,
    progress,
    notes: typeof record.notes === "string" ? record.notes : "",
    favourite: typeof record.favourite === "boolean" ? record.favourite : false,
    archived: typeof record.archived === "boolean" ? record.archived : false,
    colorKey,
  };
}

function migrateGoalsState(raw: unknown): GoalsPersistedState {
  if (!raw || typeof raw !== "object" || !("goals" in raw) || !Array.isArray(raw.goals)) {
    return createSeedState();
  }

  const state = raw as { goals: unknown[] };

  return {
    goals: state.goals.map(migrateGoalRecord),
  };
}

function createSeedState(): GoalsPersistedState {
  return {
    goals: [],
  };
}

function normalizeGoal(input: GoalInput, existing?: PersistedGoal): PersistedGoal {
  return {
    id: existing?.id ?? crypto.randomUUID(),
    goalTitle: input.goalTitle.trim(),
    category: input.category,
    priority: input.priority,
    status: input.status,
    targetDate: input.targetDate.trim(),
    progress: input.progress,
    notes: input.notes.trim(),
    favourite: input.favourite,
    archived: input.archived,
    colorKey: existing?.colorKey,
  };
}

function getVisibleGoals(state: GoalsPersistedState): PersistedGoal[] {
  return state.goals.filter((goal) => !goal.archived);
}

function resolveGoalColors(goal: PersistedGoal) {
  if (goal.colorKey && goal.colorKey in legacySeedColors) {
    return legacySeedColors[goal.colorKey];
  }

  return categoryColors[goal.category];
}

export function toGoal(goal: PersistedGoal): Goal {
  const colors = resolveGoalColors(goal);

  return {
    id: goal.id,
    title: goal.goalTitle,
    category: getCategoryDisplayLabel(goal.category) as GoalDisplayCategory,
    priority: goal.priority,
    status: getGoalDisplayStatus(goal.status, goal.progress),
    dueLabel: goal.targetDate ? `Due ${goal.targetDate}` : "",
    percent: goal.progress,
    color: colors.color,
    trackTint: colors.trackTint,
    iconTint: colors.iconTint,
    favourite: goal.favourite,
    archived: goal.archived,
  };
}

export function toGoals(goals: PersistedGoal[]): Goal[] {
  return goals.map(toGoal);
}

export function buildGoalsStats(state: GoalsPersistedState): StatCardData[] {
  const visible = getVisibleGoals(state);
  const onTrackCount = visible.filter((goal) => isGoalOnTrack(goal.status, goal.progress)).length;
  const behindCount = visible.length - onTrackCount;
  const averageProgress =
    visible.length > 0
      ? Math.round(visible.reduce((total, goal) => total + goal.progress, 0) / visible.length)
      : 0;

  return [
    {
      id: "total-goals",
      label: "Total Goals",
      value: String(visible.length),
      trend: "Tracked",
      icon: Flag,
      color: "#17a5fb",
      tint: "rgba(23,165,251,0.09)",
    },
    {
      id: "on-track",
      label: "On Track",
      value: String(onTrackCount),
      trend: "Moving forward",
      icon: CheckCircle2,
      color: "#10b981",
      tint: "rgba(16,185,129,0.09)",
    },
    {
      id: "behind",
      label: "Behind",
      value: String(behindCount),
      trend: "Need attention",
      trendUp: false,
      trendColor: "#e17100",
      icon: TrendingDown,
      color: "#f59e0b",
      tint: "rgba(245,158,11,0.09)",
    },
    {
      id: "avg-progress",
      label: "Avg Progress",
      value: `${averageProgress}%`,
      trend: "Across all goals",
      icon: BarChart3,
      color: "#3b82f6",
      tint: "rgba(59,130,246,0.09)",
    },
  ];
}

export function initGoalsState(): GoalsPersistedState {
  const existing = readStorage<unknown>(GOALS_STORAGE_KEY);

  if (!existing) {
    const seed = createSeedState();
    writeStorage(GOALS_STORAGE_KEY, seed);
    return seed;
  }

  const migrated = migrateGoalsState(existing);
  writeStorage(GOALS_STORAGE_KEY, migrated);
  return migrated;
}

export function getGoalsState(): GoalsPersistedState {
  const existing = readStorage<unknown>(GOALS_STORAGE_KEY);

  if (!existing) {
    return createSeedState();
  }

  return migrateGoalsState(existing);
}

export function saveGoalsState(state: GoalsPersistedState): GoalsPersistedState {
  writeStorage(GOALS_STORAGE_KEY, state);
  return state;
}

export function addGoal(state: GoalsPersistedState, input: GoalInput): GoalsPersistedState {
  const nextState = {
    ...state,
    goals: createItem(state.goals, normalizeGoal(input)),
  };

  return saveGoalsState(nextState);
}

export function editGoal(
  state: GoalsPersistedState,
  id: string,
  input: GoalInput
): GoalsPersistedState {
  const existing = state.goals.find((goal) => goal.id === id);

  if (!existing) {
    return state;
  }

  const nextState = {
    ...state,
    goals: updateItem(state.goals, id, normalizeGoal(input, existing)),
  };

  return saveGoalsState(nextState);
}

export function removeGoal(state: GoalsPersistedState, id: string): GoalsPersistedState {
  const nextState = {
    ...state,
    goals: deleteItem(state.goals, id),
  };

  return saveGoalsState(nextState);
}

export function archiveGoal(state: GoalsPersistedState, id: string): GoalsPersistedState {
  const existing = state.goals.find((goal) => goal.id === id);

  if (!existing) {
    return state;
  }

  const nextState = {
    ...state,
    goals: updateItem(state.goals, id, { archived: true }),
  };

  return saveGoalsState(nextState);
}

export function restoreGoal(state: GoalsPersistedState, id: string): GoalsPersistedState {
  const existing = state.goals.find((goal) => goal.id === id);

  if (!existing) {
    return state;
  }

  const nextState = {
    ...state,
    goals: updateItem(state.goals, id, { archived: false }),
  };

  return saveGoalsState(nextState);
}

export function setGoalFavourite(
  state: GoalsPersistedState,
  id: string,
  favourite: boolean
): GoalsPersistedState {
  const existing = state.goals.find((goal) => goal.id === id);

  if (!existing) {
    return state;
  }

  const nextState = {
    ...state,
    goals: updateItem(state.goals, id, { favourite }),
  };

  return saveGoalsState(nextState);
}

export function goalToInput(goal: PersistedGoal): GoalInput {
  return {
    goalTitle: goal.goalTitle,
    category: goal.category,
    priority: goal.priority,
    status: goal.status,
    targetDate: goal.targetDate,
    progress: goal.progress,
    notes: goal.notes,
    favourite: goal.favourite,
    archived: goal.archived,
  };
}

export function findPersistedGoal(
  state: GoalsPersistedState,
  id: string
): PersistedGoal | undefined {
  return state.goals.find((goal) => goal.id === id);
}
