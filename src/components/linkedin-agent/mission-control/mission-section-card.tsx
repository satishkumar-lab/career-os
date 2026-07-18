import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { textAction } from "@/lib/interaction-styles";
import { cn } from "@/lib/utils";

export interface MissionSectionCardProps {
  title: string;
  description: string;
  actionLabel?: string;
  onActionClick?: () => void;
  className?: string;
  children: ReactNode;
}

export function MissionSectionCard({
  title,
  description,
  actionLabel,
  onActionClick,
  className,
  children,
}: MissionSectionCardProps) {
  const action =
    actionLabel && onActionClick ? (
      <button
        type="button"
        onClick={onActionClick}
        className={cn("flex shrink-0 items-center gap-0.5 text-xs font-medium text-primary", textAction, "hover:underline")}
      >
        {actionLabel}
        <ChevronRight className="size-3" />
      </button>
    ) : undefined;

  return (
    <DashboardCard
      title={title}
      action={action}
      elevateOnHover={false}
      className={cn("h-full border-border/80 shadow-xs", className)}
    >
      <p className="mb-4 text-[12.5px] leading-relaxed text-muted-foreground">{description}</p>
      {children}
    </DashboardCard>
  );
}
