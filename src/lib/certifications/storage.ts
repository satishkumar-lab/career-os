import type { StatCardData } from "@/components/dashboard/types";
import type { Certification, CertificationStatus } from "@/components/certifications/types";
import { Award, BookOpen, Calendar, GraduationCap } from "lucide-react";

import {
  CERTIFICATIONS_STORAGE_KEY,
  legacySeedColors,
  statusColors,
} from "@/lib/certifications/constants";
import { createItem, deleteItem, updateItem } from "@/lib/storage/crud";
import { readStorage, writeStorage } from "@/lib/storage/local-storage";

export interface PersistedCertification {
  id: string;
  name: string;
  provider: string;
  status: CertificationStatus;
  percent: number;
  examDate: string;
  credentialUrl: string;
  notes: string;
  favourite: boolean;
  archived: boolean;
  colorKey?: string;
}

export interface CertificationsPersistedState {
  certifications: PersistedCertification[];
}

export interface CertificationInput {
  name: string;
  provider: string;
  status: CertificationStatus;
  percent: number;
  examDate: string;
  credentialUrl: string;
  notes: string;
  favourite: boolean;
  archived: boolean;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

function isCertificationStatus(value: string): value is CertificationStatus {
  return value === "In Progress" || value === "Completed" || value === "Planned";
}

function migrateCertificationRecord(raw: unknown): PersistedCertification {
  const record = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const status = isCertificationStatus(String(record.status ?? ""))
    ? (record.status as CertificationStatus)
    : "Planned";
  const rawId = typeof record.id === "string" ? record.id : "";
  const id = isUuid(rawId) ? rawId : crypto.randomUUID();
  const colorKey =
    typeof record.colorKey === "string"
      ? record.colorKey
      : rawId && rawId in legacySeedColors
        ? rawId
        : undefined;

  return {
    id,
    name: typeof record.name === "string" ? record.name : "",
    provider:
      typeof record.provider === "string"
        ? record.provider
        : typeof record.issuer === "string"
          ? record.issuer
          : "",
    status,
    percent: typeof record.percent === "number" ? record.percent : status === "Completed" ? 100 : 0,
    examDate:
      typeof record.examDate === "string"
        ? record.examDate
        : typeof record.dateLabel === "string"
          ? record.dateLabel
          : "",
    credentialUrl:
      typeof record.credentialUrl === "string"
        ? record.credentialUrl
        : typeof record.credentialURL === "string"
          ? record.credentialURL
          : "",
    notes: typeof record.notes === "string" ? record.notes : "",
    favourite: typeof record.favourite === "boolean" ? record.favourite : false,
    archived: typeof record.archived === "boolean" ? record.archived : false,
    colorKey,
  };
}

function migrateCertificationsState(raw: unknown): CertificationsPersistedState {
  if (
    !raw ||
    typeof raw !== "object" ||
    !("certifications" in raw) ||
    !Array.isArray(raw.certifications)
  ) {
    return createSeedState();
  }

  const state = raw as { certifications: unknown[] };

  return {
    certifications: state.certifications.map(migrateCertificationRecord),
  };
}

function createSeedState(): CertificationsPersistedState {
  return {
    certifications: [],
  };
}

function normalizeCertification(
  input: CertificationInput,
  existing?: PersistedCertification
): PersistedCertification {
  return {
    id: existing?.id ?? crypto.randomUUID(),
    name: input.name.trim(),
    provider: input.provider.trim(),
    status: input.status,
    percent: input.status === "Planned" ? 0 : input.percent,
    examDate: input.examDate.trim(),
    credentialUrl: input.credentialUrl.trim(),
    notes: input.notes.trim(),
    favourite: input.favourite,
    archived: input.archived,
    colorKey: existing?.colorKey,
  };
}

export function toCertification(cert: PersistedCertification): Certification {
  const colors =
    cert.colorKey && cert.colorKey in legacySeedColors
      ? legacySeedColors[cert.colorKey]
      : statusColors[cert.status];

  return {
    id: cert.id,
    name: cert.name,
    issuer: cert.provider,
    status: cert.status,
    percent: cert.status === "Planned" ? undefined : cert.percent,
    dateLabel: cert.examDate,
    color: colors.color,
    tint: colors.tint,
    trackTint: colors.trackTint,
  };
}

export function toCertifications(certs: PersistedCertification[]): Certification[] {
  return certs.map((cert) => toCertification(cert));
}

function loadCertificationsState(): CertificationsPersistedState {
  const existing = readStorage<unknown>(CERTIFICATIONS_STORAGE_KEY);

  if (!existing) {
    return createSeedState();
  }

  return migrateCertificationsState(existing);
}

export function initCertificationsState(): CertificationsPersistedState {
  const existing = readStorage<unknown>(CERTIFICATIONS_STORAGE_KEY);

  if (!existing) {
    const seed = createSeedState();
    writeStorage(CERTIFICATIONS_STORAGE_KEY, seed);
    return seed;
  }

  const migrated = migrateCertificationsState(existing);
  writeStorage(CERTIFICATIONS_STORAGE_KEY, migrated);
  return migrated;
}

export function getCertificationsState(): CertificationsPersistedState {
  return loadCertificationsState();
}

export function saveCertificationsState(
  state: CertificationsPersistedState
): CertificationsPersistedState {
  writeStorage(CERTIFICATIONS_STORAGE_KEY, state);
  return state;
}

export function addCertification(
  state: CertificationsPersistedState,
  input: CertificationInput
): CertificationsPersistedState {
  const nextState = {
    ...state,
    certifications: createItem(state.certifications, normalizeCertification(input)),
  };

  return saveCertificationsState(nextState);
}

export function editCertification(
  state: CertificationsPersistedState,
  id: string,
  input: CertificationInput
): CertificationsPersistedState {
  const existing = state.certifications.find((cert) => cert.id === id);

  if (!existing) {
    return state;
  }

  const nextState = {
    ...state,
    certifications: updateItem(state.certifications, id, normalizeCertification(input, existing)),
  };

  return saveCertificationsState(nextState);
}

export function removeCertification(
  state: CertificationsPersistedState,
  id: string
): CertificationsPersistedState {
  const nextState = {
    ...state,
    certifications: deleteItem(state.certifications, id),
  };

  return saveCertificationsState(nextState);
}

export function buildCertificationStats(state: CertificationsPersistedState): StatCardData[] {
  const visible = state.certifications.filter((cert) => !cert.archived);
  const inProgress = visible.filter((cert) => cert.status === "In Progress").length;
  const completed = visible.filter((cert) => cert.status === "Completed").length;
  const planned = visible.filter((cert) => cert.status === "Planned").length;

  return [
    {
      id: "in-progress",
      label: "In Progress",
      value: String(inProgress),
      trend: "Active",
      icon: BookOpen,
      color: "#5b5bd6",
      tint: "rgba(91,91,214,0.09)",
    },
    {
      id: "completed",
      label: "Completed",
      value: String(completed),
      trend: "Earned",
      icon: GraduationCap,
      color: "#10b981",
      tint: "rgba(16,185,129,0.09)",
    },
    {
      id: "planned",
      label: "Planned",
      value: String(planned),
      trend: "Upcoming",
      icon: Calendar,
      color: "#3b82f6",
      tint: "rgba(59,130,246,0.09)",
    },
    {
      id: "total",
      label: "Total",
      value: String(visible.length),
      trend: "All time",
      icon: Award,
      color: "#f97316",
      tint: "rgba(249,115,22,0.09)",
    },
  ];
}

export function certificationToInput(cert: PersistedCertification): CertificationInput {
  return {
    name: cert.name,
    provider: cert.provider,
    status: cert.status,
    percent: cert.percent,
    examDate: cert.examDate,
    credentialUrl: cert.credentialUrl,
    notes: cert.notes,
    favourite: cert.favourite,
    archived: cert.archived,
  };
}

export function findPersistedCertification(
  state: CertificationsPersistedState,
  id: string
): PersistedCertification | undefined {
  return state.certifications.find((cert) => cert.id === id);
}
