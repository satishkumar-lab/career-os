import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { PORTFOLIO_STAGES, type PortfolioProject } from "@/components/portfolio/types";

function StageIndicator({ complete }: { complete: boolean }) {
  if (complete) {
    return (
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#17a5fb] shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]">
        <Check className="size-3 text-white" strokeWidth={2.5} />
      </div>
    );
  }

  return <div className="size-7 shrink-0 rounded-full border-[1.667px] border-border" />;
}

function ProgressRow({
  project,
  isLast,
}: {
  project: PortfolioProject;
  isLast: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-w-[720px] items-center gap-4 px-6 py-4",
        !isLast && "border-b border-border"
      )}
    >
      <p className="w-[200px] shrink-0 truncate text-[13.5px] font-medium text-foreground">
        {project.name}
      </p>
      {PORTFOLIO_STAGES.map((stage) => (
        <div key={stage.key} className="flex min-w-0 flex-1 items-center justify-center">
          <StageIndicator complete={project.stages[stage.key]} />
        </div>
      ))}
    </div>
  );
}

export function ProjectProgressTable({ projects }: { projects: PortfolioProject[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-[0px_1px_1.5px_rgba(0,0,0,0.04),0px_2px_4px_rgba(0,0,0,0.02)]">
      <div className="flex min-w-[720px] items-center gap-4 border-b border-border px-6 py-3.5">
        <div className="w-[200px] shrink-0" />
        {PORTFOLIO_STAGES.map((stage) => (
          <p
            key={stage.key}
            className="min-w-0 flex-1 text-center text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase"
          >
            {stage.label}
          </p>
        ))}
      </div>
      {projects.map((project, index) => (
        <ProgressRow
          key={project.id}
          project={project}
          isLast={index === projects.length - 1}
        />
      ))}
    </div>
  );
}
