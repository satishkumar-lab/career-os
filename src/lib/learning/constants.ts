import type { Course } from "@/components/learning/types";

export const LEARNING_STORAGE_KEY = "career-os-learning";

export const courseIconPresets: Record<
  Course["icon"],
  { color: string; tint: string; label: string }
> = {
  analytics: {
    color: "#5b5bd6",
    tint: "rgba(91,91,214,0.09)",
    label: "Analytics",
  },
  leadership: {
    color: "#8b5cf6",
    tint: "rgba(139,92,246,0.09)",
    label: "Leadership",
  },
  cloud: {
    color: "#10b981",
    tint: "rgba(16,185,129,0.09)",
    label: "Cloud",
  },
};

export const completedCourseStyle = {
  color: "#10b981",
  tint: "rgba(16,185,129,0.09)",
};

export const courseFormSchema = {
  title: { required: true },
  provider: { required: true },
  moduleLabel: { required: true },
  timeLeftLabel: { required: true },
  percent: { required: true, min: 0, max: 100 },
  icon: { required: true },
};

export const progressFormSchema = {
  percent: { required: true, min: 0, max: 100 },
};
