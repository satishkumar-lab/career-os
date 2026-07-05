import type { ContentBreakdownItem } from "@/components/instagram/types";

function ContentCard({ item }: { item: ContentBreakdownItem }) {
  const Icon = item.icon;

  return (
    <div
      className="flex flex-col items-center rounded-2xl border border-[rgba(0,0,0,0.06)] p-5 shadow-[0px_1px_1.5px_rgba(0,0,0,0.04)]"
      style={{ backgroundColor: item.cardBg }}
    >
      <span
        className="flex size-11 items-center justify-center rounded-2xl"
        style={{ backgroundColor: item.iconBg }}
      >
        <Icon className="size-[18px]" style={{ color: item.iconColor }} />
      </span>
      <p className="mt-3 text-[28px] leading-none font-medium text-foreground">{item.count}</p>
      <p className="mt-0.5 text-[13px] font-medium text-foreground/70">{item.label}</p>
      <p className="mt-1 text-[11.5px] font-medium text-muted-foreground">{item.avgReachLabel}</p>
    </div>
  );
}

export function ContentBreakdown({ items }: { items: ContentBreakdownItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <ContentCard key={item.id} item={item} />
      ))}
    </div>
  );
}
