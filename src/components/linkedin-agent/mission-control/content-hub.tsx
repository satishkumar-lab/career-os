"use client";

import { Calendar, ChevronRight, FileText, Lightbulb, TrendingUp } from "lucide-react";
import { useMemo } from "react";

import { MissionSectionCard } from "@/components/linkedin-agent/mission-control/mission-section-card";
import { Badge } from "@/components/ui/badge";
import { contentCardRadius, subtleSurfaceHover, textAction } from "@/lib/interaction-styles";
import type { ContentItem, TrendingTopic } from "@/lib/linkedin-agent/mission-control/types";
import { cn } from "@/lib/utils";

export interface ContentHubProps {
  items: ContentItem[];
  trending: TrendingTopic[];
  onItemAction: (item: ContentItem) => void;
  onTrendAction: (topic: TrendingTopic) => void;
}

const statusLabels: Record<ContentItem["status"], string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  idea: "Idea",
  plan: "Plan",
};

const statusStyles: Record<ContentItem["status"], string> = {
  draft: "bg-primary/10 text-primary",
  scheduled: "bg-emerald-500/10 text-emerald-700",
  idea: "bg-amber-500/10 text-amber-700",
  plan: "bg-violet-500/10 text-violet-700",
};

const statusIcons = {
  draft: FileText,
  scheduled: Calendar,
  idea: Lightbulb,
  plan: Calendar,
} as const;

type HubCard =
  | { kind: "content"; item: ContentItem }
  | { kind: "trending"; topic: TrendingTopic };

export function ContentHub({
  items,
  trending,
  onItemAction,
  onTrendAction,
}: ContentHubProps) {
  const cards = useMemo(() => {
    const contentCards: HubCard[] = items.slice(0, 3).map((item) => ({ kind: "content", item }));
    const trend = trending[0];

    if (trend) {
      contentCards.push({ kind: "trending", topic: trend });
    } else if (items[3]) {
      contentCards.push({ kind: "content", item: items[3] });
    }

    return contentCards.slice(0, 4);
  }, [items, trending]);

  return (
    <MissionSectionCard
      title="Content Hub"
      description="Plan, create, and schedule your LinkedIn content."
    >
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          if (card.kind === "trending") {
            const { topic } = card;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => onTrendAction(topic)}
                className={cn(
                  contentCardRadius,
                  "flex min-h-[168px] flex-col border border-border/80 bg-background/50 p-4 text-left",
                  subtleSurfaceHover
                )}
              >
                <Badge
                  variant="secondary"
                  className="w-fit rounded-full bg-primary/10 px-2 py-0 text-[10px] text-primary"
                >
                  Trending
                </Badge>
                <span className="mt-3 flex size-8 items-center justify-center rounded-xl bg-primary/10">
                  <TrendingUp className="size-4 text-primary" />
                </span>
                <p className="mt-3 line-clamp-2 text-[12.5px] font-medium leading-snug text-foreground">
                  {topic.topic}
                </p>
                <p className="mt-1 line-clamp-2 flex-1 text-[11px] leading-snug text-muted-foreground">
                  {topic.relevance}
                </p>
                <span className={cn("mt-3 inline-flex items-center gap-0.5 text-[11.5px] font-medium text-primary", textAction)}>
                  Explore topic
                  <ChevronRight className="size-3" />
                </span>
              </button>
            );
          }

          const { item } = card;
          const Icon = statusIcons[item.status];

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onItemAction(item)}
              className={cn(
                contentCardRadius,
                "flex min-h-[168px] flex-col border border-border/80 bg-background/50 p-4 text-left",
                subtleSurfaceHover
              )}
            >
              <Badge
                variant="secondary"
                className={cn("w-fit rounded-full px-2 py-0 text-[10px] capitalize", statusStyles[item.status])}
              >
                {statusLabels[item.status]}
              </Badge>
              <span className="mt-3 flex size-8 items-center justify-center rounded-xl bg-muted/70">
                <Icon className="size-4 text-muted-foreground" />
              </span>
              <p className="mt-3 line-clamp-2 text-[12.5px] font-medium leading-snug text-foreground">
                {item.title}
              </p>
              <p className="mt-1 line-clamp-2 flex-1 text-[11px] leading-snug text-muted-foreground">
                {item.subtitle}
              </p>
              {item.dateLabel ? (
                <p className="mt-2 text-[10.5px] text-muted-foreground">{item.dateLabel}</p>
              ) : null}
              <span className={cn("mt-2 inline-flex items-center gap-0.5 text-[11.5px] font-medium text-primary", textAction)}>
                {item.actionLabel}
                <ChevronRight className="size-3" />
              </span>
            </button>
          );
        })}
      </div>
    </MissionSectionCard>
  );
}
