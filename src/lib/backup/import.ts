import {
  BACKUP_APP_NAME,
  BACKUP_VERSION,
  CAREER_OS_MODULE_KEYS,
} from "@/lib/backup/constants";
import {
  getCareerOsStorageKeys,
  isCareerOsStorageKey,
} from "@/lib/backup/storage-keys";
import type { BackupValidationResult, CareerOsBackupFile } from "@/lib/backup/types";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasRecognizedModuleKey(data: Record<string, unknown>): boolean {
  const keys = Object.keys(data);

  if (keys.some((key) => isCareerOsStorageKey(key))) {
    return true;
  }

  return CAREER_OS_MODULE_KEYS.some((key) => key in data);
}

export function validateCareerOsBackup(raw: unknown): BackupValidationResult {
  if (!isPlainObject(raw)) {
    return {
      valid: false,
      error: "This backup file doesn't look like a CareerOS export.",
    };
  }

  if (raw.app !== BACKUP_APP_NAME) {
    return {
      valid: false,
      error: "This backup file doesn't look like a CareerOS export.",
    };
  }

  if (raw.version !== BACKUP_VERSION) {
    return {
      valid: false,
      error: "This backup file uses an unsupported CareerOS version.",
    };
  }

  if (typeof raw.exportedAt !== "string" || !raw.exportedAt.trim()) {
    return {
      valid: false,
      error: "This backup file is missing required data.",
    };
  }

  if (!isPlainObject(raw.data)) {
    return {
      valid: false,
      error: "This backup file is missing required data.",
    };
  }

  if (!hasRecognizedModuleKey(raw.data)) {
    return {
      valid: false,
      error: "This backup file is missing required CareerOS module data.",
    };
  }

  return {
    valid: true,
    backup: {
      version: BACKUP_VERSION,
      app: BACKUP_APP_NAME,
      exportedAt: raw.exportedAt,
      data: raw.data,
    },
  };
}

export function parseCareerOsBackupFile(content: string): BackupValidationResult {
  try {
    const parsed: unknown = JSON.parse(content);
    return validateCareerOsBackup(parsed);
  } catch {
    return {
      valid: false,
      error: "This file isn't valid JSON.",
    };
  }
}

export function importCareerOsBackup(backup: CareerOsBackupFile): void {
  getCareerOsStorageKeys().forEach((key) => {
    window.localStorage.removeItem(key);
  });

  Object.entries(backup.data).forEach(([key, value]) => {
    if (!isCareerOsStorageKey(key)) {
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
  });

  window.dispatchEvent(new CustomEvent("career-os-storage-change"));
}
