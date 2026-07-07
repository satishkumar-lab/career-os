import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

type AnimatedProgressFillProps = {
  value: number;
  className?: string;
  style?: CSSProperties;
};

export function AnimatedProgressFill({ value, className, style }: AnimatedProgressFillProps) {
  const scale = Math.max(0, Math.min(100, value)) / 100;

  return (
    <div
      className={cn("animate-progress-fill h-full w-full origin-left rounded-full", className)}
      style={
        {
          ...style,
          "--progress-scale": scale,
        } as CSSProperties
      }
    />
  );
}
