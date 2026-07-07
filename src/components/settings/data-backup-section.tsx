"use client";

import { useRef, useState, type ChangeEvent } from "react";

import { SettingsSectionCard } from "@/components/settings/settings-section-card";
import { SettingsToggleRow } from "@/components/settings/settings-toggle-row";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ToastProvider, useToast } from "@/components/shared/toast-provider";
import { Button } from "@/components/ui/button";
import {
  createCareerOsBackup,
  downloadCareerOsBackup,
} from "@/lib/backup/export";
import { importCareerOsBackup, parseCareerOsBackupFile } from "@/lib/backup/import";
import type { CareerOsBackupFile } from "@/lib/backup/types";

function DataBackupSectionInner() {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [autoBackup, setAutoBackup] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [pendingBackup, setPendingBackup] = useState<CareerOsBackupFile | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);

    try {
      const backup = createCareerOsBackup();
      downloadCareerOsBackup(backup);
      showToast("Backup downloaded successfully.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setIsImporting(true);

    try {
      const content = await file.text();
      const result = parseCareerOsBackupFile(content);

      if (!result.valid) {
        showToast(result.error);
        return;
      }

      setPendingBackup(result.backup);
      setImportOpen(true);
    } finally {
      setIsImporting(false);
    }
  };

  const handleConfirmImport = () => {
    if (!pendingBackup) {
      return;
    }

    importCareerOsBackup(pendingBackup);
    setImportOpen(false);
    setPendingBackup(null);
    showToast("Data imported successfully.");
    window.location.reload();
  };

  return (
    <>
      <SettingsSectionCard
        title="Data & Backup"
        description="Export your CareerOS data or configure automatic backups."
      >
        <div className="flex flex-col gap-3 py-5 sm:flex-row">
          <Button
            variant="outline"
            className="rounded-2xl"
            onClick={handleExport}
            disabled={isExporting}
          >
            Export Data
          </Button>
          <Button
            variant="outline"
            className="rounded-2xl"
            onClick={handleImportClick}
            disabled={isImporting}
          >
            Import Data
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <SettingsToggleRow
          label="Automatic backup"
          description="Weekly cloud backup of your CareerOS data."
          checked={autoBackup}
          disabled
          onCheckedChange={setAutoBackup}
          isLast
        />
      </SettingsSectionCard>

      <ConfirmDialog
        open={importOpen}
        onOpenChange={(open) => {
          setImportOpen(open);

          if (!open) {
            setPendingBackup(null);
          }
        }}
        title="Import backup?"
        description="Importing will replace your current CareerOS data."
        confirmLabel="Import"
        onConfirm={handleConfirmImport}
      />
    </>
  );
}

export function DataBackupSection() {
  return (
    <ToastProvider>
      <DataBackupSectionInner />
    </ToastProvider>
  );
}
