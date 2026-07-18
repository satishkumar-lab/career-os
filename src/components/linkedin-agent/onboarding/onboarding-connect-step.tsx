"use client";

import { Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cardShell, contentCardRadius } from "@/lib/interaction-styles";
import { cn } from "@/lib/utils";

export interface OnboardingConnectStepProps {
  onConnectPlaceholder: () => void;
}

export function OnboardingConnectStep({ onConnectPlaceholder }: OnboardingConnectStepProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Connect LinkedIn</h2>
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          Link your LinkedIn account when you&apos;re ready. OAuth integration is coming in a future sprint.
        </p>
      </div>

      <div className={cn(contentCardRadius, "border border-dashed border-border bg-muted/20 p-6 text-center")}>
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#0a66c2]/10">
          <Share2 className="size-5 text-[#0a66c2]" />
        </span>
        <p className="mt-4 text-[13.5px] font-medium text-foreground">LinkedIn connection placeholder</p>
        <p className="mt-1 text-xs text-muted-foreground">
          This button does not connect to LinkedIn yet.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-2xl"
          onClick={onConnectPlaceholder}
        >
          <Share2 className="size-3.5" />
          Connect LinkedIn
        </Button>
      </div>

      <div className={cn(cardShell, "p-4")}>
        <p className="text-[12.5px] leading-relaxed text-muted-foreground">
          You can finish setup now and connect LinkedIn later. Your onboarding answers are saved so the AI
          workspace can personalize content when those features launch.
        </p>
      </div>
    </div>
  );
}
