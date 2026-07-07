"use client";

import {
  Archive,
  ArchiveRestore,
  Code2,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GithubIcon } from "@/components/projects/github-icon";
import { cn } from "@/lib/utils";
import { cardInteractive } from "@/lib/interaction-styles";
import type { Project, ProjectStatus } from "@/components/projects/types";

const statusStyles: Record<ProjectStatus, { bg: string; text: string }> = {
  Planning: { bg: "#f8f8f8", text: "#94a3b8" },
  Building: { bg: "#eef0ff", text: "#5b5bd6" },
  Live: { bg: "#f0fdf4", text: "#10b981" },
  Completed: { bg: "#eff6ff", text: "#0ea5e9" },
  Archived: { bg: "#f1f5f9", text: "#64748b" },
};

export interface ProjectCardProps {
  project: Project;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onToggleFavourite: (id: string) => void;
}

export function ProjectCard({
  project,
  onEdit,
  onDelete,
  onArchive,
  onRestore,
  onToggleFavourite,
}: ProjectCardProps) {
  const status = statusStyles[project.status];

  return (
    <div className={cn(cardInteractive, "p-5")}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: project.tint }}
          >
            <Code2 className="size-4.5" style={{ color: project.color }} />
          </span>
          <div>
            <p className="text-[15px] font-medium text-foreground">{project.name}</p>
            <p className="text-[11.5px] font-medium text-muted-foreground">{project.startedLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Badge
            className="rounded-full border-transparent px-2.5 py-1 text-[11px] font-medium"
            style={{ backgroundColor: status.bg, color: status.text }}
          >
            {project.status}
          </Badge>
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
      </div>

      <p className="mt-3 text-[13px] font-medium text-muted-foreground">{project.description}</p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
        {project.githubUrl && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto gap-1.5 rounded-xl px-3 py-1.5 text-[12.5px] font-medium text-muted-foreground"
          >
            <GithubIcon className="size-3.5" />
            GitHub
          </Button>
        )}
        {project.liveUrl && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto gap-1.5 rounded-xl px-3 py-1.5 text-[12.5px] font-medium text-muted-foreground"
          >
            <ExternalLink className="size-3" />
            Live
          </Button>
        )}
      </div>
    </div>
  );
}
