"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type AnimatedChartAreaProps = {
  d: string;
  fill: string;
  className?: string;
};

type AnimatedChartLineProps = {
  d: string;
  stroke: string;
  strokeWidth?: number;
  className?: string;
};

export function AnimatedChartArea({ d, fill, className }: AnimatedChartAreaProps) {
  return (
    <path d={d} fill={fill} stroke="none" className={cn("animate-chart-area-fade", className)} />
  );
}

export function AnimatedChartLine({ d, stroke, strokeWidth = 2, className }: AnimatedChartLineProps) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    path.style.transition = "stroke-dashoffset 1.1s cubic-bezier(0.22, 1, 0.36, 1)";

    const frame = requestAnimationFrame(() => {
      path.style.strokeDashoffset = "0";
    });

    return () => cancelAnimationFrame(frame);
  }, [d]);

  return (
    <path
      ref={pathRef}
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      className={className}
    />
  );
}
