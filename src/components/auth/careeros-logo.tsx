import Image from "next/image";

import { CAREER_OS_LOGO_SRC, APP_NAME, APP_TAGLINE } from "@/lib/auth/branding";
import { cn } from "@/lib/utils";

export interface CareerOsLogoProps {
  layout?: "stacked" | "horizontal" | "mark";
  tone?: "default" | "inverse";
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
  priority?: boolean;
}

const markDisplaySizes = {
  sm: 32,
  md: 40,
  lg: 56,
} as const;

export interface CareerOsLogoMarkProps {
  size?: keyof typeof markDisplaySizes;
  className?: string;
  priority?: boolean;
}

export function CareerOsLogoMark({
  size = "md",
  className,
  priority = false,
}: CareerOsLogoMarkProps) {
  const displaySize = markDisplaySizes[size];

  return (
    <Image
      src={CAREER_OS_LOGO_SRC}
      alt=""
      width={displaySize}
      height={displaySize}
      priority={priority}
      className={cn("size-auto shrink-0 object-contain", className)}
      style={{ width: displaySize, height: displaySize, maxWidth: displaySize, maxHeight: displaySize }}
    />
  );
}

export function CareerOsLogo({
  layout = "stacked",
  tone = "default",
  size = "md",
  showTagline = true,
  className,
  priority = false,
}: CareerOsLogoProps) {
  const isInverse = tone === "inverse";

  const mark = <CareerOsLogoMark size={size} priority={priority} />;

  if (layout === "mark") {
    return <div className={className}>{mark}</div>;
  }

  const titleClass = cn(
    "font-semibold tracking-tight",
    size === "lg" ? "text-2xl" : size === "sm" ? "text-[15px]" : "text-xl",
    isInverse ? "text-white" : "text-foreground"
  );

  const taglineClass = cn(
    "font-medium",
    size === "lg" ? "text-sm" : "text-xs",
    isInverse ? "text-white/70" : "text-muted-foreground"
  );

  const isHorizontal = layout === "horizontal";

  return (
    <div
      className={cn(
        "flex gap-3",
        isHorizontal ? "flex-row items-center" : "flex-col items-center",
        className
      )}
    >
      {mark}
      <span
        className={cn(
          "flex flex-col",
          isHorizontal ? "items-start gap-0.5" : "items-center gap-0.5 text-center"
        )}
      >
        <span className={titleClass}>{APP_NAME}</span>
        {showTagline ? <span className={taglineClass}>{APP_TAGLINE}</span> : null}
      </span>
    </div>
  );
}