import type { ComponentType, CSSProperties } from "react";

import type { AiToolIconKey } from "@/lib/ai-tools/constants";

export type AiToolLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export type AiToolCategory =
  | "AI Assistant"
  | "Code Editor"
  | "Image Generator"
  | "Video Generator"
  | "Research"
  | "Automation"
  | "Other";

export type AiToolStatus = "active" | "archived";

export interface AiToolPresetLogo {
  type: "preset";
  iconKey: AiToolIconKey;
}

export interface AiToolCustomLogo {
  type: "custom";
  dataUrl: string;
}

export type AiToolLogo = AiToolPresetLogo | AiToolCustomLogo;

export interface AiTool {
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
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  color: string;
  tint: string;
  trackTint: string;
}
