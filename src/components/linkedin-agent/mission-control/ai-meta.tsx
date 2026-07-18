import { Badge } from "@/components/ui/badge";
import type { CareerOsSource } from "@/lib/linkedin-agent/mission-control/types";
import { cn } from "@/lib/utils";

export interface AiSourceBadgesProps {
  sources: CareerOsSource[];
  className?: string;
  size?: "sm" | "xs";
}

export function AiSourceBadges({ sources, className, size = "sm" }: AiSourceBadgesProps) {
  if (sources.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {sources.map((source) => (
        <Badge
          key={source}
          variant="outline"
          className={cn(
            "rounded-full font-normal text-muted-foreground",
            size === "xs" ? "px-1.5 py-0 text-[9.5px]" : "px-2 py-0 text-[10px]"
          )}
        >
          {source}
        </Badge>
      ))}
    </div>
  );
}

export interface AiLeadInProps {
  children: React.ReactNode;
  className?: string;
}

export function AiLeadIn({ children, className }: AiLeadInProps) {
  return (
    <p className={cn("text-[11px] font-medium tracking-[0.04em] text-primary/90", className)}>
      {children}
    </p>
  );
}

export interface AiWhyLineProps {
  reason: string;
  className?: string;
}

export function AiWhyLine({ reason, className }: AiWhyLineProps) {
  return (
    <p className={cn("text-[11.5px] leading-snug text-muted-foreground/90", className)}>
      <span className="font-medium text-muted-foreground">Why: </span>
      {reason}
    </p>
  );
}
