import type { StatCardData } from "@/components/dashboard/types";
import type {
  CurrentStage,
  JobApplication,
  JobApplicationStatus,
  JobPipelineStage,
  JobType,
  PipelineStageStatus,
  WorkMode,
} from "@/components/job-tracker/types";
import { Briefcase, CheckCircle2, TrendingUp, Trophy } from "lucide-react";

import { jobApplications as seedApplications } from "@/lib/mock/job-tracker";
import {
  applicationStatuses,
  currentStages,
  interviewStages,
  JOB_TRACKER_STORAGE_KEY,
  legacySeedClosed,
  legacySeedDates,
  legacySeedIcons,
  legacySeedPipelines,
  legacySeedStages,
  pipelineStageStatuses,
  stageColors,
} from "@/lib/job-tracker/constants";
import { jobIconPresets, type JobIconKey } from "@/lib/job-tracker/icons";
import { createItem, deleteItem, updateItem } from "@/lib/storage/crud";
import { readStorage, writeStorage } from "@/lib/storage/local-storage";

export interface PersistedJobApplication {
  id: string;
  companyName: string;
  jobTitle: string;
  jobType: JobType;
  workMode: WorkMode;
  location: string;
  appliedDate: string;
  currentStage: CurrentStage;
  applicationStatus: JobApplicationStatus;
  salary: string;
  jobUrl: string;
  recruiterName: string;
  recruiterEmail: string;
  recruiterLinkedIn: string;
  interviewDate: string;
  notes: string;
  favourite: boolean;
  archived: boolean;
  iconKey?: JobIconKey;
  pipeline: JobPipelineStage[];
}

export interface JobTrackerPersistedState {
  applications: PersistedJobApplication[];
}

export interface JobApplicationInput {
  companyName: string;
  jobTitle: string;
  jobType: JobType;
  workMode: WorkMode;
  location: string;
  appliedDate: string;
  currentStage: CurrentStage;
  applicationStatus: JobApplicationStatus;
  salary: string;
  jobUrl: string;
  recruiterName: string;
  recruiterEmail: string;
  recruiterLinkedIn: string;
  interviewDate: string;
  notes: string;
  favourite: boolean;
  archived: boolean;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

function isCurrentStage(value: string): value is CurrentStage {
  return currentStages.includes(value as CurrentStage);
}

function isJobType(value: string): value is JobType {
  return value === "Full-time" || value === "Contract" || value === "Internship" || value === "Freelance";
}

function isWorkMode(value: string): value is WorkMode {
  return value === "Remote" || value === "Hybrid" || value === "On-site";
}

function isApplicationStatus(value: string): value is JobApplicationStatus {
  return applicationStatuses.includes(value as JobApplicationStatus);
}

function isPipelineStageStatus(value: string): value is PipelineStageStatus {
  return pipelineStageStatuses.includes(value as PipelineStageStatus);
}

function migratePipelineStage(raw: unknown): JobPipelineStage | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const record = raw as Record<string, unknown>;
  const name = typeof record.name === "string" ? record.name.trim() : "";

  if (!name) {
    return null;
  }

  return {
    id: typeof record.id === "string" && isUuid(record.id) ? record.id : crypto.randomUUID(),
    name,
    status:
      typeof record.status === "string" && isPipelineStageStatus(record.status)
        ? record.status
        : "Pending",
  };
}

function createDefaultPipeline(iconKey?: JobIconKey, legacyId?: string): JobPipelineStage[] {
  const seedKey =
    legacyId && legacyId in legacySeedPipelines
      ? legacyId
      : iconKey && iconKey in legacySeedPipelines
        ? iconKey
        : undefined;

  if (seedKey) {
    return legacySeedPipelines[seedKey].map((stage) => ({
      id: crypto.randomUUID(),
      name: stage.name,
      status: stage.status,
    }));
  }

  return [{ id: crypto.randomUUID(), name: "Applied", status: "Current" }];
}

function mapStageNameToCurrentStage(name: string): CurrentStage {
  const normalized = name.toLowerCase();

  if (normalized.includes("wishlist")) return "Wishlist";
  if (normalized.includes("reject")) return "Rejected";
  if (normalized.includes("accept")) return "Accepted";
  if (normalized.includes("offer")) return "Offer";
  if (normalized.includes("final")) return "Final Round";
  if (normalized.includes("manager")) return "Manager Round";
  if (normalized.includes("technical") || normalized.includes("product interview")) {
    return "Technical Round";
  }
  if (normalized.includes("assignment")) return "Assignment";
  if (normalized.includes("hr") || normalized.includes("screening")) return "HR Screening";
  if (normalized.includes("ceo")) return "Final Round";
  if (normalized.includes("applied")) return "Applied";

  return "Applied";
}

