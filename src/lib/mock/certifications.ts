import { Award, BookOpen, Calendar, GraduationCap } from "lucide-react";

import type { StatCardData } from "@/components/dashboard/types";
import type { CertificationStatus } from "@/components/certifications/types";

export const certificationStats: StatCardData[] = [
  {
    id: "in-progress",
    label: "In Progress",
    value: "1",
    trend: "Active",
    icon: BookOpen,
    color: "#5b5bd6",
    tint: "rgba(91,91,214,0.09)",
  },
  {
    id: "completed",
    label: "Completed",
    value: "2",
    trend: "Earned",
    icon: GraduationCap,
    color: "#10b981",
    tint: "rgba(16,185,129,0.09)",
  },
  {
    id: "planned",
    label: "Planned",
    value: "1",
    trend: "Upcoming",
    icon: Calendar,
    color: "#3b82f6",
    tint: "rgba(59,130,246,0.09)",
  },
  {
    id: "total",
    label: "Total",
    value: "4",
    trend: "All time",
    icon: Award,
    color: "#f97316",
    tint: "rgba(249,115,22,0.09)",
  },
];

export interface CertificationSeed {
  id: string;
  name: string;
  issuer: string;
  status: CertificationStatus;
  percent?: number;
  dateLabel: string;
}

export const certifications: CertificationSeed[] = [
  {
    id: "aws-solutions-architect",
    name: "AWS Solutions Architect",
    issuer: "Amazon Web Services",
    status: "In Progress",
    percent: 81,
    dateLabel: "Exam: Jul 18, 2025",
  },
  {
    id: "google-analytics-4",
    name: "Google Analytics 4",
    issuer: "Google",
    status: "Completed",
    percent: 100,
    dateLabel: "Jan 2025",
  },
  {
    id: "hubspot-content-marketing",
    name: "HubSpot Content Marketing",
    issuer: "HubSpot Academy",
    status: "Completed",
    percent: 100,
    dateLabel: "Oct 2024",
  },
  {
    id: "product-management-certificate",
    name: "Product Management Certificate",
    issuer: "Pragmatic Institute",
    status: "Planned",
    dateLabel: "Q4 2025",
  },
];
