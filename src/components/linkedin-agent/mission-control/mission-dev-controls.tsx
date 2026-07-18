"use client";

import { FlaskConical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cardShell, contentCardRadius } from "@/lib/interaction-styles";
import { cn } from "@/lib/utils";

export interface MissionDevControlsProps {
  forceEmpty: boolean;
  forceLoading: boolean;
  onForceEmptyChange: (value: boolean) => void;
  onForceLoadingChange: (value: boolean) => void;
  onReset: () => void;
}

export function MissionDevControls({
  forceEmpty,
  forceLoading,
  onForceEmptyChange,
  onForceLoadingChange,
  onReset,
}: MissionDevControlsProps) {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div
      className={cn(
        cardShell,
        contentCardRadius,
        "border-dashed border-primary/30 bg-primary/[0.02] p-4"
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <FlaskConical className="size-4 text-primary" />
        <span className="text-[12px] font-semibold">Prototype controls</span>
        <span className="text-[10px] text-muted-foreground">dev only</span>
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Switch id="empty-data" checked={forceEmpty} onCheckedChange={onForceEmptyChange} />
          <Label htmlFor="empty-data" className="text-[12px]">
            Empty CareerOS data
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="loading" checked={forceLoading} onCheckedChange={onForceLoadingChange} />
          <Label htmlFor="loading" className="text-[12px]">
            Brief loading state
          </Label>
        </div>
        <Button type="button" variant="outline" size="sm" className="rounded-xl text-[12px]" onClick={onReset}>
          Reset session
        </Button>
      </div>
    </div>
  );
}
