import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { cardHover, contentCardRadius, textAction } from "@/lib/interaction-styles";

export interface DashboardCardProps {
  title: string;
  action?: ReactNode;
  className?: string;
  /** When false, the outer card shell does not lift on hover — use for dense interactive interiors. */
  elevateOnHover?: boolean;
  children: ReactNode;
}

/**
 * Shared white card shell used by every dashboard section: a title row
 * with an optional trailing action, and a content slot below.
 */
export function DashboardCard({
  title,
  action,
  className,
  elevateOnHover = true,
  children,
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        contentCardRadius,
        "border border-border bg-card p-5 shadow-xs",
        elevateOnHover && cardHover,
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[14.5px] font-medium tracking-tight text-foreground">{title}</h2>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

export function ViewAllLink({ href }: { href: string }) {
  return (
    <a href={href} className={cn("flex items-center gap-0.5 text-xs font-medium text-primary", textAction, "hover:underline")}>
      View all
      <ChevronRight className="size-3" />
    </a>
  );
}
