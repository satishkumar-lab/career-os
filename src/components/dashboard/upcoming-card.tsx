import { DashboardCard, ViewAllLink } from "@/components/dashboard/dashboard-card";
import { cn } from "@/lib/utils";
import { contentCardRadius, subtleSurfaceHover } from "@/lib/interaction-styles";
import type { UpcomingEvent } from "@/components/dashboard/types";

export interface UpcomingCardProps {
  events: UpcomingEvent[];
  className?: string;
}

export function UpcomingCard({ events, className }: UpcomingCardProps) {
  return (
    <DashboardCard title="Upcoming" action={<ViewAllLink href="/goals" />} className={className}>
      <ul className="space-y-2">
        {events.map((event) => {
          const Icon = event.icon;

          return (
            <li key={event.id} className={cn("flex items-center gap-3 border border-border p-3", contentCardRadius, subtleSurfaceHover)}>
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: event.tint }}
              >
                <Icon className="size-3.5" style={{ color: event.color }} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-foreground">{event.title}</p>
                <p className="text-[11px] text-muted-foreground">{event.dateLabel}</p>
              </div>
              {event.badge && (
                <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  {event.badge}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </DashboardCard>
  );
}
