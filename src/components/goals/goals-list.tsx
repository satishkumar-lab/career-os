import { Calendar, Flag } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Goal, GoalCategory, GoalPriority, GoalStatus } from "@/components/goals/types";

const categoryStyles: Record<GoalCategory, { bg: string; text: string }> = {
  Career: { bg: "rgba(91,91,214,0.08)", text: "#5b5bd6" },
  Learning: { bg: "rgba(16,185,129,0.08)", text: "#10b981" },
  Branding: { bg: "rgba(245,158,11,0.08)", text: "#f59e0b" },
  Portfolio: { bg: "rgba(139,92,246,0.08)", text: "#8b5cf6" },
  Project: { bg: "rgba(236,72,153,0.08)", text: "#ec4899" },
};

const priorityStyles: Record<GoalPriority, { bg: string; text: string }> = {
  High: { bg: "#fff1f2", text: "#ef4444" },
  Medium: { bg: "#fffbeb", text: "#f59e0b" },
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

function GoalRow({ goal, isLast }: { goal: Goal; isLast: boolean }) {
  const category = categoryStyles[goal.category];
  const priority = priorityStyles[goal.priority];
  const status = statusStyles[goal.status];

  return (
    <div
      className={cn(
        "flex flex-wrap items-start gap-4 px-6 py-5 sm:flex-nowrap sm:items-center",
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
          <div
            className="h-full rounded-full"
            style={{ width: `${goal.percent}%`, backgroundColor: goal.color }}
          />
        </div>
      </div>

      <p
        className="shrink-0 font-mono text-lg font-medium"
        style={{ color: goal.color }}
      >
        {goal.percent}%
      </p>
    </div>
  );
}

export function GoalsList({ goals }: { goals: Goal[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-[0px_1px_1.5px_rgba(0,0,0,0.04),0px_2px_4px_rgba(0,0,0,0.02)]">
      {goals.map((goal, index) => (
        <GoalRow key={goal.id} goal={goal} isLast={index === goals.length - 1} />
      ))}
    </div>
  );
}
