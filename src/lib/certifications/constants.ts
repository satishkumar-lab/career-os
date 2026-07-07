import type { CertificationStatus } from "@/components/certifications/types";

export const CERTIFICATIONS_STORAGE_KEY = "career-os-certifications";

export const certificationStatuses: CertificationStatus[] = ["In Progress", "Completed", "Planned"];

export const certificationFormSchema = {
  name: { required: true },
  provider: { required: true },
  percent: { min: 0, max: 100 },
  credentialUrl: { url: true },
};

export const statusColors: Record<
  CertificationStatus,
  { color: string; tint: string; trackTint: string }
> = {
  "In Progress": {
    color: "#5b5bd6",
    tint: "rgba(91,91,214,0.09)",
    trackTint: "rgba(91,91,214,0.13)",
  },
  Completed: {
    color: "#10b981",
    tint: "rgba(16,185,129,0.09)",
    trackTint: "rgba(16,185,129,0.13)",
  },
  Planned: {
    color: "#8b5cf6",
    tint: "rgba(139,92,246,0.09)",
    trackTint: "rgba(139,92,246,0.13)",
  },
};

export const legacySeedColors: Record<string, { color: string; tint: string; trackTint: string }> = {
  "aws-solutions-architect": {
    color: "#10b981",
    tint: "rgba(16,185,129,0.09)",
    trackTint: "rgba(16,185,129,0.13)",
  },
  "google-analytics-4": {
    color: "#f59e0b",
    tint: "rgba(245,158,11,0.09)",
    trackTint: "rgba(245,158,11,0.13)",
  },
  "hubspot-content-marketing": {
    color: "#0ea5e9",
    tint: "rgba(14,165,233,0.09)",
    trackTint: "rgba(14,165,233,0.13)",
  },
  "product-management-certificate": {
    color: "#8b5cf6",
    tint: "rgba(139,92,246,0.09)",
    trackTint: "rgba(139,92,246,0.13)",
  },
};