export function calculatePipelineProgress(pipeline: JobPipelineStage[]): number {
  if (pipeline.length === 0) {
    return 0;
  }

  const passedCount = pipeline.filter((stage) => stage.status === "Passed").length;

  return Math.round((passedCount / pipeline.length) * 100);
}

export function syncApplicationFromPipeline(
  application: PersistedJobApplication
): PersistedJobApplication {
  const { pipeline } = application;

  if (pipeline.length === 0) {
    return application;
  }

  if (pipeline.some((stage) => stage.status === "Failed")) {
    return {
      ...application,
      currentStage: "Rejected",
      applicationStatus: "Closed",
    };
  }

  if (pipeline.every((stage) => stage.status === "Passed")) {
    return {
      ...application,
      currentStage: "Accepted",
      applicationStatus: "Closed",
    };
  }

  const currentStageItem = pipeline.find((stage) => stage.status === "Current");

  if (currentStageItem) {
    return {
      ...application,
      currentStage: mapStageNameToCurrentStage(currentStageItem.name),
      applicationStatus: "Active",
    };
  }

  return application;
}

function applyPipelineUpdate(
  state: JobTrackerPersistedState,
  applicationId: string,
  updater: (pipeline: JobPipelineStage[]) => JobPipelineStage[]
): JobTrackerPersistedState {
  const existing = state.applications.find((application) => application.id === applicationId);

  if (!existing) {
    return state;
  }

  const updatedApplication = syncApplicationFromPipeline({
    ...existing,
    pipeline: updater(existing.pipeline),
  });

  const nextState = {
    ...state,
    applications: updateItem(state.applications, applicationId, updatedApplication),
  };

  return saveJobTrackerState(nextState);
}

function isIconKey(value: string): value is JobIconKey {
  return value in jobIconPresets;
}

function ensureSingleCurrent(
  pipeline: JobPipelineStage[],
  targetStageId: string
): JobPipelineStage[] {
  return pipeline.map((stage) => {
    if (stage.id === targetStageId) {
      return { ...stage, status: "Current" };
    }

    if (stage.status === "Current") {
      return { ...stage, status: "Pending" };
    }

    return stage;
  });
}

function setStageStatusInPipeline(
  pipeline: JobPipelineStage[],
  stageId: string,
  status: PipelineStageStatus
): JobPipelineStage[] {
  if (status === "Current") {
    return ensureSingleCurrent(pipeline, stageId);
  }

  return pipeline.map((stage) => (stage.id === stageId ? { ...stage, status } : stage));
}

function resolveIconKey(raw: Record<string, unknown>): JobIconKey {
  if (typeof raw.iconKey === "string" && isIconKey(raw.iconKey)) {
    return raw.iconKey;
  }

  const legacyId = typeof raw.id === "string" ? raw.id : "";

  if (legacyId in legacySeedIcons && isIconKey(legacySeedIcons[legacyId])) {
    return legacySeedIcons[legacyId] as JobIconKey;
  }

  return "default";
}

function resolveCurrentStage(raw: Record<string, unknown>): CurrentStage {
  if (typeof raw.currentStage === "string" && isCurrentStage(raw.currentStage)) {
    return raw.currentStage;
  }

  if (typeof raw.status === "string") {
    if (raw.status === "HR Round") {
      return "HR Screening";
    }

    if (isCurrentStage(raw.status)) {
      return raw.status;
    }
  }

  const legacyId = typeof raw.id === "string" ? raw.id : "";

  if (legacyId in legacySeedStages) {
    return legacySeedStages[legacyId];
  }

  return "Applied";
}

