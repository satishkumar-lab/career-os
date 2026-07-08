import type { StatCardData } from "@/components/dashboard/types";
import type { Course, WeeklyHoursPoint } from "@/components/learning/types";
import { BookOpen, Clock, Flame, GraduationCap } from "lucide-react";

import { createItem, deleteItem, generateId, updateItem } from "@/lib/storage/crud";
import { initStorage, readStorage, writeStorage } from "@/lib/storage/local-storage";
import {
  completedCourseStyle,
  courseIconPresets,
  LEARNING_STORAGE_KEY,
} from "@/lib/learning/constants";

export interface LearningPersistedState {
  courses: Course[];
  weeklyHours: WeeklyHoursPoint[];
  weeklyHoursTotal: string;
  hoursThisWeek: string;
  hoursTrend: string;
  dailyStreak: string;
  dailyStreakTrend: string;
  notes: string;
  activeSession: LearningActiveSession | null;
  lastLearningDate: string;
}

export interface LearningActiveSession {
  checkedInAt: string;
}

export interface LearningCheckOutResult {
  state: LearningPersistedState;
  hoursLogged: number;
  streakDays: number;
  tooShort: boolean;
}

export interface CourseInput {
  title: string;
  provider: string;
  moduleLabel: string;
  timeLeftLabel: string;
  percent: number;
  icon: Course["icon"];
}

const emptyWeeklyHours: WeeklyHoursPoint[] = [
  { label: "Mon", hours: 0 },
  { label: "Tue", hours: 0 },
  { label: "Wed", hours: 0 },
  { label: "Thu", hours: 0 },
  { label: "Fri", hours: 0 },
  { label: "Sat", hours: 0 },
  { label: "Sun", hours: 0 },
];

function createSeedState(): LearningPersistedState {
  return {
    courses: [],
    weeklyHours: emptyWeeklyHours,
    weeklyHoursTotal: "0h this week",
    hoursThisWeek: "0h",
    hoursTrend: "Check in to start",
    dailyStreak: "0d",
    dailyStreakTrend: "Start a streak",
    notes: "",
    activeSession: null,
    lastLearningDate: "",
  };
}

function normalizeLearningState(state: LearningPersistedState): LearningPersistedState {
  return {
    ...createSeedState(),
    ...state,
    activeSession: state.activeSession ?? null,
    lastLearningDate: state.lastLearningDate ?? "",
  };
}

function getTodayDateKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

function getYesterdayDateKey(date = new Date()): string {
  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 1);
  return getTodayDateKey(yesterday);
}

