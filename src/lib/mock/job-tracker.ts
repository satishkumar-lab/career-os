import { BookOpen, Briefcase, CheckCircle2, CreditCard, Layers, Minus, TrendingUp, Trophy } from "lucide-react";

import type { StatCardData } from "@/components/dashboard/types";
import type { JobApplication, PipelineStage } from "@/components/job-tracker/types";

export const jobTrackerStats: StatCardData[] = [
  {
    id: "active",
    label: "Active",
    value: "3",
    trend: "Applications",
    icon: Briefcase,
    color: "#5b5bd6",
    tint: "rgba(91,91,214,0.09)",
  },
  {
    id: "interviews",
    label: "Interviews",
    value: "6",
    trend: "Total rounds done",
    icon: CheckCircle2,
    color: "#10b981",
    tint: "rgba(16,185,129,0.09)",
  },
  {
    id: "response-rate",
    label: "Response Rate",
    value: "75%",
    trend: "Of applications",
    icon: TrendingUp,
    color: "#f59e0b",
    tint: "rgba(245,158,11,0.09)",
  },
  {
    id: "offers",
    label: "Offers",
    value: "0",
    trend: "This cycle",
    trendUp: false,
    trendColor: "#e17100",
    icon: Trophy,
    color: "#f97316",
    tint: "rgba(249,115,22,0.09)",
  },
];

export const pipelineStages: PipelineStage[] = [
  { id: "applied", label: "Applied", variant: "applied" },
  { id: "hr-round", label: "HR Round - 01", variant: "progress" },
  { id: "assignment", label: "Assignment - 01", variant: "progress" },
  { id: "technical", label: "Technical", variant: "inactive" },
  { id: "manager", label: "Manager", variant: "inactive" },
  { id: "final", label: "Final", variant: "inactive" },
  { id: "offer", label: "Offer", variant: "inactive" },
  { id: "rejected", label: "Rejected - 01", variant: "rejected" },
];

export const jobApplications: JobApplication[] = [
  {
    id: "figma",
    company: "Figma",
    role: "Senior Product Manager",
    appliedLabel: "Applied Jul 3",
    status: "Technical Round",
    icon: Layers,
    color: "#5b5bd6",
    tint: "rgba(91,91,214,0.08)",
  },
  {
    id: "stripe",
    company: "Stripe",
    role: "Product Manager II",
    appliedLabel: "Applied Jun 28",
    status: "Assignment",
    icon: CreditCard,
    color: "#10b981",
    tint: "rgba(16,185,129,0.08)",
  },
  {
    id: "linear",
    company: "Linear",
    role: "Senior PM",
    appliedLabel: "Applied Jun 20",
    status: "Rejected",
    icon: Minus,
    color: "#ef4444",
    tint: "rgba(239,68,68,0.08)",
  },
  {
    id: "notion",
    company: "Notion",
    role: "Product Lead",
    appliedLabel: "Applied Jul 1",
    status: "HR Round",
    icon: BookOpen,
    color: "#8b5cf6",
    tint: "rgba(139,92,246,0.08)",
  },
];
