export const DASHBOARD_TASKS_STORAGE_KEY = "career-os-dashboard-tasks";

export const taskPriorities = ["Low", "Medium", "High"] as const;

export type TaskPriority = (typeof taskPriorities)[number];
