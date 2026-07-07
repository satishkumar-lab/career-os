import { cn } from "@/lib/utils";

export const transitionPremium =
  "transition-[color,background-color,box-shadow,border-color,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]";

export const transitionFast = transitionPremium;

export const contentCardRadius = "rounded-[16px]";

export const cardShell = cn(
  contentCardRadius,
  "border border-border bg-card shadow-[0px_1px_1.5px_rgba(0,0,0,0.04),0px_2px_4px_rgba(0,0,0,0.02)]"
);

export const cardHover = cn(
  transitionPremium,
  "hover:shadow-[0px_2px_8px_rgba(0,0,0,0.06),0px_4px_12px_rgba(0,0,0,0.03)]"
);

export const cardInteractive = cn(cardShell, cardHover);

export const statCellHover = cn(
  transitionPremium,
  "hover:bg-[color-mix(in_srgb,var(--stat-accent)_8%,var(--card))]"
);

export const listRowHover = cn(transitionPremium, "hover:bg-accent/50");

export const interactiveSurface = cn(
  transitionPremium,
  "hover:bg-accent/50 active:bg-accent/70"
);

export const navItemBase = cn(
  transitionPremium,
  "hover:bg-accent hover:text-foreground"
);

export const navItemActive =
  "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground";

export const iconButton = cn(
  transitionPremium,
  "hover:bg-accent hover:text-foreground"
);

export const subtleSurfaceHover = cn(
  transitionPremium,
  "hover:bg-accent/40 hover:border-foreground/10"
);

export const textAction = cn(transitionPremium, "hover:text-primary/80 active:text-primary");
