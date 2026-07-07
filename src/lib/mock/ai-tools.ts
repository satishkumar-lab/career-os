import { BarChart3, Code2, Trophy, Zap } from "lucide-react";

import type { StatCardData } from "@/components/dashboard/types";
import type { AiToolLevel } from "@/components/ai-tools/types";

export const aiToolsStats: StatCardData[] = [
  {
    id: "tools-tracked",
    label: "Tools Tracked",
    value: "8",
    trend: "Active",
    icon: Zap,
    color: "#5b5bd6",
    tint: "rgba(91,91,214,0.09)",
  },
  {
    id: "expert-level",
    label: "Expert Level",
    value: "1",
    trend: "tools mastered",
    icon: Trophy,
    color: "#10b981",
    tint: "rgba(16,185,129,0.09)",
  },
  {
    id: "total-sessions",
    label: "Total Sessions",
    value: "52",
    trend: "this week",
    icon: BarChart3,
    color: "#3b82f6",
    tint: "rgba(59,130,246,0.09)",
  },
  {
    id: "projects-built",
    label: "Projects Built",
    value: "53",
    trend: "with AI tools",
    icon: Code2,
    color: "#f97316",
    tint: "rgba(249,115,22,0.09)",
  },
];

export interface AiToolSeed {
  id: string;
  name: string;
  lastUsedLabel: string;
  level: AiToolLevel;
  percent: number;
  projectsBuilt: number;
  note: string;
}

export const aiTools: AiToolSeed[] = [
  {
    id: "claude",
    name: "Claude",
    lastUsedLabel: "Today",
    level: "Advanced",
    percent: 78,
    projectsBuilt: 12,
    note: "Writing, code review, summarization",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    lastUsedLabel: "Today",
    level: "Expert",
    percent: 90,
    projectsBuilt: 28,
    note: "Daily driver for quick questions",
  },
  {
    id: "cursor",
    name: "Cursor",
    lastUsedLabel: "Yesterday",
    level: "Intermediate",
    percent: 55,
    projectsBuilt: 6,
    note: "Building personal projects",
  },
  {
    id: "gemini",
    name: "Gemini",
    lastUsedLabel: "3 days ago",
    level: "Beginner",
    percent: 30,
    projectsBuilt: 2,
    note: "Exploring multimodal features",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    lastUsedLabel: "Today",
    level: "Advanced",
    percent: 72,
    projectsBuilt: 0,
    note: "Research and fact-checking",
  },
  {
    id: "windsurf",
    name: "Windsurf",
    lastUsedLabel: "1 week ago",
    level: "Beginner",
    percent: 20,
    projectsBuilt: 1,
    note: "Just started exploring",
  },
  {
    id: "lovable",
    name: "Lovable",
    lastUsedLabel: "2 days ago",
    level: "Intermediate",
    percent: 48,
    projectsBuilt: 3,
    note: "Rapid UI prototyping",
  },
  {
    id: "bolt",
    name: "Bolt",
    lastUsedLabel: "5 days ago",
    level: "Beginner",
    percent: 25,
    projectsBuilt: 1,
    note: "Testing for client projects",
  },
];
