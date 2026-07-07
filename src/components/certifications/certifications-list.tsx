"use client";

import { Award, CheckCircle2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { AnimatedProgressFill } from "@/components/ui/animated-progress-fill";
import { Badge } from "@/components/ui/badge";
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
import type { Certification, CertificationStatus } from "@/components/certifications/types";

const statusStyles: Record<CertificationStatus, { bg: string; text: string }> = {
  "In Progress": { bg: "#eef0ff", text: "#5b5bd6" },
  Completed: { bg: "#f0fdf4", text: "#10b981" },
  Planned: { bg: "#f8f8f8", text: "#94a3b8" },
};

interface CertificationRowProps {
  cert: Certification;
  isLast: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function CertificationRow({ cert, isLast, onEdit, onDelete }: CertificationRowProps) {
  const status = statusStyles[cert.status];

  return (
    <div
      className={cn(
        "flex flex-wrap items-start gap-3 px-4 py-4 sm:flex-nowrap sm:items-center sm:gap-4 sm:px-6",
        listRowHover,
        !isLast && "border-b border-border"
      )}
    >
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-2xl"
        style={{ backgroundColor: cert.tint }}
      >
        <Award className="size-4" style={{ color: cert.color }} />
      </span>

      <div className="min-w-0 flex-1 basis-full sm:basis-auto">
        <div className="flex flex-wrap items-center gap-2.5">
          <p className="text-sm font-medium text-foreground">{cert.name}</p>
          <Badge
            className="rounded-full border-transparent px-2.5 py-0.5 text-[10.5px] font-medium"
            style={{ backgroundColor: status.bg, color: status.text }}
          >
            {cert.status}
          </Badge>
        </div>
        <p className="mt-1 text-xs font-medium text-muted-foreground">{cert.issuer}</p>
        {cert.status !== "Planned" && (
          <div
            className="relative mt-2 flex h-[5px] w-full overflow-hidden rounded-full"
            style={{ backgroundColor: cert.trackTint }}
          >
            <AnimatedProgressFill
              value={cert.percent ?? 100}
              style={{ backgroundColor: cert.color }}
            />
          </div>
        )}
      </div>

      <div className="ml-[52px] flex shrink-0 items-center gap-1 sm:ml-0">
        <div className="text-right">
          {cert.status === "In Progress" && (
            <>
              <p className="font-mono text-[13px] font-medium text-foreground">{cert.percent}%</p>
              <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">{cert.dateLabel}</p>
            </>
          )}
          {cert.status === "Completed" && (
            <>
              <CheckCircle2 className="ml-auto size-[18px] text-[#10b981]" />
              <p className="mt-1 text-[11px] font-medium text-muted-foreground">{cert.dateLabel}</p>
            </>
          )}
          {cert.status === "Planned" && (
            <p className="text-xs font-medium text-muted-foreground">{cert.dateLabel}</p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="size-7 shrink-0 text-muted-foreground"
                aria-label={`Actions for ${cert.name}`}
              />
            }
          >
            <MoreHorizontal className="size-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(cert.id)}>
              <Pencil className="size-3.5" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => onDelete(cert.id)}>
              <Trash2 className="size-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export interface CertificationsListProps {
  certifications: Certification[];
  isSearchEmpty?: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CertificationsList({
  certifications,
  isSearchEmpty = false,
  onEdit,
  onDelete,
}: CertificationsListProps) {
  return (
    <div className={cardShell}>
      {isSearchEmpty && certifications.length === 0 ? (
        <SearchEmptyState />
      ) : (
        certifications.map((cert, index) => (
          <CertificationRow
            key={cert.id}
            cert={cert}
            isLast={index === certifications.length - 1}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}