function migrateJobApplicationRecord(raw: unknown): PersistedJobApplication {
  const record = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const rawId = typeof record.id === "string" ? record.id : "";
  const id = isUuid(rawId) ? rawId : crypto.randomUUID();
  const legacyId = rawId && !isUuid(rawId) ? rawId : undefined;

  let appliedDate = typeof record.appliedDate === "string" ? record.appliedDate : "";

  if (!appliedDate && typeof record.appliedLabel === "string") {
    appliedDate = record.appliedLabel.replace(/^Applied\s+/i, "");
  }

  if (!appliedDate && legacyId && legacyId in legacySeedDates) {
    appliedDate = legacySeedDates[legacyId];
  }

  const iconKey = resolveIconKey(record);

  let pipeline: JobPipelineStage[] = [];

  if ("pipeline" in record && Array.isArray(record.pipeline)) {
    pipeline = record.pipeline
      .map(migratePipelineStage)
      .filter((stage): stage is JobPipelineStage => stage !== null);
  }

  if (pipeline.length === 0) {
    pipeline = createDefaultPipeline(iconKey, legacyId);
  }

  const baseApplication: PersistedJobApplication = {
    id,
    companyName:
      typeof record.companyName === "string"
        ? record.companyName
        : typeof record.company === "string"
          ? record.company
          : "",
    jobTitle:
      typeof record.jobTitle === "string"
        ? record.jobTitle
        : typeof record.role === "string"
          ? record.role
          : "",
    jobType: typeof record.jobType === "string" && isJobType(record.jobType) ? record.jobType : "Full-time",
    workMode: typeof record.workMode === "string" && isWorkMode(record.workMode) ? record.workMode : "Remote",
    location: typeof record.location === "string" ? record.location : "",
    appliedDate,
    currentStage: resolveCurrentStage(record),
    applicationStatus:
      typeof record.applicationStatus === "string" && isApplicationStatus(record.applicationStatus)
        ? record.applicationStatus
        : legacyId && legacySeedClosed[legacyId]
          ? "Closed"
          : "Active",
    salary: typeof record.salary === "string" ? record.salary : "",
    jobUrl: typeof record.jobUrl === "string" ? record.jobUrl : "",
    recruiterName: typeof record.recruiterName === "string" ? record.recruiterName : "",
    recruiterEmail: typeof record.recruiterEmail === "string" ? record.recruiterEmail : "",
    recruiterLinkedIn: typeof record.recruiterLinkedIn === "string" ? record.recruiterLinkedIn : "",
    interviewDate: typeof record.interviewDate === "string" ? record.interviewDate : "",
    notes: typeof record.notes === "string" ? record.notes : "",
    favourite: typeof record.favourite === "boolean" ? record.favourite : false,
    archived: typeof record.archived === "boolean" ? record.archived : false,
    iconKey,
    pipeline,
  };

  return syncApplicationFromPipeline(baseApplication);
}

function migrateJobTrackerState(raw: unknown): JobTrackerPersistedState {
  if (!raw || typeof raw !== "object" || !("applications" in raw) || !Array.isArray(raw.applications)) {
    return createSeedState();
  }

  const state = raw as { applications: unknown[] };

  return {
    applications: state.applications.map(migrateJobApplicationRecord),
  };
}

function createSeedState(): JobTrackerPersistedState {
  return {
    applications: seedApplications.map((application) =>
      syncApplicationFromPipeline({
        id: crypto.randomUUID(),
        companyName: application.company,
        jobTitle: application.role,
        jobType: "Full-time",
        workMode: "Remote",
        location: "",
        appliedDate: legacySeedDates[application.id] ?? "",
        currentStage: legacySeedStages[application.id] ?? "Applied",
        applicationStatus: legacySeedClosed[application.id] ? "Closed" : "Active",
        salary: "",
        jobUrl: "",
        recruiterName: "",
        recruiterEmail: "",
        recruiterLinkedIn: "",
        interviewDate: "",
        notes: "",
        favourite: false,
        archived: false,
        iconKey: (legacySeedIcons[application.id] as JobIconKey) ?? "default",
        pipeline: createDefaultPipeline(
          (legacySeedIcons[application.id] as JobIconKey) ?? "default",
          application.id
        ),
      })
    ),
  };
}

function normalizeJobApplication(
  input: JobApplicationInput,
  existing?: PersistedJobApplication
): PersistedJobApplication {
  return {
    id: existing?.id ?? crypto.randomUUID(),
    companyName: input.companyName.trim(),
    jobTitle: input.jobTitle.trim(),
    jobType: input.jobType,
    workMode: input.workMode,
    location: input.location.trim(),
    appliedDate: input.appliedDate.trim(),
    currentStage: input.currentStage,
    applicationStatus: input.applicationStatus,
    salary: input.salary.trim(),
    jobUrl: input.jobUrl.trim(),
    recruiterName: input.recruiterName.trim(),
    recruiterEmail: input.recruiterEmail.trim(),
    recruiterLinkedIn: input.recruiterLinkedIn.trim(),
    interviewDate: input.interviewDate.trim(),
    notes: input.notes.trim(),
    favourite: input.favourite,
    archived: input.archived,
    iconKey: existing?.iconKey ?? "default",
    pipeline:
      existing?.pipeline ?? [{ id: crypto.randomUUID(), name: "Applied", status: "Current" }],
  };
}

