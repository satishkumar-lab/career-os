"use client";

import { useState } from "react";

import { SettingsSectionCard } from "@/components/settings/settings-section-card";
import { SettingsToggleRow } from "@/components/settings/settings-toggle-row";
import type { ToggleSetting } from "@/components/settings/types";

export function NotificationsSection({ settings }: { settings: ToggleSetting[] }) {
  const [items, setItems] = useState(settings);

  function updateSetting(id: string, enabled: boolean) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, enabled } : item))
    );
  }

  return (
    <SettingsSectionCard
      title="Notifications"
      description="Choose what updates you want to receive."
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
    </SettingsSectionCard>
  );
}
