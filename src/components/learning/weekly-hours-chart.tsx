import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { AnimatedChartArea, AnimatedChartLine } from "@/components/ui/animated-chart-paths";
import type { WeeklyHoursPoint } from "@/components/learning/types";

export interface WeeklyHoursChartProps {
  data: WeeklyHoursPoint[];
  totalLabel: string;
}

const WIDTH = 1000;
const HEIGHT = 80;
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

/**
 * Lightweight, dependency-free smoothed area chart matching the Figma
 * "Weekly Learning Hours" card. Renders a single trend line, so a full
 * charting library isn't warranted here.
 */
export function WeeklyHoursChart({ data, totalLabel }: WeeklyHoursChartProps) {
  const values = data.map((point) => point.hours);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const points = data.map((point, index) => ({
    x: (index / (data.length - 1)) * WIDTH,
    y: PADDING + (1 - (point.hours - min) / range) * (HEIGHT - PADDING * 2),
  }));

  const linePath = buildSmoothPath(points);
  const areaPath = `${linePath} L ${WIDTH} ${HEIGHT} L 0 ${HEIGHT} Z`;

  return (
    <DashboardCard
      title="Weekly Learning Hours"
      action={<span className="font-mono text-xs text-muted-foreground">{totalLabel}</span>}
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        className="h-20 w-full"
        role="img"
        aria-label="Weekly learning hours trend"
      >
        <defs>
          <linearGradient id="weekly-hours-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5b5bd6" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#5b5bd6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <AnimatedChartArea d={areaPath} fill="url(#weekly-hours-fill)" />
        <AnimatedChartLine d={linePath} stroke="#5b5bd6" />
      </svg>
    </DashboardCard>
  );
}
