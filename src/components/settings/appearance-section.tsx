"use client";

import { useEffect, useState } from "react";

import { SettingsSectionCard } from "@/components/settings/settings-section-card";
import { SettingsToggleRow } from "@/components/settings/settings-toggle-row";
import type { AppearanceSettings } from "@/components/settings/types";

const STORAGE_KEY = "careeros-theme";

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

export function AppearanceSection({ settings }: { settings: AppearanceSettings }) {
  const [darkMode, setDarkMode] = useState(settings.darkMode);
  const [compactSidebar, setCompactSidebar] = useState(settings.compactSidebar);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const dark =
      stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(dark);
    applyTheme(dark);
  }, []);

  function handleDarkModeChange(checked: boolean) {
    setDarkMode(checked);
    applyTheme(checked);
    window.localStorage.setItem(STORAGE_KEY, checked ? "dark" : "light");
  }

  return (
    <SettingsSectionCard title="Appearance" description="Customize how CareerOS looks and feels.">
      <SettingsToggleRow
        label="Dark mode"
        description="Switch between light and dark themes."
        checked={darkMode}
        onCheckedChange={handleDarkModeChange}
      />
      <SettingsToggleRow
        label="Compact sidebar"
        description="Reduce sidebar width for more content space."
        checked={compactSidebar}
        disabled
        onCheckedChange={setCompactSidebar}
        isLast
      />
    </SettingsSectionCard>
  );
}
