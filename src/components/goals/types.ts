export type GoalCategory =
  | "Learning"
  | "Career"
  | "Portfolio"
  | "Certification"
  | "Project"
  | "Social Media"
  | "Interview"
  | "Personal";

export type GoalDisplayCategory =
  | "Career"
  | "Learning"
  | "Branding"
  | "Portfolio"
  | "Project"
  | "Certification"
  | "Interview"
  | "Personal";

export type GoalPriority = "High" | "Medium" | "Low";

export type GoalWorkflowStatus =
  | "Not Started"
  | "In Progress"
  | "Completed"
  | "On Hold"
  | "Archived";

export type GoalStatus = "On Track" | "Behind";

export interface Goal {
  id: string;
  title: string;
  category: GoalDisplayCategory;
  priority: GoalPriority;
  status: GoalStatus;
  dueLabel: string;
  percent: number;
  color: string;
  trackTint: string;
  iconTint: string;
  favourite: boolean;
  archived: boolean;
}
