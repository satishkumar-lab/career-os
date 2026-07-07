"use client";

"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export interface JobTrackerHeaderProps {
  onAddApplication: () => void;
}

export function JobTrackerHeader({ onAddApplication }: JobTrackerHeaderProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[24px]">Job Tracker</h1>
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          Track every application, interview, and outcome.
        </p>
      </div>
      <Button className="rounded-2xl px-4 py-2 shadow-sm" onClick={onAddApplication}>
        <Plus className="size-3.5" />
        Add Application
      </Button>
    </div>
  );
}
