import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { cn } from "@/lib/utils";
import { contentCardRadius, interactiveSurface } from "@/lib/interaction-styles";
import type { QuickAction } from "@/components/dashboard/types";

export interface QuickActionsCardProps {
  actions: QuickAction[];
  onActionClick?: (actionId: string) => void;
  className?: string;
}

export function QuickActionsCard({ actions, onActionClick, className }: QuickActionsCardProps) {
  return (
    <DashboardCard title="Quick Actions" className={className}>
      <div className="grid grid-cols-2 gap-2.5">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.id}
              type="button"
              onClick={() => onActionClick?.(action.id)}
              className={cn(
                contentCardRadius,
                "flex items-center gap-2.5 border border-border p-3 text-left",
                interactiveSurface
              )}
            >
              <span
                className="flex size-7 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: action.tint }}
              >
                <Icon className="size-3.5" style={{ color: action.color }} />
              </span>
              <span className="truncate text-[12.5px] font-medium text-foreground">{action.label}</span>
            </button>
          );
        })}
      </div>
    </DashboardCard>
  );
}
