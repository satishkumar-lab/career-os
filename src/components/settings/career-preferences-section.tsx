"use client";

import { useState } from "react";

import { SettingsSectionCard } from "@/components/settings/settings-section-card";
import { SettingsToggleRow } from "@/components/settings/settings-toggle-row";
import type { CareerPreferences } from "@/components/settings/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  careerIndustryOptions,
  careerRoleOptions,
  careerWorkModeOptions,
} from "@/lib/mock/settings";

export function CareerPreferencesSection({ preferences }: { preferences: CareerPreferences }) {
  const [targetRole, setTargetRole] = useState(preferences.targetRole);
  const [targetIndustry, setTargetIndustry] = useState(preferences.targetIndustry);
  const [workMode, setWorkMode] = useState(preferences.workMode);
  const [openToRoles, setOpenToRoles] = useState(preferences.openToRoles);

  return (
    <SettingsSectionCard
      title="Career Preferences"
      description="Tell CareerOS what roles and opportunities you are targeting."
    >
      <div className="grid gap-4 py-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Target role</Label>
          <Select value={targetRole} onValueChange={(value) => value && setTargetRole(value)}>
            <SelectTrigger className="h-9 w-full rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {careerRoleOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Target industry</Label>
          <Select value={targetIndustry} onValueChange={(value) => value && setTargetIndustry(value)}>
            <SelectTrigger className="h-9 w-full rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {careerIndustryOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Work mode</Label>
          <Select value={workMode} onValueChange={(value) => value && setWorkMode(value)}>
            <SelectTrigger className="h-9 w-full rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {careerWorkModeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <SettingsToggleRow
        label="Open to roles"
        description="Show your availability status in the sidebar and top nav."
        checked={openToRoles}
        onCheckedChange={setOpenToRoles}
      />

      <div className="flex justify-end border-t border-border py-4">
        <Button className="rounded-2xl px-4 shadow-sm">Save preferences</Button>
      </div>
    </SettingsSectionCard>
  );
}
