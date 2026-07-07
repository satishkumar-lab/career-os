import type { StatCardData } from "@/components/dashboard/types";
import type {
  PortfolioCategory,
  PortfolioProject,
  PortfolioStage,
  PortfolioStatus,
} from "@/components/portfolio/types";
import { defaultPortfolioStages as emptyStages } from "@/components/portfolio/types";
import { Code2, FileText, Globe, Zap } from "lucide-react";

import {
  defaultSeedCategories,
  defaultSeedTags,
  PORTFOLIO_STORAGE_KEY,
} from "@/lib/portfolio/constants";
import type { PortfolioThumbnail } from "@/lib/portfolio/thumbnail";
import { createItem, deleteItem, updateItem } from "@/lib/storage/crud";
import { readStorage, writeStorage } from "@/lib/storage/local-storage";

export interface PersistedPortfolioProject {
  id: string;
  title: string;
  description: string;
  category: PortfolioCategory;
  status: PortfolioStatus;
  completionDate: string;
  behanceUrl: string;
  dribbbleUrl: string;
  liveWebsiteUrl: string;
  figmaUrl: string;
  thumbnail: PortfolioThumbnail;
  tags: string[];
  favourite: boolean;
  archived: boolean;
  notes: string;
  stages: Record<PortfolioStage, boolean>;
}

export interface PortfolioPersistedState {
  projects: PersistedPortfolioProject[];
}

