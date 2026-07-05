import { Fragment } from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { PipelineStage, PipelineStageVariant } from "@/components/job-tracker/types";

const variantStyles: Record<
  PipelineStageVariant,
  { bg: string; text: string; shadow?: boolean }
> = {
  applied: { bg: "#d9ffca", text: "#38a311" },
  progress: { bg: "#ceecff", text: "#17a5fb" },
  inactive: { bg: "#edede9", text: "#787870" },
  rejected: {
    bg: "#ff4245",
    text: "#ffffff",
    shadow: true,
  },
};

function StagePill({ stage }: { stage: PipelineStage }) {
  const style = variantStyles[stage.variant];

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-2xl px-3 py-2.5",
        style.shadow &&
          "shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]"
      )}
      style={{ backgroundColor: style.bg }}
    >
      <p
        className="text-center text-[11px] font-medium whitespace-nowrap"
        style={{ color: style.text }}
      >
        {stage.label}
      </p>
    </div>
  );
}

export function PipelineCard({ stages }: { stages: PipelineStage[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[0px_1px_1.5px_rgba(0,0,0,0.04),0px_2px_4px_rgba(0,0,0,0.02)]">
      <p className="text-[14.5px] font-medium text-foreground">Pipeline</p>
      <div className="-mx-5 mt-4 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <div className="flex w-max items-center gap-1.5 pb-0.5">
          {stages.map((stage, index) => (
            <Fragment key={stage.id}>
              <StagePill stage={stage} />
              {index < stages.length - 1 && (
                <ChevronRight className="size-2.75 shrink-0 text-muted-foreground" />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