export function toJobApplication(application: PersistedJobApplication): JobApplication {
  const iconKey = application.iconKey ?? "default";
  const iconPreset = jobIconPresets[iconKey];
  const colors = stageColors[application.currentStage];

  return {
    id: application.id,
    company: application.companyName,
    role: application.jobTitle,
    appliedLabel: application.appliedDate ? `Applied ${application.appliedDate}` : "",
    status: application.currentStage,
    icon: iconPreset.icon,
    color: colors.color,
    tint: colors.tint,
    favourite: application.favourite,
    archived: application.archived,
  };
}

export function toJobApplications(applications: PersistedJobApplication[]): JobApplication[] {
  return applications.map(toJobApplication);
}

export function addPipelineStage(
  state: JobTrackerPersistedState,
  applicationId: string,
  name: string
): JobTrackerPersistedState {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return state;
  }

  return applyPipelineUpdate(state, applicationId, (pipeline) => [
    ...pipeline,
    { id: crypto.randomUUID(), name: trimmedName, status: "Pending" },
  ]);
}

export function renamePipelineStage(
  state: JobTrackerPersistedState,
  applicationId: string,
  stageId: string,
  name: string
): JobTrackerPersistedState {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return state;
  }

  return applyPipelineUpdate(state, applicationId, (pipeline) =>
    pipeline.map((stage) => (stage.id === stageId ? { ...stage, name: trimmedName } : stage))
  );
}

export function deletePipelineStage(
  state: JobTrackerPersistedState,
  applicationId: string,
  stageId: string
): JobTrackerPersistedState {
  return applyPipelineUpdate(state, applicationId, (pipeline) =>
    pipeline.filter((stage) => stage.id !== stageId)
  );
}

export function reorderPipelineStage(
  state: JobTrackerPersistedState,
  applicationId: string,
  stageId: string,
  direction: "up" | "down"
): JobTrackerPersistedState {
  return applyPipelineUpdate(state, applicationId, (pipeline) => {
    const index = pipeline.findIndex((stage) => stage.id === stageId);

    if (index === -1) {
      return pipeline;
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= pipeline.length) {
      return pipeline;
    }

    const nextPipeline = [...pipeline];
    [nextPipeline[index], nextPipeline[targetIndex]] = [
      nextPipeline[targetIndex],
      nextPipeline[index],
    ];

    return nextPipeline;
  });
}

export function setPipelineStageStatus(
  state: JobTrackerPersistedState,
  applicationId: string,
  stageId: string,
  status: PipelineStageStatus
): JobTrackerPersistedState {
  return applyPipelineUpdate(state, applicationId, (pipeline) =>
    setStageStatusInPipeline(pipeline, stageId, status)
  );
}

export function initJobTrackerState(): JobTrackerPersistedState {
  const existing = readStorage<unknown>(JOB_TRACKER_STORAGE_KEY);

  if (!existing) {
    const seed = createSeedState();
    writeStorage(JOB_TRACKER_STORAGE_KEY, seed);
    return seed;
  }

  const migrated = migrateJobTrackerState(existing);
  writeStorage(JOB_TRACKER_STORAGE_KEY, migrated);
  return migrated;
}

export function getJobTrackerState(): JobTrackerPersistedState {
  const existing = readStorage<unknown>(JOB_TRACKER_STORAGE_KEY);

  if (!existing) {
    return createSeedState();
  }

  return migrateJobTrackerState(existing);
}

export function saveJobTrackerState(state: JobTrackerPersistedState): JobTrackerPersistedState {
  writeStorage(JOB_TRACKER_STORAGE_KEY, state);
  return state;
}

export function addJobApplication(
  state: JobTrackerPersistedState,
  input: JobApplicationInput
): JobTrackerPersistedState {
  const nextState = {
    ...state,
    applications: createItem(
      state.applications,
      syncApplicationFromPipeline(normalizeJobApplication(input))
    ),
  };

  return saveJobTrackerState(nextState);
}

