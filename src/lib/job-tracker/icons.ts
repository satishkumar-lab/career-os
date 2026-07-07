import type { LucideIcon } from "lucide-react";
import { BookOpen, Briefcase, CreditCard, Layers, Minus } from "lucide-react";

export type JobIconKey = "figma" | "stripe" | "linear" | "notion" | "default";

export const jobIconPresets: Record<JobIconKey, { icon: LucideIcon }> = {
  figma: { icon: Layers },
  stripe: { icon: CreditCard },
  linear: { icon: Minus },
  notion: { icon: BookOpen },
  default: { icon: Briefcase },
};
