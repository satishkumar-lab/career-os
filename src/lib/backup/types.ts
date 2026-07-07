export interface CareerOsBackupFile {
  version: 1;
  app: "CareerOS";
  exportedAt: string;
  data: Record<string, unknown>;
}

export type BackupValidationResult =
  | { valid: true; backup: CareerOsBackupFile }
  | { valid: false; error: string };
