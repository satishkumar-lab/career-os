export type CertificationStatus = "In Progress" | "Completed" | "Planned";

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  status: CertificationStatus;
  percent?: number;
  dateLabel: string;
  color: string;
  tint: string;
  trackTint: string;
}
