import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface LegalSectionProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}

export function LegalSection({ id, title, children, className }: LegalSectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <h2 className="text-[15px] font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="mt-3 space-y-3 text-[13.5px] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
