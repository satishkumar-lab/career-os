import { DashboardCard, ViewAllLink } from "@/components/dashboard/dashboard-card";
import { cn } from "@/lib/utils";
import { listRowHover } from "@/lib/interaction-styles";
import type { ActivityItem } from "@/components/dashboard/types";

export interface RecentActivityCardProps {
  activity: ActivityItem[];
  className?: string;
}

export function RecentActivityCard({ activity, className }: RecentActivityCardProps) {
  const isEmpty = activity.length === 1 && activity[0]?.id === "empty-activity";

  return (
    <DashboardCard title="Recent Activity" action={<ViewAllLink href="/goals" />} className={className}>
      {isEmpty ? (
        <p className="text-[13px] font-medium text-muted-foreground">
          No recent activity yet — updates will appear as you work
        </p>
      ) : (
      <ul className="space-y-1">
        {activity.map((item) => (
          <li key={item.id} className={cn("flex items-start gap-3 rounded-2xl p-3", listRowHover)}>
            <span className="mt-1.5 size-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-foreground">{item.title}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{item.meta}</p>
            </div>
          </li>
        ))}
      </ul>
      )}
    </DashboardCard>
  );
}
