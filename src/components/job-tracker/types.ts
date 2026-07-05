import type { LucideIcon } from "lucide-react";

export type ApplicationStatus = "Technical Round" | "Assignment" | "Rejected" | "HR Round";

export type PipelineStageVariant = "applied" | "progress" | "inactive" | "rejected";

export interface PipelineStage {
  id: string;
  label: string;
  variant: PipelineStageVariant;
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  appliedLabel: string;
  status: ApplicationStatus;
  icon: LucideIcon;
  color: string;
  tint: string;
}
