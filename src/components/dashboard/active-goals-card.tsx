import { DashboardCard, ViewAllLink } from "@/components/dashboard/dashboard-card";
import type { GoalItem } from "@/components/dashboard/types";

export interface ActiveGoalsCardProps {
  goals: GoalItem[];
  className?: string;
}

export function ActiveGoalsCard({ goals, className }: ActiveGoalsCardProps) {
  return (
    <DashboardCard title="Active Goals" action={<ViewAllLink href="/goals" />} className={className}>
      <ul className="space-y-5">
        {goals.map((goal) => (
          <li key={goal.id} className="flex items-start gap-3">
            <span className="mt-0.5 h-9 w-1 shrink-0 rounded-full" style={{ backgroundColor: goal.color }} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-[13px] font-medium text-foreground">{goal.label}</p>
                <p className="shrink-0 font-mono text-xs font-medium" style={{ color: goal.color }}>
                  {goal.percent}%
                </p>
              </div>
              <div className="mt-1.5 h-[5px] w-full overflow-hidden rounded-full" style={{ backgroundColor: goal.tint }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${goal.percent}%`, backgroundColor: goal.color }}
                />
              </div>
              <p className="mt-1 text-[11px] font-medium text-muted-foreground">{goal.dueLabel}</p>
            </div>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
