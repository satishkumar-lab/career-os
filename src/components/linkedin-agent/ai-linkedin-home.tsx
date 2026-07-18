"use client";

import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cardShell, contentCardRadius } from "@/lib/interaction-styles";
import { cn } from "@/lib/utils";

export interface AiLinkedInHomeProps {
  resumeMessage?: string | null;
  onResumeOnboarding?: () => void;
}

export function AiLinkedInHome({ resumeMessage, onResumeOnboarding }: AiLinkedInHomeProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div>
        <p className="text-[11px] font-medium tracking-[0.08em] text-primary uppercase">AI LinkedIn Agent</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-[24px]">
          AI LinkedIn Agent
        </h1>
        <p className="mt-1 text-[13.5px] text-muted-foreground">Welcome back!</p>
      </div>

      {resumeMessage && onResumeOnboarding && (
        <div className={cn(contentCardRadius, "border border-border bg-card p-4 shadow-xs")}>
          <p className="text-[13px] text-muted-foreground">{resumeMessage}</p>
          <Button className="mt-3 rounded-2xl" size="sm" onClick={onResumeOnboarding}>
            Resume onboarding
          </Button>
        </div>
      )}

      <div className={cn(contentCardRadius, cardShell, "p-8 text-center sm:p-10")}>
        <span
          className="mx-auto flex size-14 items-center justify-center rounded-[20px] shadow-sm"
          style={{ backgroundImage: "linear-gradient(135deg, #17a5fb 0%, #e80584 100%)" }}
        >
          <Sparkles className="size-6 text-white" />
        </span>
        <h2 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
          Your AI LinkedIn workspace is under construction.
        </h2>
        <p className="mx-auto mt-2 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
          Future features will appear here.
        </p>
      </div>
    </div>
  );
}
