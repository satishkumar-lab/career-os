"use client";

import { useState } from "react";

import { SettingsSectionCard } from "@/components/settings/settings-section-card";
import { SettingsToggleRow } from "@/components/settings/settings-toggle-row";
import type { ToggleSetting } from "@/components/settings/types";
import { Button } from "@/components/ui/button";

export function DashboardPreferencesSection({ settings }: { settings: ToggleSetting[] }) {
  const [items, setItems] = useState(settings);

  function updateSetting(id: string, enabled: boolean) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, enabled } : item))
    );
  }

  return (
    <SettingsSectionCard
      title="Dashboard Preferences"
      description="Control which modules appear on your dashboard."
    >
      {items.map((item, index) => (
        <SettingsToggleRow
          key={item.id}
          label={item.label}
          description={item.description}
          checked={item.enabled}
          disabled={item.disabled}
          onCheckedChange={(checked) => updateSetting(item.id, checked)}
          isLast={index === items.length - 1}
        />
      ))}

      <div className="flex justify-end border-t border-border py-4">
        <Button className="rounded-2xl px-4 shadow-sm">Save layout</Button>
      </div>
    </SettingsSectionCard>
  );
}
