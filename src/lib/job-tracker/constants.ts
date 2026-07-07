import type { PipelineStageStatus } from "@/components/job-tracker/types";
import type {
  CurrentStage,
  JobApplicationStatus,
  JobType,
  WorkMode,
} from "@/components/job-tracker/types";

export const JOB_TRACKER_STORAGE_KEY = "career-os-job-tracker";

export const jobTypes: JobType[] = ["Full-time", "Contract", "Internship", "Freelance"];

export const workModes: WorkMode[] = ["Remote", "Hybrid", "On-site"];

export const currentStages: CurrentStage[] = [
  "Wishlist",
  "Applied",
  "HR Screening",
  "Assignment",
  "Technical Round",
  "Manager Round",
  "Final Round",
  "Offer",
  "Rejected",
  "Accepted",
];

export const applicationStatuses: JobApplicationStatus[] = ["Active", "Closed"];

export const jobApplicationFormSchema = {
  companyName: { required: true },
  jobTitle: { required: true },
  currentStage: { required: true },
  jobUrl: { url: true },
  recruiterEmail: { email: true },
  recruiterLinkedIn: { url: true },
};

export const pipelineStageStatuses: PipelineStageStatus[] = [
  "Pending",
  "Passed",
  "Failed",
  "Current",
];

export const legacySeedPipelines: Record<
  string,
  Array<{ name: string; status: PipelineStageStatus }>
> = {
  figma: [
    { name: "Applied", status: "Passed" },
    { name: "HR Round 1", status: "Passed" },
    { name: "Assignment", status: "Passed" },
    { name: "Technical Round 1", status: "Current" },
    { name: "Technical Round 2", status: "Pending" },
    { name: "Manager Round", status: "Pending" },
    { name: "Offer", status: "Pending" },
  ],
  stripe: [
    { name: "Applied", status: "Passed" },
    { name: "HR", status: "Passed" },
    { name: "Assignment", status: "Current" },
    { name: "Technical", status: "Pending" },
    { name: "Offer", status: "Pending" },
  ],
  notion: [
    { name: "Applied", status: "Passed" },
    { name: "HR Screening", status: "Current" },
    { name: "Assignment", status: "Pending" },
    { name: "Technical", status: "Pending" },
    { name: "Product Interview", status: "Pending" },
    { name: "CEO", status: "Pending" },
    { name: "Offer", status: "Pending" },
  ],
  linear: [
    { name: "Applied", status: "Passed" },
    { name: "HR Round", status: "Passed" },
    { name: "Assignment", status: "Failed" },
    { name: "Technical", status: "Pending" },
    { name: "Offer", status: "Pending" },
  ],
};

export const pipelineStageFormSchema = {
  name: { required: true },
};

export const legacySeedIcons: Record<string, string> = {
  figma: "figma",
  stripe: "stripe",
  linear: "linear",
  notion: "notion",
};

export const legacySeedStages: Record<string, CurrentStage> = {
  figma: "Technical Round",
  stripe: "Assignment",
  linear: "Rejected",
  notion: "HR Screening",
};

export const legacySeedDates: Record<string, string> = {
  figma: "Jul 3",
  stripe: "Jun 28",
  linear: "Jun 20",
  notion: "Jul 1",
};

export const legacySeedClosed: Record<string, boolean> = {
  linear: true,
};

export const stageColors: Record<CurrentStage, { color: string; tint: string; bg: string; text: string }> = {
  Wishlist: { color: "#787870", tint: "rgba(120,120,112,0.08)", bg: "rgba(120,120,112,0.08)", text: "#787870" },
  Applied: { color: "#38a311", tint: "rgba(56,163,17,0.08)", bg: "rgba(56,163,17,0.08)", text: "#38a311" },
  "HR Screening": { color: "#8b5cf6", tint: "rgba(139,92,246,0.08)", bg: "rgba(139,92,246,0.08)", text: "#8b5cf6" },
  Assignment: { color: "#10b981", tint: "rgba(16,185,129,0.08)", bg: "rgba(16,185,129,0.08)", text: "#10b981" },
  "Technical Round": { color: "#5b5bd6", tint: "rgba(91,91,214,0.08)", bg: "rgba(91,91,214,0.08)", text: "#5b5bd6" },
  "Manager Round": { color: "#0ea5e9", tint: "rgba(14,165,233,0.08)", bg: "rgba(14,165,233,0.08)", text: "#0ea5e9" },
  "Final Round": { color: "#f59e0b", tint: "rgba(245,158,11,0.08)", bg: "rgba(245,158,11,0.08)", text: "#f59e0b" },
  Offer: { color: "#f97316", tint: "rgba(249,115,22,0.08)", bg: "rgba(249,115,22,0.08)", text: "#f97316" },
  Rejected: { color: "#ef4444", tint: "rgba(239,68,68,0.08)", bg: "rgba(239,68,68,0.08)", text: "#ef4444" },
  Accepted: { color: "#10b981", tint: "rgba(16,185,129,0.08)", bg: "rgba(16,185,129,0.08)", text: "#10b981" },
};

export const interviewStages: CurrentStage[] = [
  "HR Screening",
  "Assignment",
  "Technical Round",
  "Manager Round",
  "Final Round",
  "Offer",
  "Accepted",
];

export const pipelineBuckets = [
  { id: "applied", label: "Applied", stages: ["Applied"] as CurrentStage[] },
  { id: "hr-round", label: "HR Round", stages: ["HR Screening"] as CurrentStage[] },
  { id: "assignment", label: "Assignment", stages: ["Assignment"] as CurrentStage[] },
  { id: "technical", label: "Technical", stages: ["Technical Round"] as CurrentStage[] },
  { id: "manager", label: "Manager", stages: ["Manager Round"] as CurrentStage[] },
  { id: "final", label: "Final", stages: ["Final Round"] as CurrentStage[] },
  { id: "offer", label: "Offer", stages: ["Offer", "Accepted"] as CurrentStage[] },
  { id: "rejected", label: "Rejected", stages: ["Rejected"] as CurrentStage[] },
];

export const stageDisplayLabels: Partial<Record<CurrentStage, string>> = {
  "HR Screening": "HR Round",
};

export function getStageDisplayLabel(stage: CurrentStage): string {
  return stageDisplayLabels[stage] ?? stage;
}
