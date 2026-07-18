"use client";

import { useMemo, useState } from "react";

import { AiLeadIn, AiSourceBadges, AiWhyLine } from "@/components/linkedin-agent/mission-control/ai-meta";
import { MissionSectionCard } from "@/components/linkedin-agent/mission-control/mission-section-card";
import { contentCardRadius, textAction } from "@/lib/interaction-styles";
import type { MissionOpportunity } from "@/lib/linkedin-agent/mission-control/types";
import { cn } from "@/lib/utils";

export interface OpportunitiesSectionProps {
  opportunities: MissionOpportunity[];
  improvements: MissionOpportunity[];
  achievements: MissionOpportunity[];
  onAction: (actionId: string, title: string) => void;
}

const priorityWeight = { high: 3, medium: 2, low: 1 } as const;
const VISIBLE_COUNT = 3;

function OpportunityRow({
  item,
  onAction,
}: {
  item: MissionOpportunity;
  onAction: (actionId: string, title: string) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-4">
      <div className="min-w-0 flex-1">
        <AiLeadIn className="mb-1">{item.leadIn}</AiLeadIn>
        <p className="text-[13px] font-medium leading-snug text-foreground">{item.title}</p>
        <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{item.description}</p>
        <AiWhyLine reason={item.whyReason} className="mt-2" />
        <AiSourceBadges sources={[item.source]} className="mt-2" size="xs" />
      </div>

      <button
        type="button"
        onClick={() => onAction(item.actionId, item.title)}
        className={cn(
          "shrink-0 pt-0.5 text-[12px] font-medium text-primary",
          textAction,
          "hover:underline"
        )}
      >
        {item.ctaLabel}
      </button>
    </div>
  );
}

export function OpportunitiesSection({
  opportunities,
  improvements,
  achievements,
  onAction,
}: OpportunitiesSectionProps) {
  const [expanded, setExpanded] = useState(false);

  const rankedItems = useMemo(() => {
    return [...opportunities, ...improvements, ...achievements].sort(
      (a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]
    );
  }, [achievements, improvements, opportunities]);

  const visibleItems = expanded ? rankedItems : rankedItems.slice(0, VISIBLE_COUNT);
  const hiddenCount = Math.max(0, rankedItems.length - VISIBLE_COUNT);

  return (
    <MissionSectionCard
      title="AI Opportunities"
      description="Personalized suggestions based on your CareerOS activity — every recommendation includes a reason."
      actionLabel={hiddenCount > 0 ? (expanded ? "Show fewer" : `View all (${rankedItems.length})`) : undefined}
      onActionClick={hiddenCount > 0 ? () => setExpanded((value) => !value) : undefined}
      className="min-h-0"
    >
      {visibleItems.length === 0 ? (
        <div className={cn(contentCardRadius, "border border-dashed border-border/80 p-6 text-center")}>
          <p className="text-[13px] text-muted-foreground">
            Add projects or certifications in CareerOS to unlock smarter recommendations.
          </p>
        </div>
      ) : (
        <div className={cn(contentCardRadius, "divide-y divide-border/60 border border-border/80 bg-background/40")}>
          {visibleItems.map((item) => (
            <OpportunityRow key={item.id} item={item} onAction={onAction} />
          ))}
        </div>
      )}
    </MissionSectionCard>
  );
}
