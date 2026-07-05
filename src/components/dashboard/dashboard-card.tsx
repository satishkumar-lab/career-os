import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export interface DashboardCardProps {
  title: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

/**
 * Shared white card shell used by every dashboard section: a title row
 * with an optional trailing action, and a content slot below.
 */
export function DashboardCard({ title, action, className, children }: DashboardCardProps) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5 shadow-xs", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-[14.5px] font-medium tracking-tight text-foreground">{title}</h2>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

export function ViewAllLink({ href }: { href: string }) {
  return (
    <a href={href} className="flex items-center gap-0.5 text-xs font-medium text-primary hover:underline">
      View all
      <ChevronRight className="size-3" />
    </a>
  );
}
