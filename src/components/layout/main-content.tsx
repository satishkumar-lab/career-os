import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface MainContentProps {
  children: ReactNode;
  className?: string;
}

/**
 * Reusable, responsive container for page content. Owns its own scroll
 * region so the sidebar and top nav stay fixed while content scrolls.
 */
export function MainContent({ children, className }: MainContentProps) {
  return (
    <main className={cn("flex-1 overflow-y-auto bg-background p-4 sm:p-7", className)}>
      {children}
    </main>
  );
}
