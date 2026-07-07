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
    hoursTrend: "Log learning time",
    dailyStreak: "0d",
    dailyStreakTrend: "Start a streak",
    notes: "",
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
  return readStorage<LearningPersistedState>(LEARNING_STORAGE_KEY) ?? createSeedState();
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
