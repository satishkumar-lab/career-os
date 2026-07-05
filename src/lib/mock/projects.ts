import { Code2, Globe, Package, Zap } from "lucide-react";

import type { StatCardData } from "@/components/dashboard/types";
import type { Project } from "@/components/projects/types";

/**
 * Mock data standing in for the CareerOS API/Supabase queries for the
 * Projects page. Shapes mirror the expected real endpoints.
 */

export const projectStats: StatCardData[] = [
  {
    id: "total-projects",
    label: "Total Projects",
    value: "4",
    trend: "All time",
    icon: Code2,
    color: "#5b5bd6",
    tint: "rgba(91,91,214,0.09)",
  },
  {
    id: "live",
    label: "Live",
    value: "2",
    trend: "Shipped & running",
    icon: Globe,
    color: "#10b981",
    tint: "rgba(16,185,129,0.09)",
  },
  {
    id: "building",
    label: "Building",
    value: "2",
    trend: "In progress",
    icon: Zap,
    color: "#f59e0b",
    tint: "rgba(245,158,11,0.09)",
  },
  {
    id: "tech-stacks",
    label: "Tech Stacks",
    value: "4",
    trend: "Languages used",
    icon: Package,
    color: "#f97316",
    tint: "rgba(249,115,22,0.09)",
  },
];

export const projects: Project[] = [
  {
    id: "fintech-dashboard",
    name: "Fintech Dashboard",
    startedLabel: "Started Mar 2025",
    description: "Analytics dashboard for fintech startup",
    status: "Live",
    techStack: ["React", "TypeScript", "Recharts"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    color: "#5b5bd6",
    tint: "rgba(91,91,214,0.09)",
  },
  {
    id: "careeros",
    name: "CareerOS",
    startedLabel: "Started Jun 2025",
    description: "Personal career growth operating system",
    status: "Building",
    techStack: ["React", "Tailwind", "Supabase"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    color: "#10b981",
    tint: "rgba(16,185,129,0.09)",
  },
  {
    id: "ai-study-assistant",
    name: "AI Study Assistant",
    startedLabel: "Started Jul 2025",
    description: "AI-powered study companion app",
    status: "Building",
    techStack: ["Next.js", "OpenAI", "PostgreSQL"],
    githubUrl: "https://github.com",
    color: "#8b5cf6",
    tint: "rgba(139,92,246,0.09)",
  },
  {
    id: "portfolio-v3",
    name: "Portfolio v3",
    startedLabel: "Started Jan 2025",
    description: "Personal portfolio redesign",
    status: "Live",
    techStack: ["Astro", "Tailwind"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    color: "#f59e0b",
    tint: "rgba(245,158,11,0.09)",
  },
];
