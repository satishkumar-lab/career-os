import { Code2, FileText, Globe, Zap } from "lucide-react";

import type { StatCardData } from "@/components/dashboard/types";
import type { PortfolioProject } from "@/components/portfolio/types";

export const portfolioStats: StatCardData[] = [
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
    id: "published",
    label: "Published",
    value: "1",
    trend: "Live on portfolio",
    icon: Globe,
    color: "#10b981",
    tint: "rgba(16,185,129,0.09)",
  },
  {
    id: "in-progress",
    label: "In Progress",
    value: "3",
    trend: "Being designed",
    icon: Zap,
    color: "#f59e0b",
    tint: "rgba(245,158,11,0.09)",
  },
  {
    id: "case-studies",
    label: "Case Studies",
    value: "2",
    trend: "Fully documented",
    icon: FileText,
    color: "#f97316",
    tint: "rgba(249,115,22,0.09)",
  },
];

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "fintech-dashboard",
    name: "Fintech Dashboard",
    stages: {
      research: true,
      wireframe: true,
      uiDesign: true,
      prototype: true,
      dev: true,
      published: true,
    },
  },
  {
    id: "mobile-redesign-paytm",
    name: "Mobile Redesign — Paytm",
    stages: {
      research: true,
      wireframe: true,
      uiDesign: true,
      prototype: true,
      dev: false,
      published: false,
    },
  },
  {
    id: "careeros-case-study",
    name: "CareerOS Case Study",
    stages: {
      research: true,
      wireframe: true,
      uiDesign: false,
      prototype: false,
      dev: false,
      published: false,
    },
  },
  {
    id: "b2b-saas-onboarding",
    name: "B2B SaaS Onboarding",
    stages: {
      research: true,
      wireframe: false,
      uiDesign: false,
      prototype: false,
      dev: false,
      published: false,
    },
  },
];
