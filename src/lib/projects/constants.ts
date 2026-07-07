import type { ProjectStatus } from "@/components/projects/types";

export const PROJECTS_STORAGE_KEY = "career-os-projects";

export const projectStatuses: ProjectStatus[] = [
  "Planning",
  "Building",
  "Live",
  "Completed",
  "Archived",
];

export const techStackOptions = [
  "React",
  "TypeScript",
  "Next.js",
  "Tailwind",
  "Supabase",
  "PostgreSQL",
  "OpenAI",
  "Recharts",
  "Astro",
  "Node.js",
  "Python",
];

export const projectFormSchema = {
  name: { required: true },
  status: { required: true },
  githubUrl: { url: true },
  liveUrl: { url: true },
};

export const statusColors: Record<ProjectStatus, { color: string; tint: string }> = {
  Planning: { color: "#94a3b8", tint: "rgba(148,163,184,0.09)" },
  Building: { color: "#5b5bd6", tint: "rgba(91,91,214,0.09)" },
  Live: { color: "#10b981", tint: "rgba(16,185,129,0.09)" },
  Completed: { color: "#0ea5e9", tint: "rgba(14,165,233,0.09)" },
  Archived: { color: "#64748b", tint: "rgba(100,116,139,0.09)" },
};

export const legacySeedColors: Record<string, { color: string; tint: string }> = {
  "fintech-dashboard": { color: "#5b5bd6", tint: "rgba(91,91,214,0.09)" },
  careeros: { color: "#10b981", tint: "rgba(16,185,129,0.09)" },
  "ai-study-assistant": { color: "#8b5cf6", tint: "rgba(139,92,246,0.09)" },
  "portfolio-v3": { color: "#f59e0b", tint: "rgba(245,158,11,0.09)" },
};
