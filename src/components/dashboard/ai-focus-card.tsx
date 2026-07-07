import type { LucideIcon } from "lucide-react";

import { cardHover, contentCardRadius } from "@/lib/interaction-styles";
import { cn } from "@/lib/utils";

export interface AiFocusCardProps {
  icon: LucideIcon;
  segments: { text: string; bold: boolean }[];
  className?: string;
}

export function AiFocusCard({ icon: Icon, segments, className }: AiFocusCardProps) {
  return (
    <div className={cn(contentCardRadius, "border border-border bg-card p-4 shadow-xs", cardHover, className)}>
      <div className="flex items-start gap-3">
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-2xl shadow-sm"
          style={{ backgroundImage: "linear-gradient(135deg, #17a5fb 0%, #e80584 100%)" }}
        >
          <Icon className="size-3.5 text-white" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-medium tracking-[0.08em] text-primary uppercase">AI Focus</p>
          <p className="mt-1 text-[13px] leading-relaxed text-foreground">
            {segments.map((segment, index) => (
              <span key={index} className={segment.bold ? "font-semibold" : undefined}>
                {segment.text}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
