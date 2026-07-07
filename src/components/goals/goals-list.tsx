"use client";

import {
  Archive,
  ArchiveRestore,
  Calendar,
  Flag,
  MoreHorizontal,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";

import { AnimatedProgressFill } from "@/components/ui/animated-progress-fill";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { cardShell, listRowHover } from "@/lib/interaction-styles";
import { SearchEmptyState } from "@/components/shared/search-empty-state";
import type { Goal, GoalDisplayCategory, GoalPriority, GoalStatus } from "@/components/goals/types";

const categoryStyles: Record<GoalDisplayCategory, { bg: string; text: string }> = {
  Career: { bg: "rgba(91,91,214,0.08)", text: "#5b5bd6" },
  Learning: { bg: "rgba(16,185,129,0.08)", text: "#10b981" },
  Branding: { bg: "rgba(245,158,11,0.08)", text: "#f59e0b" },
  Portfolio: { bg: "rgba(139,92,246,0.08)", text: "#8b5cf6" },
  Project: { bg: "rgba(236,72,153,0.08)", text: "#ec4899" },
  Certification: { bg: "rgba(14,165,233,0.08)", text: "#0ea5e9" },
  Interview: { bg: "rgba(249,115,22,0.08)", text: "#f97316" },
  Personal: { bg: "rgba(100,116,139,0.08)", text: "#64748b" },
};

const priorityStyles: Record<GoalPriority, { bg: string; text: string }> = {
  High: { bg: "#fff1f2", text: "#ef4444" },
  Medium: { bg: "#fffbeb", text: "#f59e0b" },
  Low: { bg: "#f8fafc", text: "#64748b" },
};

const statusStyles: Record<GoalStatus, { bg: string; text: string }> = {
  "On Track": { bg: "rgba(16,185,129,0.08)", text: "#10b981" },
  Behind: { bg: "rgba(245,158,11,0.08)", text: "#f59e0b" },
};

function GoalBadge({
  label,
  styles,
}: {
  label: string;
  styles: { bg: string; text: string };
}) {
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[10.5px] font-medium"
      style={{ backgroundColor: styles.bg, color: styles.text }}
    >
      {label}
    </span>
  );
}

interface GoalRowProps {
  goal: Goal;
  isLast: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onToggleFavourite: (id: string) => void;
}

function GoalRow({
  goal,
  isLast,
  onEdit,
  onDelete,
  onArchive,
  onRestore,
  onToggleFavourite,
}: GoalRowProps) {
  const category = categoryStyles[goal.category];
  const priority = priorityStyles[goal.priority];
  const status = statusStyles[goal.status];

  return (
    <div
      className={cn(
        "flex flex-wrap items-start gap-4 px-6 py-5 sm:flex-nowrap sm:items-center",
        listRowHover,
        !isLast && "border-b border-border"
      )}
    >
      <span
        className="h-10 w-1 shrink-0 rounded-full"
        style={{ backgroundColor: goal.color }}
      />

      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-2xl"
        style={{ backgroundColor: goal.iconTint }}
      >
        <Flag className="size-4" style={{ color: goal.color }} />
      </span>

      <div className="min-w-0 flex-1 basis-full sm:basis-auto">
        <div className="flex flex-wrap items-center gap-2.5">
          <p className="text-sm font-medium text-foreground">{goal.title}</p>
          <GoalBadge label={goal.category} styles={category} />
          <GoalBadge label={goal.priority} styles={priority} />
          <GoalBadge label={goal.status} styles={status} />
        </div>

        <div className="mt-2 flex items-center gap-3">
          <Calendar className="size-2.5 text-muted-foreground" />
          <p className="text-xs font-medium text-muted-foreground">{goal.dueLabel}</p>
        </div>

        <div
          className="mt-2 h-[5px] w-full overflow-hidden rounded-full"
          style={{ backgroundColor: goal.trackTint }}
        >
          <AnimatedProgressFill
            value={goal.percent}
            style={{ backgroundColor: goal.color }}
          />
        </div>
      </div>

      <p
        className="shrink-0 font-mono text-lg font-medium"
        style={{ color: goal.color }}
      >
        {goal.percent}%
      </p>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-7 shrink-0 text-muted-foreground"
              aria-label={`Actions for ${goal.title}`}
            />
          }
        >
          <MoreHorizontal className="size-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(goal.id)}>
            <Pencil className="size-3.5" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onToggleFavourite(goal.id)}>
            <Star className="size-3.5" />
            {goal.favourite ? "Unfavourite" : "Favourite"}
          </DropdownMenuItem>
          {goal.archived ? (
            <DropdownMenuItem onClick={() => onRestore(goal.id)}>
              <ArchiveRestore className="size-3.5" />
              Restore
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => onArchive(goal.id)}>
              <Archive className="size-3.5" />
              Archive
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => onDelete(goal.id)}>
            <Trash2 className="size-3.5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export interface GoalsListProps {
  goals: Goal[];
  isSearchEmpty?: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onToggleFavourite: (id: string) => void;
}

export function GoalsList({
  goals,
  isSearchEmpty = false,
  onEdit,
  onDelete,
  onArchive,
  onRestore,
  onToggleFavourite,
}: GoalsListProps) {
  return (
    <div className={cardShell}>
      {isSearchEmpty && goals.length === 0 ? (
        <SearchEmptyState />
      ) : (
        goals.map((goal, index) => (
          <GoalRow
            key={goal.id}
            goal={goal}
            isLast={index === goals.length - 1}
            onEdit={onEdit}
            onDelete={onDelete}
            onArchive={onArchive}
            onRestore={onRestore}
            onToggleFavourite={onToggleFavourite}
          />
        ))
      )}
    </div>
  );
}