export function editJobApplication(
  state: JobTrackerPersistedState,
  id: string,
  input: JobApplicationInput
): JobTrackerPersistedState {
  const existing = state.applications.find((application) => application.id === id);

  if (!existing) {
    return state;
  }

  const nextState = {
    ...state,
    applications: updateItem(
      state.applications,
      id,
      syncApplicationFromPipeline(normalizeJobApplication(input, existing))
    ),
  };

  return saveJobTrackerState(nextState);
}

export function removeJobApplication(
  state: JobTrackerPersistedState,
  id: string
): JobTrackerPersistedState {
  const nextState = {
    ...state,
    applications: deleteItem(state.applications, id),
  };

  return saveJobTrackerState(nextState);
}

export function archiveJobApplication(
  state: JobTrackerPersistedState,
  id: string
): JobTrackerPersistedState {
  const existing = state.applications.find((application) => application.id === id);

  if (!existing) {
    return state;
  }

  const nextState = {
    ...state,
    applications: updateItem(state.applications, id, { archived: true }),
  };

  return saveJobTrackerState(nextState);
}

export function restoreJobApplication(
  state: JobTrackerPersistedState,
  id: string
): JobTrackerPersistedState {
  const existing = state.applications.find((application) => application.id === id);

  if (!existing) {
    return state;
  }

  const nextState = {
    ...state,
    applications: updateItem(state.applications, id, { archived: false }),
  };

  return saveJobTrackerState(nextState);
}

export function setJobApplicationFavourite(
  state: JobTrackerPersistedState,
  id: string,
  favourite: boolean
): JobTrackerPersistedState {
  const existing = state.applications.find((application) => application.id === id);

  if (!existing) {
    return state;
  }

  const nextState = {
    ...state,
    applications: updateItem(state.applications, id, { favourite }),
  };

  return saveJobTrackerState(nextState);
}

export function buildJobTrackerStats(state: JobTrackerPersistedState): StatCardData[] {
  const visible = state.applications.filter((application) => !application.archived);
  const activeApplications = visible.filter((application) => application.applicationStatus === "Active");
  const interviewCount = visible.filter((application) =>
    interviewStages.includes(application.currentStage)
  ).length;
  const respondedApplications = visible.filter(
    (application) => application.currentStage !== "Wishlist" && application.currentStage !== "Applied"
  ).length;
  const eligibleApplications = visible.filter((application) => application.currentStage !== "Wishlist");
  const responseRate =
    eligibleApplications.length > 0
      ? Math.round((respondedApplications / eligibleApplications.length) * 100)
      : 0;
  const offerCount = visible.filter(
    (application) => application.currentStage === "Offer" || application.currentStage === "Accepted"
  ).length;

  return [
    {
      id: "active",
      label: "Active",
      value: String(activeApplications.length),
      trend: "Applications",
      icon: Briefcase,
      color: "#5b5bd6",
      tint: "rgba(91,91,214,0.09)",
    },
    {
      id: "interviews",
      label: "Interviews",
      value: String(interviewCount),
      trend: "Total rounds done",
      icon: CheckCircle2,
      color: "#10b981",
      tint: "rgba(16,185,129,0.09)",
    },
    {
      id: "response-rate",
      label: "Response Rate",
      value: `${responseRate}%`,
      trend: "Of applications",
      icon: TrendingUp,
      color: "#f59e0b",
      tint: "rgba(245,158,11,0.09)",
    },
    {
      id: "offers",
      label: "Offers",
      value: String(offerCount),
      trend: "This cycle",
      trendUp: offerCount > 0,
      trendColor: offerCount > 0 ? undefined : "#e17100",
      icon: Trophy,
      color: "#f97316",
      tint: "rgba(249,115,22,0.09)",
    },
  ];
}

export function jobApplicationToInput(application: PersistedJobApplication): JobApplicationInput {
  return {
    companyName: application.companyName,
    jobTitle: application.jobTitle,
    jobType: application.jobType,
    workMode: application.workMode,
    location: application.location,
    appliedDate: application.appliedDate,
    currentStage: application.currentStage,
    applicationStatus: application.applicationStatus,
    salary: application.salary,
    jobUrl: application.jobUrl,
    recruiterName: application.recruiterName,
    recruiterEmail: application.recruiterEmail,
    recruiterLinkedIn: application.recruiterLinkedIn,
    interviewDate: application.interviewDate,
    notes: application.notes,
    favourite: application.favourite,
    archived: application.archived,
  };
}

export function findPersistedJobApplication(
  state: JobTrackerPersistedState,
  id: string
): PersistedJobApplication | undefined {
  return state.applications.find((application) => application.id === id);
}
