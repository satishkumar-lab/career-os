"use client";

import { ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import { MissionSectionCard } from "@/components/linkedin-agent/mission-control/mission-section-card";
import { contentCardRadius, subtleSurfaceHover, transitionPremium } from "@/lib/interaction-styles";
import type { MissionAction } from "@/lib/linkedin-agent/mission-control/types";
import { cn } from "@/lib/utils";

export interface ActionCenterProps {
  actions: MissionAction[];
  onAction: (action: MissionAction) => void;
  disabled?: boolean;
}

const VISIBLE_COUNT = 5;

export function ActionCenter({ actions, onAction, disabled = false }: ActionCenterProps) {
  const [expanded, setExpanded] = useState(false);

  const visibleActions = useMemo(
    () => (expanded ? actions : actions.slice(0, VISIBLE_COUNT)),
    [actions, expanded]
  );

  const hiddenCount = Math.max(0, actions.length - VISIBLE_COUNT);

  return (
    <MissionSectionCard
      title="AI Action Center"
      description="Turn insights into impact — the most relevant actions for your career right now."
      actionLabel={hiddenCount > 0 ? (expanded ? "Show fewer" : `View all (${actions.length})`) : undefined}
      onActionClick={hiddenCount > 0 ? () => setExpanded((value) => !value) : undefined}
    >
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
        {visibleActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              disabled={disabled}
              onClick={() => onAction(action)}
              className={cn(
                contentCardRadius,
                "flex w-full items-start gap-3 border border-border/80 bg-background/50 p-3.5 text-left",
                subtleSurfaceHover,
                disabled && "pointer-events-none opacity-50"
              )}
            >
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: action.tint }}
              >
                <Icon className="size-4 shrink-0" style={{ color: action.color }} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[12.5px] font-medium leading-snug text-foreground">
                  {action.label}
                </span>
                <span className="mt-0.5 block line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                  {action.description}
                </span>
              </span>

              <ChevronRight
                className={cn("mt-0.5 size-4 shrink-0 text-muted-foreground/70", transitionPremium)}
                aria-hidden
              />
            </button>
          );
        })}
      </div>
    </MissionSectionCard>
  );
}
