import { Progress as ProgressPrimitive } from "@base-ui/react/progress";

import { Badge } from "@/components/ui/badge";
import type { AiTool, AiToolLevel } from "@/components/ai-tools/types";

const levelStyles: Record<AiToolLevel, { bg: string; text: string }> = {
  Beginner: { bg: "#f1f5f9", text: "#94a3b8" },
  Intermediate: { bg: "#fffbeb", text: "#f59e0b" },
  Advanced: { bg: "#eef0ff", text: "#5b5bd6" },
  Expert: { bg: "#f0fdf4", text: "#10b981" },
};

export function AiToolCard({ tool }: { tool: AiTool }) {
  const level = levelStyles[tool.level];
  const Icon = tool.icon;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[0px_1px_1.5px_rgba(0,0,0,0.04),0px_2px_4px_rgba(0,0,0,0.02)]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: tool.tint }}
          >
            <Icon className="size-4.5" style={{ color: tool.color }} />
          </span>
          <div>
            <p className="text-[15px] font-medium text-foreground">{tool.name}</p>
            <p className="text-[11.5px] font-medium text-muted-foreground">Last used: {tool.lastUsedLabel}</p>
          </div>
        </div>
        <Badge
          className="rounded-full border-transparent px-2.5 py-1 text-[11px] font-medium"
          style={{ backgroundColor: level.bg, color: level.text }}
        >
          {tool.level}
        </Badge>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">Mastery Progress</p>
          <p className="font-mono text-xs font-medium" style={{ color: tool.color }}>
            {tool.percent}%
          </p>
        </div>
        <ProgressPrimitive.Root value={tool.percent} className="mt-2 block">
          <ProgressPrimitive.Track
            className="relative flex h-1.5 w-full items-center overflow-hidden rounded-full"
            style={{ backgroundColor: tool.trackTint }}
          >
            <ProgressPrimitive.Indicator
              className="h-full rounded-full transition-all"
              style={{ backgroundColor: tool.color }}
            />
          </ProgressPrimitive.Track>
        </ProgressPrimitive.Root>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">{tool.projectsBuilt} projects built</p>
        <button type="button" className="text-base font-medium text-primary">
          Edit
        </button>
      </div>

      <div className="mt-3 rounded-2xl bg-[rgba(237,237,233,0.6)] px-3 py-2.5">
        <p className="text-xs font-medium text-muted-foreground">{tool.note}</p>
      </div>
    </div>
  );
}
