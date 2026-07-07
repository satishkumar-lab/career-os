import type { LucideIcon } from "lucide-react";

export type JobType = "Full-time" | "Contract" | "Internship" | "Freelance";

export type WorkMode = "Remote" | "Hybrid" | "On-site";

export type CurrentStage =
  | "Wishlist"
  | "Applied"
  | "HR Screening"
  | "Assignment"
  | "Technical Round"
  | "Manager Round"
  | "Final Round"
  | "Offer"
  | "Rejected"
  | "Accepted";

export type JobApplicationStatus = "Active" | "Closed";

export type PipelineStageStatus = "Pending" | "Passed" | "Failed" | "Current";

export interface JobPipelineStage {
  id: string;
  name: string;
  status: PipelineStageStatus;
}

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
  status: CurrentStage;
  icon: LucideIcon;
  color: string;
  tint: string;
  favourite: boolean;
  archived: boolean;
}
