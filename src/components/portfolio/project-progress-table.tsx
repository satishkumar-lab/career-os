"use client";

import {
  Archive,
  ArchiveRestore,
  Check,
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
import { cardShell, listRowHover } from "@/lib/interaction-styles";
import { SearchEmptyState } from "@/components/shared/search-empty-state";
import { PORTFOLIO_STAGES, type PortfolioProject } from "@/components/portfolio/types";

function StageIndicator({ complete }: { complete: boolean }) {
  if (complete) {
    return (
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#17a5fb] shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]">
        <Check className="size-3 text-white" strokeWidth={2.5} />
      </div>
    );
  }

  return <div className="size-7 shrink-0 rounded-full border-[1.667px] border-border" />;
}

interface ProgressRowProps {
  project: PortfolioProject;
  isLast: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onToggleFavourite: (id: string) => void;
}

function ProgressRow({
  project,
  isLast,
  onEdit,
  onDelete,
  onArchive,
  onRestore,
  onToggleFavourite,
}: ProgressRowProps) {
  return (
    <div
      className={cn(
        "flex min-w-[720px] items-center gap-4 px-6 py-4",
        listRowHover,
        !isLast && "border-b border-border"
      )}
    >
      <p className="w-[200px] shrink-0 truncate text-[13.5px] font-medium text-foreground">
        {project.name}
      </p>
      {PORTFOLIO_STAGES.map((stage) => (
        <div key={stage.key} className="flex min-w-0 flex-1 items-center justify-center">
          <StageIndicator complete={project.stages[stage.key]} />
        </div>
      ))}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-7 shrink-0 text-muted-foreground"
              aria-label={`Actions for ${project.name}`}
            />
          }
        >
          <MoreHorizontal className="size-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(project.id)}>
            <Pencil className="size-3.5" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onToggleFavourite(project.id)}>
            <Star className="size-3.5" />
            {project.favourite ? "Unfavourite" : "Favourite"}
          </DropdownMenuItem>
          {project.archived ? (
            <DropdownMenuItem onClick={() => onRestore(project.id)}>
              <ArchiveRestore className="size-3.5" />
              Restore
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => onArchive(project.id)}>
              <Archive className="size-3.5" />
              Archive
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => onDelete(project.id)}>
            <Trash2 className="size-3.5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export interface ProjectProgressTableProps {
  projects: PortfolioProject[];
  isSearchEmpty?: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onToggleFavourite: (id: string) => void;
}

export function ProjectProgressTable({
  projects,
  isSearchEmpty = false,
  onEdit,
  onDelete,
  onArchive,
  onRestore,
  onToggleFavourite,
}: ProjectProgressTableProps) {
  if (isSearchEmpty && projects.length === 0) {
    return (
      <div className={cn("overflow-x-auto", cardShell)}>
        <SearchEmptyState />
      </div>
    );
  }

  return (
    <div className={cn("overflow-x-auto", cardShell)}>
      <div className="flex min-w-[720px] items-center gap-4 border-b border-border px-6 py-3.5">
        <div className="w-[200px] shrink-0" />
        {PORTFOLIO_STAGES.map((stage) => (
          <p
            key={stage.key}
            className="min-w-0 flex-1 text-center text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase"
          >
            {stage.label}
          </p>
        ))}
        <div className="size-7 shrink-0" />
      </div>
      {projects.map((project, index) => (
        <ProgressRow
          key={project.id}
          project={project}
          isLast={index === projects.length - 1}
          onEdit={onEdit}
          onDelete={onDelete}
          onArchive={onArchive}
          onRestore={onRestore}
          onToggleFavourite={onToggleFavourite}
        />
      ))}
    </div>
  );
}
