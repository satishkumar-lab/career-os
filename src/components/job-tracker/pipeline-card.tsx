"use client";

import { Fragment } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { cardInteractive, transitionFast } from "@/lib/interaction-styles";
import { pipelineStageStatuses } from "@/lib/job-tracker/constants";
import type { JobPipelineStage, PipelineStageStatus } from "@/components/job-tracker/types";

const statusStyles: Record<
  PipelineStageStatus,
  { bg: string; text: string; shadow?: boolean }
> = {
  Pending: { bg: "#edede9", text: "#787870" },
  Passed: { bg: "#d9ffca", text: "#38a311" },
  Failed: { bg: "#ff4245", text: "#ffffff", shadow: true },
  Current: { bg: "#ceecff", text: "#17a5fb" },
};

function StagePill({
  stage,
  isFirst,
  isLast,
  onRename,
  onDelete,
  onMoveUp,
  onMoveDown,
  onChangeStatus,
}: {
  stage: JobPipelineStage;
  isFirst: boolean;
  isLast: boolean;
  onRename: (stageId: string) => void;
  onDelete: (stageId: string) => void;
  onMoveUp: (stageId: string) => void;
  onMoveDown: (stageId: string) => void;
  onChangeStatus: (stageId: string, status: PipelineStageStatus) => void;
}) {
  const style = statusStyles[stage.status];

  return (
    <div className="flex shrink-0 items-center gap-1">
      <div
        className={cn(
          "flex items-center gap-1.5 rounded-2xl px-3 py-2.5",
          transitionFast,
          "hover:brightness-[0.98]",
          style.shadow &&
            "shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]"
        )}
        style={{ backgroundColor: style.bg }}
      >
        {stage.status === "Passed" && <Check className="size-3 shrink-0" style={{ color: style.text }} />}
        {stage.status === "Failed" && <X className="size-3 shrink-0" style={{ color: style.text }} />}
        <p
          className="text-center text-[11px] font-medium whitespace-nowrap"
          style={{ color: style.text }}
        >
          {stage.name}
        </p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-6 shrink-0 text-muted-foreground"
              aria-label={`Actions for ${stage.name}`}
            />
          }
        >
          <MoreHorizontal className="size-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {pipelineStageStatuses.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => onChangeStatus(stage.id, status)}
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem onClick={() => onRename(stage.id)}>
            <Pencil className="size-3.5" />
            Rename
          </DropdownMenuItem>
          {!isFirst && (
            <DropdownMenuItem onClick={() => onMoveUp(stage.id)}>
              <ArrowUp className="size-3.5" />
              Move Up
            </DropdownMenuItem>
          )}
          {!isLast && (
            <DropdownMenuItem onClick={() => onMoveDown(stage.id)}>
              <ArrowDown className="size-3.5" />
              Move Down
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => onDelete(stage.id)}>
            <Trash2 className="size-3.5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export interface PipelineCardProps {
  companyName: string;
  stages: JobPipelineStage[];
  progress: number;
  onAddStage: () => void;
  onRenameStage: (stageId: string) => void;
  onDeleteStage: (stageId: string) => void;
  onMoveStageUp: (stageId: string) => void;
  onMoveStageDown: (stageId: string) => void;
  onChangeStageStatus: (stageId: string, status: PipelineStageStatus) => void;
}

export function PipelineCard({
  companyName,
  stages,
  progress,
  onAddStage,
  onRenameStage,
  onDeleteStage,
  onMoveStageUp,
  onMoveStageDown,
  onChangeStageStatus,
}: PipelineCardProps) {
  return (
    <div className={cn(cardInteractive, "p-5")}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[14.5px] font-medium text-foreground">Pipeline</p>
          <p className="mt-0.5 text-[12px] font-medium text-muted-foreground">{companyName}</p>
        </div>
        <p className="text-[13px] font-medium text-[#17a5fb]">{progress}%</p>
      </div>

      <div className="-mx-5 mt-4 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <div className="flex w-max items-center gap-1.5 pb-0.5">
          {stages.map((stage, index) => (
            <Fragment key={stage.id}>
              <StagePill
                stage={stage}
                isFirst={index === 0}
                isLast={index === stages.length - 1}
                onRename={onRenameStage}
                onDelete={onDeleteStage}
                onMoveUp={onMoveStageUp}
                onMoveDown={onMoveStageDown}
                onChangeStatus={onChangeStageStatus}
              />
              {index < stages.length - 1 && (
                <ChevronRight className="size-2.75 shrink-0 text-muted-foreground" />
              )}
            </Fragment>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="ml-1 h-8 shrink-0 rounded-2xl px-3 text-[11px] font-medium"
            onClick={onAddStage}
          >
            <Plus className="size-3" />
            Add Stage
          </Button>
        </div>
      </div>
    </div>
  );
}
