import { TrendingUp } from "lucide-react";

import { AnimatedProgressFill } from "@/components/ui/animated-progress-fill";
import { AnimatedChartArea, AnimatedChartLine } from "@/components/ui/animated-chart-paths";
import { cn } from "@/lib/utils";
import { cardInteractive } from "@/lib/interaction-styles";
import type { FollowerGrowthPoint, FollowerGrowthSummary } from "@/components/instagram/types";

const WIDTH = 1000;
const HEIGHT = 110;
const PADDING = 8;

function buildSmoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return path;
}

export function FollowerGrowthCard({
  summary,
  data,
}: {
  summary: FollowerGrowthSummary;
  data: FollowerGrowthPoint[];
}) {
  const values = data.map((point) => point.followers);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const points = data.map((point, index) => ({
    x: (index / (data.length - 1)) * WIDTH,
    y: PADDING + (1 - (point.followers - min) / range) * (HEIGHT - PADDING * 2),
  }));

  const linePath = buildSmoothPath(points);
  const areaPath = `${linePath} L ${WIDTH} ${HEIGHT} L 0 ${HEIGHT} Z`;
  const progressPercent = (summary.current / summary.target) * 100;

  return (
    <div className={cn(cardInteractive, "p-5")}>
      <div className="flex items-center justify-between">
        <p className="text-[14.5px] font-medium text-foreground">Follower Growth</p>
        <div className="flex items-center gap-1.5">
          <TrendingUp className="size-3 text-[#009966]" />
          <p className="text-[12.5px] font-medium text-[#009966]">{summary.growthLabel}</p>
        </div>
      </div>

      <p className="mt-1 text-xs font-medium text-muted-foreground">{summary.progressLabel}</p>

      <div className="mt-4 h-[7px] w-full overflow-hidden rounded-full bg-[rgba(225,48,108,0.13)]">
        <AnimatedProgressFill value={progressPercent} className="bg-[#e1306c]" />
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        className="mt-5 h-[110px] w-full"
        role="img"
        aria-label="Follower growth trend"
      >
        <defs>
          <linearGradient id="instagram-follower-growth-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e1306c" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#e1306c" stopOpacity={0} />
          </linearGradient>
        </defs>
        <AnimatedChartArea d={areaPath} fill="url(#instagram-follower-growth-fill)" />
        <AnimatedChartLine d={linePath} stroke="#e1306c" />
      </svg>
    </div>
  );
}
