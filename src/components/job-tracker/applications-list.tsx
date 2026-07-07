"use client";

import {
  Archive,
  ArchiveRestore,
  MoreHorizontal,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { cardShell, transitionFast } from "@/lib/interaction-styles";
import { SearchEmptyState } from "@/components/shared/search-empty-state";
import { stageColors, getStageDisplayLabel } from "@/lib/job-tracker/constants";
import type { CurrentStage, JobApplication } from "@/components/job-tracker/types";

interface ApplicationRowProps {
  application: JobApplication;
  isLast: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onToggleFavourite: (id: string) => void;
}

function ApplicationRow({
  application,
  isLast,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onArchive,
  onRestore,
  onToggleFavourite,
}: ApplicationRowProps) {
  const status = stageColors[application.status as CurrentStage];
  const Icon = application.icon;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(application.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(application.id);
        }
      }}
      className={cn(
        "flex flex-wrap items-center gap-4 px-6 py-4 sm:flex-nowrap",
        transitionFast,
        "cursor-pointer hover:bg-accent/50",
        isSelected && "bg-accent/40",
        !isLast && "border-b border-border"
      )}
    >
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-2xl"
        style={{ backgroundColor: application.tint }}
      >
        <Icon className="size-4" style={{ color: application.color }} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-foreground">{application.company}</p>
          <span className="text-base text-muted-foreground/40">·</span>
          <p className="text-[13px] font-medium text-muted-foreground">{application.role}</p>
        </div>
        <p className="mt-0.5 text-[11.5px] font-medium text-muted-foreground">
          {application.appliedLabel}
        </p>
      </div>

      <span
        className="shrink-0 rounded-full px-3 py-1 text-[11px] font-medium"
        style={{ backgroundColor: status.bg, color: status.text }}
      >
        {getStageDisplayLabel(application.status)}
      </span>

      <div onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
        <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-7 shrink-0 text-muted-foreground"
              aria-label={`Actions for ${application.company}`}
              onClick={(event) => event.stopPropagation()}
            />
          }
        >
          <MoreHorizontal className="size-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(application.id)}>
            <Pencil className="size-3.5" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onToggleFavourite(application.id)}>
            <Star className="size-3.5" />
            {application.favourite ? "Unfavourite" : "Favourite"}
          </DropdownMenuItem>
          {application.archived ? (
            <DropdownMenuItem onClick={() => onRestore(application.id)}>
              <ArchiveRestore className="size-3.5" />
              Restore
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => onArchive(application.id)}>
              <Archive className="size-3.5" />
              Archive
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => onDelete(application.id)}>
            <Trash2 className="size-3.5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export interface ApplicationsListProps {
  applications: JobApplication[];
  isSearchEmpty?: boolean;
  selectedApplicationId?: string;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onToggleFavourite: (id: string) => void;
}

export function ApplicationsList({
  applications,
  isSearchEmpty = false,
  selectedApplicationId,
  onSelect,
  onEdit,
  onDelete,
  onArchive,
  onRestore,
  onToggleFavourite,
}: ApplicationsListProps) {
  return (
    <div className={cardShell}>
      {isSearchEmpty && applications.length === 0 ? (
        <SearchEmptyState />
      ) : (
        applications.map((application, index) => (
          <ApplicationRow
            key={application.id}
            application={application}
            isLast={index === applications.length - 1}
            isSelected={application.id === selectedApplicationId}
            onSelect={onSelect}
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
