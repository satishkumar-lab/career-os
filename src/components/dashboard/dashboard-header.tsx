import { Flame } from "lucide-react";

export interface DashboardHeaderProps {
  name: string;
  streakDays: number;
  streakNote: string;
}

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/**
 * Server Component (no "use client") rendered from a `force-dynamic` page,
 * so `new Date()` runs exactly once per request on the server. The same
 * render pass produces both the HTML and the RSC payload React hydrates
 * against, so the date/greeting below can never mismatch on the client.
 * An explicit locale ("en-US") is passed to `Intl.DateTimeFormat` so the
 * formatted string doesn't depend on the server's default locale either.
 * Keep this component server-only — if it's ever converted to a Client
 * Component, move this computation back to a Server Component parent and
 * pass the formatted strings down as props instead.
 */
export function DashboardHeader({ name, streakDays, streakNote }: DashboardHeaderProps) {
  const now = new Date();
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
    .format(now)
    .replace(",", " ·");
  const firstName = name.split(" ")[0];

  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-[11.5px] font-medium tracking-[0.09em] text-muted-foreground uppercase">{dateLabel}</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-[30px]">
          {getGreeting(now.getHours())}, {firstName} 👋
        </h1>
        <p className="mt-2 text-[14.5px] font-medium text-muted-foreground">Am I becoming better than yesterday?</p>
      </div>

      <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-[rgba(254,230,133,0.8)] bg-[#fffbeb] px-4 py-2.5">
        <Flame className="size-4 shrink-0 text-[#e17100]" />
        <div>
          <p className="text-[13px] font-medium text-[#e17100]">{streakDays}-day streak</p>
          <p className="text-[10.5px] font-medium text-[#e17100]/70">{streakNote}</p>
        </div>
      </div>
    </div>
  );
}
