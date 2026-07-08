"use client";

import { Check, ListChecks, Plus, Sparkles } from "lucide-react";

import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { cn } from "@/lib/utils";
import { iconButton, interactiveSurface } from "@/lib/interaction-styles";
import type { AiRecommendation, TaskItem } from "@/components/dashboard/types";
import { Button } from "@/components/ui/button";

export interface TodayTasksCardProps {
  tasks: TaskItem[];
  suggestions: AiRecommendation[];
  onAddTask: () => void;
  onToggleTask: (id: string) => void;
  onAddSuggestion: (id: string) => void;
  onIgnoreSuggestion: (id: string) => void;
  className?: string;
}

export function TodayTasksCard({
  tasks,
  suggestions,
  onAddTask,
  onToggleTask,
  onAddSuggestion,
  onIgnoreSuggestion,
  className,
}: TodayTasksCardProps) {
  return (
    <DashboardCard
      title="Today's Tasks"
      className={className}
      action={
        <button
          type="button"
          onClick={onAddTask}
          aria-label="Add task"
          className={cn(
            "flex size-7 items-center justify-center rounded-xl bg-primary/10",
            iconButton
          )}
        >
          <Plus className="size-3.5 text-primary" />
        </button>
      }
    >
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-muted">
            <ListChecks className="size-4 text-muted-foreground" />
          </span>
          <p className="mt-3 text-[13px] font-medium text-foreground">No tasks yet</p>
          <p className="mt-1 max-w-[220px] text-xs text-muted-foreground">
            Add a task to plan your focus for today.
          </p>
          <Button className="mt-4 rounded-2xl" size="sm" onClick={onAddTask}>
            Add Task
          </Button>
        </div>
      ) : (
        <ul className="-m-2.5">
          {tasks.map((task) => (
            <li key={task.id}>
              <button
                type="button"
                onClick={() => onToggleTask(task.id)}
                className={cn("flex w-full items-start gap-3 rounded-2xl p-2.5 text-left", interactiveSurface)}
              >
                <span
                  className={cn(
                    "mt-px flex size-[18px] shrink-0 items-center justify-center rounded-full border",
                    task.done ? "border-primary bg-primary" : "border-foreground/20"
                  )}
                >
                  {task.done && <Check className="size-2.5 text-primary-foreground" strokeWidth={3} />}
                </span>
                <span
                  className={cn(
                    "text-[13px] font-medium",
                    task.done
                      ? "text-muted-foreground line-through decoration-from-font"
                      : "text-foreground"
                  )}
                >
                  {task.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {suggestions.length > 0 && (
        <div className={cn(tasks.length > 0 && "mt-4 border-t border-border pt-4")}>
          <div className="mb-2.5 flex items-center gap-2">
            <Sparkles className="size-3 text-primary" />
            <p className="text-[11px] font-medium tracking-[0.08em] text-primary uppercase">
              Suggestions
            </p>
          </div>
          <ul className="space-y-2">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                className="rounded-2xl border border-border bg-muted/30 p-3"
              >
                <p className="text-[12.5px] font-medium text-foreground">{suggestion.label}</p>
                <div className="mt-2.5 flex gap-2">
                  <Button
                    size="sm"
                    className="h-7 rounded-xl px-2.5 text-xs"
                    onClick={() => onAddSuggestion(suggestion.id)}
                  >
                    Add to Today&apos;s Tasks
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 rounded-xl px-2.5 text-xs text-muted-foreground"
                    onClick={() => onIgnoreSuggestion(suggestion.id)}
                  >
                    Ignore
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </DashboardCard>
  );
}
