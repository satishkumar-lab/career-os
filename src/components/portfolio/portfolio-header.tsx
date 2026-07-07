"use client";

import { ExternalLink, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export interface PortfolioHeaderProps {
  onAddProject: () => void;
}

export function PortfolioHeader({ onAddProject }: PortfolioHeaderProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[24px]">Portfolio</h1>
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          Track the progress of every case study and design project.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="h-auto gap-1.5 rounded-2xl border-border px-[14.5px] py-2 text-[13px] font-medium text-muted-foreground shadow-none"
        >
          <ExternalLink className="size-3.25" />
          alexchen.design
        </Button>
        <Button className="rounded-2xl px-4 py-2 shadow-sm" onClick={onAddProject}>
          <Plus className="size-3.5" />
          Add Project
        </Button>
      </div>
    </div>
  );
}
