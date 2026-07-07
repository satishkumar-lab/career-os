import {
  BACKUP_APP_NAME,
  BACKUP_VERSION,
} from "@/lib/backup/constants";
import { collectCareerOsStorageData } from "@/lib/backup/storage-keys";
import type { CareerOsBackupFile } from "@/lib/backup/types";

export function createCareerOsBackup(): CareerOsBackupFile {
  return {
    version: BACKUP_VERSION,
    app: BACKUP_APP_NAME,
    exportedAt: new Date().toISOString(),
    data: collectCareerOsStorageData(),
  };
}

export function getBackupFilename(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `careeros-backup-${year}-${month}-${day}.json`;
}

export function downloadCareerOsBackup(backup: CareerOsBackupFile): void {
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = getBackupFilename(new Date(backup.exportedAt));
  link.click();

  URL.revokeObjectURL(url);
}
