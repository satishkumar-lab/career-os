import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cardShell } from "@/lib/interaction-styles";
import { cn } from "@/lib/utils";

export interface SettingsSectionCardProps {
  title: string;
  description?: string;
  comingSoon?: boolean;
  className?: string;
  children: ReactNode;
}

export function SettingsSectionCard({
  title,
  description,
  comingSoon,
  className,
  children,
}: SettingsSectionCardProps) {
  return (
    <section
      className={cn(cardShell, className)}
    >
      <div className="border-b border-border px-6 py-5">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="text-[14.5px] font-medium tracking-tight text-foreground">{title}</h2>
          {comingSoon && (
            <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-[10.5px] font-medium">
              Coming Soon
            </Badge>
          )}
        </div>
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="px-6">{children}</div>
    </section>
  );
}
