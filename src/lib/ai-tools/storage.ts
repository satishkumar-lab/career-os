import type { StatCardData } from "@/components/dashboard/types";
import type {
  AiTool,
  AiToolCategory,
  AiToolLevel,
  AiToolLogo,
  AiToolStatus,
} from "@/components/ai-tools/types";
import { BarChart3, Code2, Trophy, Zap } from "lucide-react";

import {
  AI_TOOLS_STORAGE_KEY,
  aiToolIconPresets,
  defaultCategoryByIconKey,
  type AiToolIconKey,
} from "@/lib/ai-tools/constants";
import { createItem, deleteItem, updateItem } from "@/lib/storage/crud";
import { readStorage, writeStorage } from "@/lib/storage/local-storage";

export interface PersistedAiTool {
  id: string;
  name: string;
  category: AiToolCategory;
  lastUsedLabel: string;
  level: AiToolLevel;
  percent: number;
  projectsBuilt: number;
  website: string;
  logo: AiToolLogo;
  note: string;
  favourite: boolean;
  status: AiToolStatus;
}

export interface AiToolsPersistedState {
  tools: PersistedAiTool[];
  totalSessions: string;
}

export interface AiToolInput {
  name: string;
  category: AiToolCategory;
  lastUsedLabel: string;
  level: AiToolLevel;
  percent: number;
  projectsBuilt: number;
  website: string;
  logo: AiToolLogo;
  note: string;
  favourite: boolean;
  status: AiToolStatus;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

function isIconKey(value: string): value is AiToolIconKey {
  return value in aiToolIconPresets;
}

function resolveLogo(raw: Record<string, unknown>): AiToolLogo {
  const logo = raw.logo;

  if (logo && typeof logo === "object") {
    const typedLogo = logo as AiToolLogo;

    if (typedLogo.type === "preset" && isIconKey(typedLogo.iconKey)) {
      return typedLogo;
    }

    if (typedLogo.type === "custom" && typeof typedLogo.dataUrl === "string") {
      return typedLogo;
    }
  }

  const legacyIconKey = raw.iconKey;
  const fallbackKey =
    typeof legacyIconKey === "string" && isIconKey(legacyIconKey)
      ? legacyIconKey
      : typeof raw.id === "string" && isIconKey(raw.id)
        ? raw.id
        : "claude";

  return { type: "preset", iconKey: fallbackKey };
}

function resolveCategory(raw: Record<string, unknown>, logo: AiToolLogo): AiToolCategory {
  if (typeof raw.category === "string") {
    return raw.category as AiToolCategory;
  }

  if (logo.type === "preset") {
    return defaultCategoryByIconKey[logo.iconKey];
  }

  return "Other";
}

function migrateToolRecord(raw: unknown): PersistedAiTool {
  const record = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const logo = resolveLogo(record);
  const id = typeof record.id === "string" && isUuid(record.id) ? record.id : crypto.randomUUID();

  return {
    id,
    name: typeof record.name === "string" ? record.name : "",
    category: resolveCategory(record, logo),
    lastUsedLabel: typeof record.lastUsedLabel === "string" ? record.lastUsedLabel : "",
    level:
      typeof record.level === "string" ? (record.level as AiToolLevel) : "Beginner",
    percent: typeof record.percent === "number" ? record.percent : 0,
    projectsBuilt: typeof record.projectsBuilt === "number" ? record.projectsBuilt : 0,
    website: typeof record.website === "string" ? record.website : "",
    logo,
    note: typeof record.note === "string" ? record.note : "",
    favourite: typeof record.favourite === "boolean" ? record.favourite : false,
    status: record.status === "archived" ? "archived" : "active",
  };
}

function migrateAiToolsState(raw: unknown): AiToolsPersistedState {
  if (!raw || typeof raw !== "object" || !("tools" in raw) || !Array.isArray(raw.tools)) {
    return createSeedState();
  }

  const state = raw as { tools: unknown[]; totalSessions?: string };

  return {
    tools: state.tools.map(migrateToolRecord),
    totalSessions: typeof state.totalSessions === "string" ? state.totalSessions : "0",
  };
}

function createSeedState(): AiToolsPersistedState {
  return {
    tools: [],
    totalSessions: "0",
  };
}

function normalizeTool(input: AiToolInput, existing?: PersistedAiTool): PersistedAiTool {
  return {
    id: existing?.id ?? crypto.randomUUID(),
    name: input.name.trim(),
    category: input.category,
    lastUsedLabel: input.lastUsedLabel.trim(),
    level: input.level,
    percent: input.percent,
    projectsBuilt: input.projectsBuilt,
    website: input.website.trim(),
    logo: input.logo,
    note: input.note.trim(),
    favourite: input.favourite,
    status: input.status,
  };
}

function resolveLogoPreset(logo: AiToolLogo) {
  if (logo.type === "preset") {
    return aiToolIconPresets[logo.iconKey];
  }

  return aiToolIconPresets.claude;
}

export function toAiTool(tool: PersistedAiTool): AiTool {
  const preset = resolveLogoPreset(tool.logo);

  return {
    id: tool.id,
    name: tool.name,
    category: tool.category,
    lastUsedLabel: tool.lastUsedLabel,
    level: tool.level,
    percent: tool.percent,
    projectsBuilt: tool.projectsBuilt,
    website: tool.website,
    logo: tool.logo,
    note: tool.note,
    favourite: tool.favourite,
    status: tool.status,
    icon: preset.icon,
    color: preset.color,
    tint: preset.tint,
    trackTint: preset.trackTint,
  };
}

export function toAiTools(tools: PersistedAiTool[]): AiTool[] {
  return tools.map(toAiTool);
}

function loadAiToolsState(): AiToolsPersistedState {
  const existing = readStorage<unknown>(AI_TOOLS_STORAGE_KEY);

  if (!existing) {
    return createSeedState();
  }

  return migrateAiToolsState(existing);
}

export function initAiToolsState(): AiToolsPersistedState {
  const existing = readStorage<unknown>(AI_TOOLS_STORAGE_KEY);

  if (!existing) {
    const seed = createSeedState();
    writeStorage(AI_TOOLS_STORAGE_KEY, seed);
    return seed;
  }

  const migrated = migrateAiToolsState(existing);
  writeStorage(AI_TOOLS_STORAGE_KEY, migrated);
  return migrated;
}

export function getAiToolsState(): AiToolsPersistedState {
  return loadAiToolsState();
}

export function saveAiToolsState(state: AiToolsPersistedState): AiToolsPersistedState {
  writeStorage(AI_TOOLS_STORAGE_KEY, state);
  return state;
}

export function addAiTool(state: AiToolsPersistedState, input: AiToolInput): AiToolsPersistedState {
  const nextState = {
    ...state,
    tools: createItem(state.tools, normalizeTool(input)),
  };

  return saveAiToolsState(nextState);
}

export function editAiTool(
  state: AiToolsPersistedState,
  id: string,
  input: AiToolInput
): AiToolsPersistedState {
  const existing = state.tools.find((tool) => tool.id === id);

  if (!existing) {
    return state;
  }

  const nextState = {
    ...state,
    tools: updateItem(state.tools, id, normalizeTool(input, existing)),
  };

  return saveAiToolsState(nextState);
}

export function removeAiTool(state: AiToolsPersistedState, id: string): AiToolsPersistedState {
  const nextState = {
    ...state,
    tools: deleteItem(state.tools, id),
  };

  return saveAiToolsState(nextState);
}

export function buildAiToolsStats(state: AiToolsPersistedState): StatCardData[] {
  const activeTools = state.tools.filter((tool) => tool.status === "active");
  const expertCount = activeTools.filter((tool) => tool.level === "Expert").length;
  const projectsBuilt = activeTools.reduce((sum, tool) => sum + tool.projectsBuilt, 0);

  return [
    {
      id: "tools-tracked",
      label: "Tools Tracked",
      value: String(activeTools.length),
      trend: "Active",
      icon: Zap,
      color: "#5b5bd6",
      tint: "rgba(91,91,214,0.09)",
    },
    {
      id: "expert-level",
      label: "Expert Level",
      value: String(expertCount),
      trend: "tools mastered",
      icon: Trophy,
      color: "#10b981",
      tint: "rgba(16,185,129,0.09)",
    },
    {
      id: "total-sessions",
      label: "Total Sessions",
      value: state.totalSessions,
      trend: "this week",
      icon: BarChart3,
      color: "#3b82f6",
      tint: "rgba(59,130,246,0.09)",
    },
    {
      id: "projects-built",
      label: "Projects Built",
      value: String(projectsBuilt),
      trend: "with AI tools",
      icon: Code2,
      color: "#f97316",
      tint: "rgba(249,115,22,0.09)",
    },
  ];
}

export function toolToInput(tool: PersistedAiTool): AiToolInput {
  return {
    name: tool.name,
    category: tool.category,
    lastUsedLabel: tool.lastUsedLabel,
    level: tool.level,
    percent: tool.percent,
    projectsBuilt: tool.projectsBuilt,
    website: tool.website,
    logo: tool.logo,
    note: tool.note,
    favourite: tool.favourite,
    status: tool.status,
  };
}

export function findPersistedTool(state: AiToolsPersistedState, id: string): PersistedAiTool | undefined {
  return state.tools.find((tool) => tool.id === id);
}
