import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { Award, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Certification, CertificationStatus } from "@/components/certifications/types";

const statusStyles: Record<CertificationStatus, { bg: string; text: string }> = {
  "In Progress": { bg: "#eef0ff", text: "#5b5bd6" },
  Completed: { bg: "#f0fdf4", text: "#10b981" },
  Planned: { bg: "#f8f8f8", text: "#94a3b8" },
};

function CertificationRow({ cert, isLast }: { cert: Certification; isLast: boolean }) {
  const status = statusStyles[cert.status];

  return (
    <div
      className={cn(
        "flex flex-wrap items-start gap-3 px-4 py-4 sm:flex-nowrap sm:items-center sm:gap-4 sm:px-6",
        !isLast && "border-b border-border"
      )}
    >
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-2xl"
        style={{ backgroundColor: cert.tint }}
      >
        <Award className="size-4" style={{ color: cert.color }} />
      </span>

      <div className="min-w-0 flex-1 basis-full sm:basis-auto">
        <div className="flex flex-wrap items-center gap-2.5">
          <p className="text-sm font-medium text-foreground">{cert.name}</p>
          <Badge
            className="rounded-full border-transparent px-2.5 py-0.5 text-[10.5px] font-medium"
            style={{ backgroundColor: status.bg, color: status.text }}
          >
            {cert.status}
          </Badge>
        </div>
        <p className="mt-1 text-xs font-medium text-muted-foreground">{cert.issuer}</p>
        {cert.status !== "Planned" && (
          <ProgressPrimitive.Root value={cert.percent ?? 100} className="mt-2 block">
            <ProgressPrimitive.Track
              className="relative flex h-[5px] w-full items-center overflow-hidden rounded-full"
              style={{ backgroundColor: cert.trackTint }}
            >
              <ProgressPrimitive.Indicator
                className="h-full rounded-full transition-all"
                style={{ backgroundColor: cert.color }}
              />
            </ProgressPrimitive.Track>
          </ProgressPrimitive.Root>
        )}
      </div>

      <div className="ml-[52px] shrink-0 text-right sm:ml-0">
        {cert.status === "In Progress" && (
          <>
            <p className="font-mono text-[13px] font-medium text-foreground">{cert.percent}%</p>
            <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">{cert.dateLabel}</p>
          </>
        )}
        {cert.status === "Completed" && (
          <>
            <CheckCircle2 className="ml-auto size-[18px] text-[#10b981]" />
            <p className="mt-1 text-[11px] font-medium text-muted-foreground">{cert.dateLabel}</p>
          </>
        )}
        {cert.status === "Planned" && (
          <p className="text-xs font-medium text-muted-foreground">{cert.dateLabel}</p>
        )}
      </div>
    </div>
  );
}

export function CertificationsList({ certifications }: { certifications: Certification[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-[0px_1px_1.5px_rgba(0,0,0,0.04),0px_2px_4px_rgba(0,0,0,0.02)]">
      {certifications.map((cert, index) => (
        <CertificationRow key={cert.id} cert={cert} isLast={index === certifications.length - 1} />
      ))}
    </div>
  );
}
