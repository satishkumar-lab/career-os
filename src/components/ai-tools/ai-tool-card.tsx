"use client";

import { MoreHorizontal, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatedProgressFill } from "@/components/ui/animated-progress-fill";
import { cn } from "@/lib/utils";
import { cardInteractive, textAction } from "@/lib/interaction-styles";
import type { AiTool, AiToolLevel } from "@/components/ai-tools/types";

const levelStyles: Record<AiToolLevel, { bg: string; text: string }> = {
  Beginner: { bg: "#f1f5f9", text: "#94a3b8" },
  Intermediate: { bg: "#fffbeb", text: "#f59e0b" },
  Advanced: { bg: "#eef0ff", text: "#5b5bd6" },
  Expert: { bg: "#f0fdf4", text: "#10b981" },
};

export interface AiToolCardProps {
  tool: AiTool;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function AiToolCard({ tool, onEdit, onDelete }: AiToolCardProps) {
  const level = levelStyles[tool.level];
  const Icon = tool.icon;

  return (
    <div className={cn(cardInteractive, "p-5")}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: tool.tint }}
          >
            <Icon className="size-4.5" style={{ color: tool.color }} />
          </span>
          <div>
            <p className="text-[15px] font-medium text-foreground">{tool.name}</p>
            <p className="text-[11.5px] font-medium text-muted-foreground">Last used: {tool.lastUsedLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Badge
            className="rounded-full border-transparent px-2.5 py-1 text-[11px] font-medium"
            style={{ backgroundColor: level.bg, color: level.text }}
          >
            {tool.level}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="size-7 shrink-0 text-muted-foreground"
                  aria-label={`Actions for ${tool.name}`}
                />
              }
            >
              <MoreHorizontal className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem variant="destructive" onClick={() => onDelete(tool.id)}>
                <Trash2 className="size-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">Mastery Progress</p>
          <p className="font-mono text-xs font-medium" style={{ color: tool.color }}>
            {tool.percent}%
          </p>
        </div>
        <div
          className="relative mt-2 flex h-1.5 w-full overflow-hidden rounded-full"
          style={{ backgroundColor: tool.trackTint }}
        >
          <AnimatedProgressFill value={tool.percent} style={{ backgroundColor: tool.color }} />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">{tool.projectsBuilt} projects built</p>
        <button type="button" className={cn("text-base font-medium text-primary", textAction)} onClick={() => onEdit(tool.id)}>
          Edit
        </button>
      </div>

      <div className="mt-3 rounded-2xl bg-[rgba(237,237,233,0.6)] px-3 py-2.5">
        <p className="text-xs font-medium text-muted-foreground">{tool.note}</p>
      </div>
    </div>
  );
}
