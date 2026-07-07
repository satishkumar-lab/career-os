import type { ComponentType, CSSProperties } from "react";
import { Heart, Zap } from "lucide-react";

import {
  ClaudeLogo,
  CursorLogo,
  GeminiLogo,
  OpenAiLogo,
  PerplexityLogo,
  WindsurfLogo,
} from "@/components/ai-tools/brand-icons";
import type { AiToolCategory, AiToolLevel, AiToolStatus } from "@/components/ai-tools/types";

export const AI_TOOLS_STORAGE_KEY = "career-os-ai-tools";

export type AiToolIconKey =
  | "claude"
  | "chatgpt"
  | "cursor"
  | "gemini"
  | "perplexity"
  | "windsurf"
  | "lovable"
  | "bolt";

export const aiToolIconPresets: Record<
  AiToolIconKey,
  {
    label: string;
    color: string;
    tint: string;
    trackTint: string;
    icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  }
> = {
  claude: {
    label: "Claude",
    color: "#5b5bd6",
    tint: "rgba(91,91,214,0.09)",
    trackTint: "rgba(91,91,214,0.13)",
    icon: ClaudeLogo,
  },
  chatgpt: {
    label: "ChatGPT",
    color: "#10b981",
    tint: "rgba(16,185,129,0.09)",
    trackTint: "rgba(16,185,129,0.13)",
    icon: OpenAiLogo,
  },
  cursor: {
    label: "Cursor",
    color: "#0ea5e9",
    tint: "rgba(14,165,233,0.09)",
    trackTint: "rgba(14,165,233,0.13)",
    icon: CursorLogo,
  },
  gemini: {
    label: "Gemini",
    color: "#f59e0b",
    tint: "rgba(245,158,11,0.09)",
    trackTint: "rgba(245,158,11,0.13)",
    icon: GeminiLogo,
  },
  perplexity: {
    label: "Perplexity",
    color: "#8b5cf6",
    tint: "rgba(139,92,246,0.09)",
    trackTint: "rgba(139,92,246,0.13)",
    icon: PerplexityLogo,
  },
  windsurf: {
    label: "Windsurf",
    color: "#ec4899",
    tint: "rgba(236,72,153,0.09)",
    trackTint: "rgba(236,72,153,0.13)",
    icon: WindsurfLogo,
  },
  lovable: {
    label: "Lovable",
    color: "#f97316",
    tint: "rgba(249,115,22,0.09)",
    trackTint: "rgba(249,115,22,0.13)",
    icon: Heart,
  },
  bolt: {
    label: "Bolt",
    color: "#64748b",
    tint: "rgba(100,116,139,0.09)",
    trackTint: "rgba(100,116,139,0.13)",
    icon: Zap,
  },
};

export const aiToolLevels: AiToolLevel[] = ["Beginner", "Intermediate", "Advanced", "Expert"];

export const aiToolCategories: AiToolCategory[] = [
  "AI Assistant",
  "Code Editor",
  "Image Generator",
  "Video Generator",
  "Research",
  "Automation",
  "Other",
];

export const aiToolStatuses: { value: AiToolStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
];

export const defaultCategoryByIconKey: Record<AiToolIconKey, AiToolCategory> = {
  claude: "AI Assistant",
  chatgpt: "AI Assistant",
  gemini: "AI Assistant",
  cursor: "Code Editor",
  windsurf: "Code Editor",
  perplexity: "Research",
  lovable: "Automation",
  bolt: "Other",
};

export const aiToolFormSchema = {
  name: { required: true },
  category: { required: true },
  percent: { min: 0, max: 100 },
  projectsBuilt: { min: 0 },
  website: { url: true },
};