function parseStreakDays(value: string): number {
  const match = value.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

function formatStreakDays(days: number): string {
  return `${days}d`;
}

function msToLearningHours(ms: number): number {
  return Math.round((ms / 3_600_000) * 100) / 100;
}

function applyLearningHours(
  state: LearningPersistedState,
  hours: number,
  trendLabel: string
): LearningPersistedState {
  const dayIndex = (new Date().getDay() + 6) % 7;
  const weeklyHours = state.weeklyHours.map((point, index) =>
    index === dayIndex ? { ...point, hours: point.hours + hours } : point
  );
  const total = weeklyHours.reduce((sum, point) => sum + point.hours, 0);
  const formattedTotal = formatHoursLabel(total);

  return {
    ...state,
    weeklyHours,
    weeklyHoursTotal: `${formattedTotal} this week`,
    hoursThisWeek: formattedTotal,
    hoursTrend: trendLabel,
  };
}

function updateLearningStreak(state: LearningPersistedState, dateKey: string): LearningPersistedState {
  const currentStreak = parseStreakDays(state.dailyStreak);
  let nextStreak = currentStreak;

  if (state.lastLearningDate === dateKey) {
    nextStreak = Math.max(currentStreak, 1);
  } else if (state.lastLearningDate === getYesterdayDateKey()) {
    nextStreak = Math.max(currentStreak, 0) + 1;
  } else {
    nextStreak = 1;
  }

  return {
    ...state,
    dailyStreak: formatStreakDays(nextStreak),
    dailyStreakTrend: nextStreak > 1 ? "Keep it going" : "Day 1 — nice start",
    lastLearningDate: dateKey,
  };
}

function normalizeCourse(input: CourseInput, existing?: Course): Course {
  const isCompleted = input.percent >= 100;
  const iconPreset = courseIconPresets[input.icon];
  const style = isCompleted ? completedCourseStyle : iconPreset;

  return {
    id: existing?.id ?? generateId("course"),
    title: input.title.trim(),
    provider: input.provider.trim(),
    moduleLabel: input.moduleLabel.trim(),
    timeLeftLabel: input.timeLeftLabel.trim(),
    percent: isCompleted ? 100 : input.percent,
    icon: input.icon,
    color: style.color,
    tint: style.tint,
    status: isCompleted ? "completed" : "active",
  };
}

export function initLearningState(): LearningPersistedState {
  return initStorage(LEARNING_STORAGE_KEY, createSeedState());
}

export function getLearningState(): LearningPersistedState {
  const state = readStorage<LearningPersistedState>(LEARNING_STORAGE_KEY);
  return state ? normalizeLearningState(state) : createSeedState();
}

export function saveLearningState(state: LearningPersistedState): LearningPersistedState {
  writeStorage(LEARNING_STORAGE_KEY, state);
  return state;
}

export function addCourse(
  state: LearningPersistedState,
  input: CourseInput
): LearningPersistedState {
  const nextState = {
    ...state,
    courses: createItem(state.courses, normalizeCourse(input)),
  };

  return saveLearningState(nextState);
}

export function editCourse(
  state: LearningPersistedState,
  id: string,
  input: CourseInput
): LearningPersistedState {
  const existing = state.courses.find((course) => course.id === id);

  if (!existing) {
    return state;
  }

  const nextState = {
    ...state,
    courses: updateItem(state.courses, id, normalizeCourse(input, existing)),
  };

  return saveLearningState(nextState);
}

export function removeCourse(state: LearningPersistedState, id: string): LearningPersistedState {
  const nextState = {
    ...state,
    courses: deleteItem(state.courses, id),
  };

  return saveLearningState(nextState);
}

export function updateCourseProgress(
  state: LearningPersistedState,
  id: string,
  percent: number
): LearningPersistedState {
  const existing = state.courses.find((course) => course.id === id);

  if (!existing) {
    return state;
  }

  return editCourse(state, id, {
    title: existing.title,
    provider: existing.provider,
    moduleLabel: existing.moduleLabel,
    timeLeftLabel: existing.timeLeftLabel,
    percent,
    icon: existing.icon,
  });
}

export function markCourseCompleted(
  state: LearningPersistedState,
  id: string
): LearningPersistedState {
  const existing = state.courses.find((course) => course.id === id);

  if (!existing) {
    return state;
  }

  const completedLabel = `Completed ${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date())}`;

  return editCourse(state, id, {
    title: existing.title,
    provider: existing.provider,
    moduleLabel: existing.moduleLabel,
    timeLeftLabel: completedLabel,
    percent: 100,
    icon: existing.icon,
  });
}

export function updateLearningNotes(
  state: LearningPersistedState,
  notes: string
): LearningPersistedState {
  const nextState = {
    ...state,
    notes,
  };

  return saveLearningState(nextState);
}

function formatHoursLabel(total: number): string {
  return Number.isInteger(total) ? `${total}h` : `${total.toFixed(1)}h`;
}

export function logLearningHours(
  state: LearningPersistedState,
  hours: number
): LearningPersistedState {
  if (hours <= 0) {
    return state;
  }

  const nextState = applyLearningHours(state, hours, "Logged today");
  return saveLearningState(nextState);
}

export function isLearningCheckedIn(state: LearningPersistedState): boolean {
  return Boolean(state.activeSession?.checkedInAt);
}

export function getLearningSessionElapsedMs(state: LearningPersistedState): number {
  if (!state.activeSession?.checkedInAt) {
    return 0;
  }

  return Math.max(0, Date.now() - new Date(state.activeSession.checkedInAt).getTime());
}

export function formatLearningSessionElapsed(ms: number): string {
  const totalMinutes = Math.floor(ms / 60_000);

  if (totalMinutes < 60) {
    return `${Math.max(totalMinutes, 0)}m`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

export function checkInLearning(state: LearningPersistedState): LearningPersistedState {
  if (isLearningCheckedIn(state)) {
    return state;
  }

  const nextState = {
    ...state,
    activeSession: {
      checkedInAt: new Date().toISOString(),
    },
    hoursTrend: "Learning now",
  };

  return saveLearningState(nextState);
}

export function checkOutLearning(state: LearningPersistedState): LearningCheckOutResult {
  if (!state.activeSession?.checkedInAt) {
    return {
      state,
      hoursLogged: 0,
      streakDays: parseStreakDays(state.dailyStreak),
      tooShort: false,
    };
  }

  const elapsedMs = getLearningSessionElapsedMs(state);
  const minimumSessionMs = 60_000;

  if (elapsedMs < minimumSessionMs) {
    const nextState = saveLearningState({
      ...state,
      activeSession: null,
      hoursTrend: "Check in to start",
    });

    return {
      state: nextState,
      hoursLogged: 0,
      streakDays: parseStreakDays(state.dailyStreak),
      tooShort: true,
    };
  }

  const hoursLogged = msToLearningHours(elapsedMs);
  const dateKey = getTodayDateKey();
  let nextState: LearningPersistedState = {
    ...state,
    activeSession: null,
  };

  nextState = applyLearningHours(nextState, hoursLogged, `Logged ${formatHoursLabel(hoursLogged)} today`);
  nextState = updateLearningStreak(nextState, dateKey);

  return {
    state: saveLearningState(nextState),
    hoursLogged,
    streakDays: parseStreakDays(nextState.dailyStreak),
    tooShort: false,
  };
}

export function buildLearningStats(state: LearningPersistedState): StatCardData[] {
  const activeCount = state.courses.filter((course) => course.status === "active").length;
  const completedCount = state.courses.filter((course) => course.status === "completed").length;

  return [
    {
      id: "hours-this-week",
      label: "Hours This Week",
      value: state.hoursThisWeek,
      sublabel: "this week",
      trend: state.hoursTrend,
      icon: Clock,
      color: "#3b82f6",
      tint: "rgba(59,130,246,0.09)",
    },
    {
      id: "daily-streak",
      label: "Daily Streak",
      value: state.dailyStreak,
      sublabel: "personal best",
      trend: state.dailyStreakTrend,
      icon: Flame,
      color: "#f59e0b",
      tint: "rgba(245,158,11,0.09)",
    },
    {
      id: "active-courses",
      label: "Active Courses",
      value: String(activeCount),
      sublabel: "in progress",
      trend: "In progress",
      icon: BookOpen,
      color: "#5b5bd6",
      tint: "rgba(91,91,214,0.09)",
    },
    {
      id: "completed",
      label: "Completed",
      value: String(completedCount),
      sublabel: "all time",
      trend: "All time",
      icon: GraduationCap,
      color: "#10b981",
      tint: "rgba(16,185,129,0.09)",
    },
  ];
}

export function courseToInput(course: Course): CourseInput {
  return {
    title: course.title,
    provider: course.provider,
    moduleLabel: course.moduleLabel,
    timeLeftLabel: course.timeLeftLabel,
    percent: course.percent,
    icon: course.icon,
  };
}