export interface PortfolioProjectInput {
  title: string;
  description: string;
  category: PortfolioCategory;
  status: PortfolioStatus;
  completionDate: string;
  behanceUrl: string;
  dribbbleUrl: string;
  liveWebsiteUrl: string;
  figmaUrl: string;
  thumbnail: PortfolioThumbnail;
  tags: string[];
  favourite: boolean;
  archived: boolean;
  notes: string;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

function isPortfolioCategory(value: string): value is PortfolioCategory {
  return (
    value === "UX Case Study" ||
    value === "UI Design" ||
    value === "Product Design" ||
    value === "Mobile App" ||
    value === "Website" ||
    value === "Dashboard" ||
    value === "Other"
  );
}

function isPortfolioStatus(value: string): value is PortfolioStatus {
  return value === "Draft" || value === "Published" || value === "Archived";
}

function resolveThumbnail(raw: Record<string, unknown>): PortfolioThumbnail {
  const thumbnail = raw.thumbnail;

  if (thumbnail && typeof thumbnail === "object") {
    const typed = thumbnail as PortfolioThumbnail;

    if (typed.type === "none") {
      return typed;
    }

    if (typed.type === "custom" && typeof typed.dataUrl === "string") {
      return typed;
    }
  }

  return { type: "none" };
}

function resolveStages(raw: Record<string, unknown>): Record<PortfolioStage, boolean> {
  const stages = raw.stages;

  if (stages && typeof stages === "object") {
    const typed = stages as Record<string, unknown>;

    return {
      research: Boolean(typed.research),
      wireframe: Boolean(typed.wireframe),
      uiDesign: Boolean(typed.uiDesign),
      prototype: Boolean(typed.prototype),
      dev: Boolean(typed.dev),
      published: Boolean(typed.published),
    };
  }

  return { ...emptyStages };
}

function resolveStatus(
  raw: Record<string, unknown>,
  stages: Record<PortfolioStage, boolean>
): PortfolioStatus {
  if (typeof raw.status === "string" && isPortfolioStatus(raw.status)) {
    return raw.status;
  }

  if (stages.published) {
    return "Published";
  }

  return "Draft";
}

function migratePortfolioRecord(raw: unknown): PersistedPortfolioProject {
  const record = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const rawId = typeof record.id === "string" ? record.id : "";
  const id = isUuid(rawId) ? rawId : crypto.randomUUID();
  const stages = resolveStages(record);
  const legacyKey = rawId && !isUuid(rawId) ? rawId : undefined;

  return {
    id,
    title:
      typeof record.title === "string"
        ? record.title
        : typeof record.name === "string"
          ? record.name
          : "",
    description: typeof record.description === "string" ? record.description : "",
    category:
      typeof record.category === "string" && isPortfolioCategory(record.category)
        ? record.category
        : legacyKey && legacyKey in defaultSeedCategories
          ? defaultSeedCategories[legacyKey]
          : "Other",
    status: resolveStatus(record, stages),
    completionDate: typeof record.completionDate === "string" ? record.completionDate : "",
    behanceUrl: typeof record.behanceUrl === "string" ? record.behanceUrl : "",
    dribbbleUrl: typeof record.dribbbleUrl === "string" ? record.dribbbleUrl : "",
    liveWebsiteUrl:
      typeof record.liveWebsiteUrl === "string"
        ? record.liveWebsiteUrl
        : typeof record.liveUrl === "string"
          ? record.liveUrl
          : "",
    figmaUrl: typeof record.figmaUrl === "string" ? record.figmaUrl : "",
    thumbnail: resolveThumbnail(record),
    tags: Array.isArray(record.tags)
      ? record.tags.filter((item): item is string => typeof item === "string")
      : legacyKey && legacyKey in defaultSeedTags
        ? defaultSeedTags[legacyKey]
        : [],
    favourite: typeof record.favourite === "boolean" ? record.favourite : false,
    archived: typeof record.archived === "boolean" ? record.archived : false,
    notes: typeof record.notes === "string" ? record.notes : "",
    stages,
  };
}

function migratePortfolioState(raw: unknown): PortfolioPersistedState {
  if (!raw || typeof raw !== "object" || !("projects" in raw) || !Array.isArray(raw.projects)) {
    return createSeedState();
  }

  const state = raw as { projects: unknown[] };

  return {
    projects: state.projects.map(migratePortfolioRecord),
  };
}

function createSeedState(): PortfolioPersistedState {
  return {
    projects: [],
  };
}

function normalizePortfolioProject(
  input: PortfolioProjectInput,
  existing?: PersistedPortfolioProject
): PersistedPortfolioProject {
  return {
    id: existing?.id ?? crypto.randomUUID(),
    title: input.title.trim(),
    description: input.description.trim(),
    category: input.category,
    status: input.status,
    completionDate: input.completionDate.trim(),
    behanceUrl: input.behanceUrl.trim(),
    dribbbleUrl: input.dribbbleUrl.trim(),
    liveWebsiteUrl: input.liveWebsiteUrl.trim(),
    figmaUrl: input.figmaUrl.trim(),
    thumbnail: input.thumbnail,
    tags: input.tags,
    favourite: input.favourite,
    archived: input.archived,
    notes: input.notes.trim(),
    stages: existing?.stages ?? { ...emptyStages },
  };
}

export function toPortfolioProject(project: PersistedPortfolioProject): PortfolioProject {
  return {
    id: project.id,
    name: project.title,
    stages: project.stages,
    favourite: project.favourite,
    archived: project.archived,
  };
}

export function toPortfolioProjects(projects: PersistedPortfolioProject[]): PortfolioProject[] {
  return projects.map(toPortfolioProject);
}

export function initPortfolioState(): PortfolioPersistedState {
  const existing = readStorage<unknown>(PORTFOLIO_STORAGE_KEY);

  if (!existing) {
    const seed = createSeedState();
    writeStorage(PORTFOLIO_STORAGE_KEY, seed);
    return seed;
  }

  const migrated = migratePortfolioState(existing);
  writeStorage(PORTFOLIO_STORAGE_KEY, migrated);
  return migrated;
}

export function getPortfolioState(): PortfolioPersistedState {
  const existing = readStorage<unknown>(PORTFOLIO_STORAGE_KEY);

  if (!existing) {
    return createSeedState();
  }

  return migratePortfolioState(existing);
}

export function savePortfolioState(state: PortfolioPersistedState): PortfolioPersistedState {
  writeStorage(PORTFOLIO_STORAGE_KEY, state);
  return state;
}

export function addPortfolioProject(
  state: PortfolioPersistedState,
  input: PortfolioProjectInput
): PortfolioPersistedState {
  const nextState = {
    ...state,
    projects: createItem(state.projects, normalizePortfolioProject(input)),
  };

  return savePortfolioState(nextState);
}

export function editPortfolioProject(
  state: PortfolioPersistedState,
  id: string,
  input: PortfolioProjectInput
): PortfolioPersistedState {
  const existing = state.projects.find((project) => project.id === id);

  if (!existing) {
    return state;
  }

  const nextState = {
    ...state,
    projects: updateItem(state.projects, id, normalizePortfolioProject(input, existing)),
  };

  return savePortfolioState(nextState);
}

export function removePortfolioProject(
  state: PortfolioPersistedState,
  id: string
): PortfolioPersistedState {
  const nextState = {
    ...state,
    projects: deleteItem(state.projects, id),
  };

  return savePortfolioState(nextState);
}

export function archivePortfolioProject(
  state: PortfolioPersistedState,
  id: string
): PortfolioPersistedState {
  const existing = state.projects.find((project) => project.id === id);

  if (!existing) {
    return state;
  }

  const nextState = {
    ...state,
    projects: updateItem(state.projects, id, { archived: true }),
  };

  return savePortfolioState(nextState);
}

export function restorePortfolioProject(
  state: PortfolioPersistedState,
  id: string
): PortfolioPersistedState {
  const existing = state.projects.find((project) => project.id === id);

  if (!existing) {
    return state;
  }

  const nextState = {
    ...state,
    projects: updateItem(state.projects, id, { archived: false }),
  };

  return savePortfolioState(nextState);
}

export function setPortfolioFavourite(
  state: PortfolioPersistedState,
  id: string,
  favourite: boolean
): PortfolioPersistedState {
  const existing = state.projects.find((project) => project.id === id);

  if (!existing) {
    return state;
  }

  const nextState = {
    ...state,
    projects: updateItem(state.projects, id, { favourite }),
  };

  return savePortfolioState(nextState);
}

export function buildPortfolioStats(state: PortfolioPersistedState): StatCardData[] {
  const visible = state.projects.filter((project) => !project.archived);
  const publishedCount = visible.filter((project) => project.status === "Published").length;
  const inProgressCount = visible.filter((project) => project.status === "Draft").length;
  const caseStudyCount = visible.filter((project) => project.category === "UX Case Study").length;

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
      id: "published",
      label: "Published",
      value: String(publishedCount),
      trend: "Live on portfolio",
      icon: Globe,
      color: "#10b981",
      tint: "rgba(16,185,129,0.09)",
    },
    {
      id: "in-progress",
      label: "In Progress",
      value: String(inProgressCount),
      trend: "Being designed",
      icon: Zap,
      color: "#f59e0b",
      tint: "rgba(245,158,11,0.09)",
    },
    {
      id: "case-studies",
      label: "Case Studies",
      value: String(caseStudyCount),
      trend: "Fully documented",
      icon: FileText,
      color: "#f97316",
      tint: "rgba(249,115,22,0.09)",
    },
  ];
}

export function portfolioProjectToInput(project: PersistedPortfolioProject): PortfolioProjectInput {
  return {
    title: project.title,
    description: project.description,
    category: project.category,
    status: project.status,
    completionDate: project.completionDate,
    behanceUrl: project.behanceUrl,
    dribbbleUrl: project.dribbbleUrl,
    liveWebsiteUrl: project.liveWebsiteUrl,
    figmaUrl: project.figmaUrl,
    thumbnail: project.thumbnail,
    tags: project.tags,
    favourite: project.favourite,
    archived: project.archived,
    notes: project.notes,
  };
}

export function findPersistedPortfolioProject(
  state: PortfolioPersistedState,
  id: string
): PersistedPortfolioProject | undefined {
  return state.projects.find((project) => project.id === id);
}
