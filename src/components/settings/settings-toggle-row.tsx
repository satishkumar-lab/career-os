"use client";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export interface SettingsToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  isLast?: boolean;
}

export function SettingsToggleRow({
  label,
  description,
  checked,
  disabled,
  onCheckedChange,
  isLast,
}: SettingsToggleRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 py-4",
        !isLast && "border-b border-border"
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        className="shrink-0"
      />
    </div>
  );
}
