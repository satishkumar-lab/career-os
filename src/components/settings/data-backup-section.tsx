"use client";

import { useState } from "react";

import { SettingsSectionCard } from "@/components/settings/settings-section-card";
import { SettingsToggleRow } from "@/components/settings/settings-toggle-row";
import { Button } from "@/components/ui/button";

export function DataBackupSection() {
  const [autoBackup, setAutoBackup] = useState(false);

  return (
    <SettingsSectionCard
      title="Data & Backup"
      description="Export your CareerOS data or configure automatic backups."
    >
      <div className="flex flex-col gap-3 py-5 sm:flex-row">
        <Button variant="outline" className="rounded-2xl">
          Export data
        </Button>
        <Button variant="outline" className="rounded-2xl" disabled>
          Import data
        </Button>
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
  );
}
