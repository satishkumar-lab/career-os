import type { StatCardData } from "@/components/dashboard/types";
import type { Project, ProjectStatus } from "@/components/projects/types";
import { Code2, Globe, Package, Zap } from "lucide-react";

import { projects as seedProjects } from "@/lib/mock/projects";
import {
  legacySeedColors,
  PROJECTS_STORAGE_KEY,
  statusColors,
} from "@/lib/projects/constants";
import type { ProjectThumbnail } from "@/lib/projects/thumbnail";
import { createItem, deleteItem, updateItem } from "@/lib/storage/crud";
import { readStorage, writeStorage } from "@/lib/storage/local-storage";

export interface PersistedProject {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  thumbnail: ProjectThumbnail;
  favourite: boolean;
  archived: boolean;
  notes: string;
  colorKey?: string;
}

export interface ProjectsPersistedState {
  projects: PersistedProject[];
}

export interface ProjectInput {
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  thumbnail: ProjectThumbnail;
  favourite: boolean;
  archived: boolean;
  notes: string;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

function isProjectStatus(value: string): value is ProjectStatus {
  return (
    value === "Planning" ||
    value === "Building" ||
    value === "Live" ||
    value === "Completed" ||
    value === "Archived"
  );
}

function resolveThumbnail(raw: Record<string, unknown>): ProjectThumbnail {
  const thumbnail = raw.thumbnail;

  if (thumbnail && typeof thumbnail === "object") {
    const typed = thumbnail as ProjectThumbnail;

    if (typed.type === "none") {
      return typed;
    }

    if (typed.type === "custom" && typeof typed.dataUrl === "string") {
      return typed;
    }
  }

  return { type: "none" };
}

function migrateProjectRecord(raw: unknown): PersistedProject {
  const record = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const rawStatus = String(record.status ?? "Building");
  const status = isProjectStatus(rawStatus) ? rawStatus : "Building";
  const rawId = typeof record.id === "string" ? record.id : "";
  const id = isUuid(rawId) ? rawId : crypto.randomUUID();
  const colorKey =
    typeof record.colorKey === "string"
      ? record.colorKey
      : rawId && rawId in legacySeedColors
        ? rawId
        : undefined;

  let startDate = typeof record.startDate === "string" ? record.startDate : "";

  if (!startDate && typeof record.startedLabel === "string") {
    startDate = record.startedLabel.replace(/^Started\s+/i, "");
  }

  return {
    id,
    name: typeof record.name === "string" ? record.name : "",
    description: typeof record.description === "string" ? record.description : "",
    status,
    startDate,
    endDate: typeof record.endDate === "string" ? record.endDate : "",
    techStack: Array.isArray(record.techStack)
      ? record.techStack.filter((item): item is string => typeof item === "string")
      : [],
    githubUrl: typeof record.githubUrl === "string" ? record.githubUrl : "",
    liveUrl: typeof record.liveUrl === "string" ? record.liveUrl : "",
    thumbnail: resolveThumbnail(record),
    favourite: typeof record.favourite === "boolean" ? record.favourite : false,
    archived: typeof record.archived === "boolean" ? record.archived : false,
    notes: typeof record.notes === "string" ? record.notes : "",
    colorKey,
  };
}

function migrateProjectsState(raw: unknown): ProjectsPersistedState {
  if (!raw || typeof raw !== "object" || !("projects" in raw) || !Array.isArray(raw.projects)) {
    return createSeedState();
  }

  const state = raw as { projects: unknown[] };

  return {
    projects: state.projects.map(migrateProjectRecord),
  };
}

function createSeedState(): ProjectsPersistedState {
  return {
    projects: seedProjects.map((project) => {
      const startDate = project.startedLabel.replace(/^Started\s+/i, "");

      return {
        id: crypto.randomUUID(),
        name: project.name,
        description: project.description,
        status: project.status,
        startDate,
        endDate: "",
        techStack: project.techStack,
        githubUrl: project.githubUrl ?? "",
        liveUrl: project.liveUrl ?? "",
        thumbnail: { type: "none" },
        favourite: false,
        archived: false,
        notes: "",
        colorKey: project.id,
      };
    }),
  };
}

function normalizeProject(input: ProjectInput, existing?: PersistedProject): PersistedProject {
  return {
    id: existing?.id ?? crypto.randomUUID(),
    name: input.name.trim(),
    description: input.description.trim(),
    status: input.status,
    startDate: input.startDate.trim(),
    endDate: input.endDate.trim(),
    techStack: input.techStack,
    githubUrl: input.githubUrl.trim(),
    liveUrl: input.liveUrl.trim(),
    thumbnail: input.thumbnail,
    favourite: input.favourite,
    archived: input.archived,
    notes: input.notes.trim(),
    colorKey: existing?.colorKey,
  };
}

export function toProject(project: PersistedProject): Project {
  const colors =
    project.colorKey && project.colorKey in legacySeedColors
      ? legacySeedColors[project.colorKey]
      : statusColors[project.status];

  return {
    id: project.id,
    name: project.name,
    startedLabel: project.startDate ? `Started ${project.startDate}` : "",
    description: project.description,
    status: project.status,
    techStack: project.techStack,
    githubUrl: project.githubUrl || undefined,
    liveUrl: project.liveUrl || undefined,
    favourite: project.favourite,
    archived: project.archived,
    color: colors.color,
    tint: colors.tint,
  };
}

export function toProjects(projects: PersistedProject[]): Project[] {
  return projects.map(toProject);
}

export function initProjectsState(): ProjectsPersistedState {
  const existing = readStorage<unknown>(PROJECTS_STORAGE_KEY);

  if (!existing) {
    const seed = createSeedState();
    writeStorage(PROJECTS_STORAGE_KEY, seed);
    return seed;
  }

  const migrated = migrateProjectsState(existing);
  writeStorage(PROJECTS_STORAGE_KEY, migrated);
  return migrated;
}

export function getProjectsState(): ProjectsPersistedState {
  const existing = readStorage<unknown>(PROJECTS_STORAGE_KEY);

  if (!existing) {
    return createSeedState();
  }

  return migrateProjectsState(existing);
}

export function saveProjectsState(state: ProjectsPersistedState): ProjectsPersistedState {
  writeStorage(PROJECTS_STORAGE_KEY, state);
  return state;
}

export function addProject(state: ProjectsPersistedState, input: ProjectInput): ProjectsPersistedState {
  const nextState = {
    ...state,
    projects: createItem(state.projects, normalizeProject(input)),
  };

  return saveProjectsState(nextState);
}

export function editProject(
  state: ProjectsPersistedState,
  id: string,
  input: ProjectInput
): ProjectsPersistedState {
  const existing = state.projects.find((project) => project.id === id);

  if (!existing) {
    return state;
  }

  const nextState = {
    ...state,
    projects: updateItem(state.projects, id, normalizeProject(input, existing)),
  };

  return saveProjectsState(nextState);
}

export function removeProject(state: ProjectsPersistedState, id: string): ProjectsPersistedState {
  const nextState = {
    ...state,
    projects: deleteItem(state.projects, id),
  };

  return saveProjectsState(nextState);
}

export function archiveProject(state: ProjectsPersistedState, id: string): ProjectsPersistedState {
  const existing = state.projects.find((project) => project.id === id);

  if (!existing) {
    return state;
  }

  const nextState = {
    ...state,
    projects: updateItem(state.projects, id, { archived: true }),
  };

  return saveProjectsState(nextState);
}

export function restoreProject(state: ProjectsPersistedState, id: string): ProjectsPersistedState {
  const existing = state.projects.find((project) => project.id === id);

  if (!existing) {
    return state;
  }

  const nextState = {
    ...state,
    projects: updateItem(state.projects, id, { archived: false }),
  };

  return saveProjectsState(nextState);
}

export function setProjectFavourite(
  state: ProjectsPersistedState,
  id: string,
  favourite: boolean
): ProjectsPersistedState {
  const existing = state.projects.find((project) => project.id === id);

  if (!existing) {
    return state;
  }

  const nextState = {
    ...state,
    projects: updateItem(state.projects, id, { favourite }),
  };

  return saveProjectsState(nextState);
}

export function buildProjectStats(state: ProjectsPersistedState): StatCardData[] {
  const visible = state.projects.filter((project) => !project.archived);
  const liveCount = visible.filter((project) => project.status === "Live").length;
  const buildingCount = visible.filter((project) => project.status === "Building").length;
  const uniqueTechStacks = new Set(visible.flatMap((project) => project.techStack)).size;

  return [
    {
      id: "total-projects",
      label: "Total Projects",
      value: String(visible.length),
      trend: "All time",
      icon: Code2,
      color: "#5b5bd6",
      tint: "rgba(91,91,214,0.09)",
    },
    {
      id: "live",
      label: "Live",
      value: String(liveCount),
      trend: "Shipped & running",
      icon: Globe,
      color: "#10b981",
      tint: "rgba(16,185,129,0.09)",
    },
    {
      id: "building",
      label: "Building",
      value: String(buildingCount),
      trend: "In progress",
      icon: Zap,
      color: "#f59e0b",
      tint: "rgba(245,158,11,0.09)",
    },
    {
      id: "tech-stacks",
      label: "Tech Stacks",
      value: String(uniqueTechStacks),
      trend: "Languages used",
      icon: Package,
      color: "#f97316",
      tint: "rgba(249,115,22,0.09)",
    },
  ];
}

export function projectToInput(project: PersistedProject): ProjectInput {
  return {
    name: project.name,
    description: project.description,
    status: project.status,
    startDate: project.startDate,
    endDate: project.endDate,
    techStack: project.techStack,
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
    thumbnail: project.thumbnail,
    favourite: project.favourite,
    archived: project.archived,
    notes: project.notes,
  };
}

export function findPersistedProject(
  state: ProjectsPersistedState,
  id: string
): PersistedProject | undefined {
  return state.projects.find((project) => project.id === id);
}
