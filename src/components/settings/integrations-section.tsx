import { SettingsSectionCard } from "@/components/settings/settings-section-card";
import type { IntegrationSetting } from "@/components/settings/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function IntegrationsSection({ items }: { items: IntegrationSetting[] }) {
  return (
    <SettingsSectionCard
      title="Integrations"
      description="Connect external tools to sync data automatically."
      comingSoon
    >
      {items.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            "flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between",
            index !== items.length - 1 && "border-b border-border"
          )}
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-foreground">{item.name}</p>
              <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-[10.5px] font-medium">
                Coming Soon
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
          </div>
          <Button variant="outline" className="rounded-2xl" disabled>
            Connect
          </Button>
        </div>
      ))}
    </SettingsSectionCard>
  );
}
