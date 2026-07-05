import type { ComponentType, CSSProperties } from "react";

export type AiToolLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface AiTool {
  id: string;
  name: string;
  lastUsedLabel: string;
  level: AiToolLevel;
  percent: number;
  projectsBuilt: number;
  note: string;
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  color: string;
  tint: string;
  trackTint: string;
}
