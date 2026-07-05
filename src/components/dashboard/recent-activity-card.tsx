import { DashboardCard, ViewAllLink } from "@/components/dashboard/dashboard-card";
import type { ActivityItem } from "@/components/dashboard/types";

export interface RecentActivityCardProps {
  activity: ActivityItem[];
  className?: string;
}

export function RecentActivityCard({ activity, className }: RecentActivityCardProps) {
  return (
    <DashboardCard title="Recent Activity" action={<ViewAllLink href="/goals" />} className={className}>
      <ul className="space-y-1">
        {activity.map((item) => (
          <li key={item.id} className="flex items-start gap-3 rounded-2xl p-3">
            <span className="mt-1.5 size-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-foreground">{item.title}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{item.meta}</p>
            </div>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
