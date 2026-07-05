import { cn } from "@/lib/utils";
import type { ApplicationStatus, JobApplication } from "@/components/job-tracker/types";

const statusStyles: Record<ApplicationStatus, { bg: string; text: string }> = {
  "Technical Round": { bg: "rgba(91,91,214,0.08)", text: "#5b5bd6" },
  Assignment: { bg: "rgba(16,185,129,0.08)", text: "#10b981" },
  Rejected: { bg: "rgba(239,68,68,0.08)", text: "#ef4444" },
  "HR Round": { bg: "rgba(139,92,246,0.08)", text: "#8b5cf6" },
};

function ApplicationRow({
  application,
  isLast,
}: {
  application: JobApplication;
  isLast: boolean;
}) {
  const status = statusStyles[application.status];
  const Icon = application.icon;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-4 px-6 py-4 sm:flex-nowrap",
        !isLast && "border-b border-border"
      )}
    >
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-2xl"
        style={{ backgroundColor: application.tint }}
      >
        <Icon className="size-4" style={{ color: application.color }} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-foreground">{application.company}</p>
          <span className="text-base text-muted-foreground/40">·</span>
          <p className="text-[13px] font-medium text-muted-foreground">{application.role}</p>
        </div>
        <p className="mt-0.5 text-[11.5px] font-medium text-muted-foreground">
          {application.appliedLabel}
        </p>
      </div>

      <span
        className="shrink-0 rounded-full px-3 py-1 text-[11px] font-medium"
        style={{ backgroundColor: status.bg, color: status.text }}
      >
        {application.status}
      </span>
    </div>
  );
}

export function ApplicationsList({ applications }: { applications: JobApplication[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-[0px_1px_1.5px_rgba(0,0,0,0.04),0px_2px_4px_rgba(0,0,0,0.02)]">
      {applications.map((application, index) => (
        <ApplicationRow
          key={application.id}
          application={application}
          isLast={index === applications.length - 1}
        />
      ))}
    </div>
  );
}
