import { DashboardCard } from "@/components/dashboard/dashboard-card";
import type { SocialGrowthItem } from "@/components/dashboard/types";

export interface SocialGrowthCardProps {
  items: SocialGrowthItem[];
  className?: string;
}

export function SocialGrowthCard({ items, className }: SocialGrowthCardProps) {
  return (
    <DashboardCard title="Social Growth" className={className}>
      <ul className="space-y-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <li key={item.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="flex size-6 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: item.tint }}
                  >
                    <Icon className="size-3" style={{ color: item.color }} />
                  </span>
                  <p className="text-[13px] font-medium text-foreground">{item.platform}</p>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <p className="text-base font-medium text-foreground">{item.value}</p>
                  <p className="text-[11px] font-medium text-[#009966]">{item.delta}</p>
                </div>
              </div>
              <div className="mt-1.5 h-[5px] w-full overflow-hidden rounded-full" style={{ backgroundColor: item.tint }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                />
              </div>
              <p className="mt-1 text-[10.5px] text-muted-foreground">{item.goalLabel}</p>
            </li>
          );
        })}
      </ul>
    </DashboardCard>
  );
}
