import type {
  GoalCategory,
  GoalPriority,
  GoalWorkflowStatus,
} from "@/components/goals/types";

export const GOALS_STORAGE_KEY = "career-os-goals";

export const goalCategories: GoalCategory[] = [
  "Learning",
  "Career",
  "Portfolio",
  "Certification",
  "Project",
  "Social Media",
  "Interview",
  "Personal",
];

export const goalPriorities: GoalPriority[] = ["High", "Medium", "Low"];

export const goalWorkflowStatuses: GoalWorkflowStatus[] = [
  "Not Started",
  "In Progress",
  "Completed",
  "On Hold",
  "Archived",
];

export const goalFormSchema = {
  goalTitle: { required: true },
  category: { required: true },
  status: { required: true },
  progress: { min: 0, max: 100 },
};

export const categoryColors: Record<
  GoalCategory,
  { color: string; trackTint: string; iconTint: string }
> = {
  Career: {
    color: "#5b5bd6",
    trackTint: "rgba(91,91,214,0.13)",
    iconTint: "rgba(91,91,214,0.08)",
  },
  Learning: {
    color: "#10b981",
    trackTint: "rgba(16,185,129,0.13)",
    iconTint: "rgba(16,185,129,0.08)",
  },
  "Social Media": {
    color: "#f59e0b",
    trackTint: "rgba(245,158,11,0.13)",
    iconTint: "rgba(245,158,11,0.08)",
  },
  Portfolio: {
    color: "#8b5cf6",
    trackTint: "rgba(139,92,246,0.13)",
    iconTint: "rgba(139,92,246,0.08)",
  },
  Project: {
    color: "#ec4899",
    trackTint: "rgba(236,72,153,0.13)",
    iconTint: "rgba(236,72,153,0.08)",
  },
  Certification: {
    color: "#0ea5e9",
    trackTint: "rgba(14,165,233,0.13)",
    iconTint: "rgba(14,165,233,0.08)",
  },
  Interview: {
    color: "#f97316",
    trackTint: "rgba(249,115,22,0.13)",
    iconTint: "rgba(249,115,22,0.08)",
  },
  Personal: {
    color: "#64748b",
    trackTint: "rgba(100,116,139,0.13)",
    iconTint: "rgba(100,116,139,0.08)",
  },
};

export const categoryDisplayLabels: Partial<Record<GoalCategory, string>> = {
  "Social Media": "Branding",
};

export const legacySeedCategories: Record<string, GoalCategory> = {
  "land-senior-pm": "Career",
  "aws-certification": "Learning",
  "linkedin-followers": "Social Media",
  "portfolio-case-studies": "Portfolio",
  "ship-careeros": "Project",
};

export const legacySeedTitles: Record<string, string> = {
  "land-senior-pm": "Land Senior PM role",
  "aws-certification": "Complete AWS Certification",
  "linkedin-followers": "Reach 5K LinkedIn followers",
  "portfolio-case-studies": "Build 3 portfolio case studies",
  "ship-careeros": "Ship CareerOS v1",
};

export const legacySeedPriorities: Record<string, GoalPriority> = {
  "land-senior-pm": "High",
  "aws-certification": "High",
  "linkedin-followers": "Medium",
  "portfolio-case-studies": "Medium",
  "ship-careeros": "High",
};

export const legacySeedProgress: Record<string, number> = {
  "land-senior-pm": 68,
  "aws-certification": 81,
  "linkedin-followers": 42,
  "portfolio-case-studies": 33,
  "ship-careeros": 55,
};

export const legacySeedTargetDates: Record<string, string> = {
  "land-senior-pm": "Q3 2025",
  "aws-certification": "Aug 2025",
  "linkedin-followers": "Dec 2025",
  "portfolio-case-studies": "Sep 2025",
  "ship-careeros": "Aug 2025",
};

export const legacySeedColors: Record<string, { color: string; trackTint: string; iconTint: string }> = {
  "land-senior-pm": categoryColors.Career,
  "aws-certification": categoryColors.Learning,
  "linkedin-followers": categoryColors["Social Media"],
  "portfolio-case-studies": categoryColors.Portfolio,
  "ship-careeros": categoryColors.Project,
};

export function getCategoryDisplayLabel(category: GoalCategory): string {
  return categoryDisplayLabels[category] ?? category;
}

export function getGoalDisplayStatus(
  status: GoalWorkflowStatus,
  progress: number
): "On Track" | "Behind" {
  if (status === "Completed") {
    return "On Track";
  }

  if (status === "Not Started" || status === "On Hold") {
    return "Behind";
  }

  return progress >= 50 ? "On Track" : "Behind";
}

export function isGoalOnTrack(status: GoalWorkflowStatus, progress: number): boolean {
  return getGoalDisplayStatus(status, progress) === "On Track";
}
