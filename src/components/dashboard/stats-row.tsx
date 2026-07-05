import { TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import type { StatCardData } from "@/components/dashboard/types";

export interface StatsRowProps {
  stats: StatCardData[];
}

/**
 * Single connected container (matching the Figma "StatsRow" frame) with
 * hairline dividers between each statistic instead of separate cards.
 */
export function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-[16px] border border-border bg-card shadow-[0px_1px_4px_0px_rgba(0,0,0,0.04)] lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const trendUp = stat.trendUp ?? true;
        const trendColor = stat.trendColor ?? "#009966";
        const TrendIcon = trendUp ? TrendingUp : TrendingDown;

        return (
          <div
            key={stat.id}
            className={cn(
              "border-border p-5",
              index % 2 === 1 && "border-l",
              index >= 2 && "border-t lg:border-t-0",
              index > 0 && "lg:border-l"
            )}
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium tracking-[0.1em] text-muted-foreground uppercase">
                {stat.label}
              </p>
              <span
                className="flex size-[30px] shrink-0 items-center justify-center rounded-2xl"
                style={{ backgroundColor: stat.tint }}
              >
                <Icon className="size-3.5" style={{ color: stat.color }} />
              </span>
            </div>
            <p className="mt-3 text-[32px] leading-none font-semibold tracking-tight text-foreground">
              {stat.value}
            </p>
            {stat.sublabel && (
              <p className="mt-1.5 text-xs font-medium text-muted-foreground">{stat.sublabel}</p>
            )}
            <div className="mt-3 flex items-center gap-1.5 border-t border-border pt-3">
              <TrendIcon className="size-2.5 shrink-0" style={{ color: trendColor }} />
              <p className="text-[11px] font-medium" style={{ color: trendColor }}>
                {stat.trend}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
