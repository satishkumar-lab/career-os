"use client";

import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { AiLeadIn, AiSourceBadges, AiWhyLine } from "@/components/linkedin-agent/mission-control/ai-meta";
import { MissionControlHeaderAccent } from "@/components/linkedin-agent/mission-control/mission-control-header";
import { Button } from "@/components/ui/button";
import { cardShell, contentCardRadius, transitionPremium } from "@/lib/interaction-styles";
import type { BriefInsight, MissionBrief } from "@/lib/linkedin-agent/mission-control/types";
import { cn } from "@/lib/utils";

export interface MissionBriefHeroProps {
  firstName: string;
  brief: MissionBrief;
  onRecommendedAction: (actionId: string) => void;
  isLoading?: boolean;
}

function BriefInsightCard({
  insight,
  visible,
}: {
  insight: BriefInsight;
  visible: boolean;
}) {
  return (
    <div
      className={cn(
        contentCardRadius,
        "flex min-h-[132px] flex-col border border-border/80 bg-background/60 p-4",
        "transition-opacity duration-500",
        visible ? "opacity-100" : "opacity-0"
      )}
    >
      <p className="text-[10.5px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
        {insight.categoryLabel}
      </p>
      <AiLeadIn className="mt-2.5">{insight.leadIn}</AiLeadIn>
      <p className="mt-1 line-clamp-3 flex-1 text-[12.5px] leading-snug font-medium text-foreground">
        {insight.text}
      </p>
      <AiSourceBadges sources={insight.sources} className="mt-3" size="xs" />
    </div>
  );
}

export function MissionBriefHero({
  firstName,
  brief,
  onRecommendedAction,
  isLoading = false,
}: MissionBriefHeroProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [showRecommended, setShowRecommended] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setRevealedCount(0);
      setShowRecommended(false);
      return;
    }

    setRevealedCount(0);
    setShowRecommended(false);

    const timers: ReturnType<typeof setTimeout>[] = [];

    brief.insights.forEach((_, index) => {
      timers.push(
        setTimeout(() => {
          setRevealedCount(index + 1);
        }, 250 + index * 100)
      );
    });

    timers.push(
      setTimeout(() => {
        setShowRecommended(true);
      }, 250 + brief.insights.length * 100 + 150)
    );

    return () => timers.forEach(clearTimeout);
  }, [isLoading, brief.insights]);

  if (isLoading) {
    return (
      <div className={cn(cardShell, contentCardRadius, "overflow-hidden p-6 sm:p-7")}>
        <div className="flex items-center gap-3">
          <span className="size-9 animate-pulse rounded-2xl bg-primary/20" />
          <div className="space-y-2">
            <div className="h-4 w-40 animate-pulse rounded bg-muted" />
            <div className="h-3 w-56 animate-pulse rounded bg-muted/80" />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(contentCardRadius, "h-[132px] animate-pulse border border-border/60 bg-muted/40")}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div className={cn(cardShell, contentCardRadius, "overflow-hidden p-6 sm:p-7")}>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_200px] lg:gap-8">
          <div className="min-w-0">
            <div className="flex items-start gap-3">
              <MissionControlHeaderAccent />
              <div>
                <p className="text-[15px] font-medium text-foreground sm:text-[16px]">
                  {brief.greeting}, {firstName} 👋
                </p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">{brief.dateLabel}</p>
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">
              {brief.narrativeIntro}
            </p>
          </div>

          <div className="border-t border-border/60 pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
            <p className="text-[10.5px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
              AI is using your CareerOS data
            </p>
            <ul className="mt-3 space-y-2">
              {brief.activeDataSources.map((source) => (
                <li
                  key={source}
                  className="flex items-center gap-2 text-[11.5px] text-muted-foreground"
                >
                  <Check className="size-3 shrink-0 text-primary" strokeWidth={2.5} />
                  {source}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {brief.insights.map((insight, index) => (
            <BriefInsightCard
              key={insight.id}
              insight={insight}
              visible={index < revealedCount}
            />
          ))}
        </div>
      </div>

      <div
        className={cn(
          cardShell,
          contentCardRadius,
          "p-5 sm:p-6",
          "transition-opacity duration-500",
          showRecommended ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1 lg:pr-6">
            <AiLeadIn>{brief.recommended.leadIn}</AiLeadIn>
            <p className="mt-1.5 text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
              Recommended next action
            </p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              {brief.recommended.title}
            </h3>
            <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
              {brief.recommended.subtitle}
            </p>
            <AiWhyLine reason={brief.recommended.whyReason} className="mt-2.5" />
            <AiSourceBadges sources={brief.recommended.sources} className="mt-2" size="xs" />
          </div>

          <Button
            type="button"
            size="lg"
            className={cn(
              "h-11 w-full shrink-0 rounded-2xl px-5 text-[13px] font-semibold lg:w-auto",
              transitionPremium,
              "active:scale-[0.98]"
            )}
            onClick={() => onRecommendedAction(brief.recommended.actionId)}
          >
            <Sparkles className="size-4" />
            {brief.recommended.ctaLabel}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
