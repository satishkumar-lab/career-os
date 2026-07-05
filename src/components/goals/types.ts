export type GoalCategory = "Career" | "Learning" | "Branding" | "Portfolio" | "Project";

export type GoalPriority = "High" | "Medium";

export type GoalStatus = "On Track" | "Behind";

export interface Goal {
  id: string;
  title: string;
  category: GoalCategory;
  priority: GoalPriority;
  status: GoalStatus;
  dueLabel: string;
  percent: number;
  color: string;
  trackTint: string;
  iconTint: string;
}
