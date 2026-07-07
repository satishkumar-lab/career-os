"use client";

import { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";

import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { cn } from "@/lib/utils";
import { iconButton, interactiveSurface } from "@/lib/interaction-styles";
import type { TaskItem } from "@/components/dashboard/types";

export interface TodayTasksCardProps {
  initialTasks: TaskItem[];
  className?: string;
}

export function TodayTasksCard({ initialTasks, className }: TodayTasksCardProps) {
  const [tasks, setTasks] = useState(initialTasks);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  function toggleTask(id: string) {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  }

  return (
    <DashboardCard
      title="Today's Tasks"
      className={className}
      action={
        <span className={cn("flex size-7 items-center justify-center rounded-xl bg-primary/10", iconButton)}>
          <Plus className="size-3.5 text-primary" />
        </span>
      }
    >
      <ul className="-m-2.5">
        {tasks.map((task) => (
          <li key={task.id}>
            <button
              type="button"
              onClick={() => toggleTask(task.id)}
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
                  task.done ? "text-muted-foreground line-through decoration-from-font" : "text-foreground"
                )}
              >
                {task.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
