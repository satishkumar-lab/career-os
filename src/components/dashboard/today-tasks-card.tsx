"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";

import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { cn } from "@/lib/utils";
import type { TaskItem } from "@/components/dashboard/types";

export interface TodayTasksCardProps {
  initialTasks: TaskItem[];
  className?: string;
}

export function TodayTasksCard({ initialTasks, className }: TodayTasksCardProps) {
  const [tasks, setTasks] = useState(initialTasks);

  function toggleTask(id: string) {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  }

  return (
    <DashboardCard
      title="Today's Tasks"
      className={className}
      action={
        <span className="flex size-7 items-center justify-center rounded-xl bg-primary/10">
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
              className="flex w-full items-start gap-3 rounded-2xl p-2.5 text-left transition-colors hover:bg-accent/60"
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
