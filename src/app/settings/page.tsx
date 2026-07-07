import { AppLayout } from "@/components/layout/app-layout";
import { AccountSection } from "@/components/settings/account-section";
import { AppearanceSection } from "@/components/settings/appearance-section";
import { CareerPreferencesSection } from "@/components/settings/career-preferences-section";
import { DashboardPreferencesSection } from "@/components/settings/dashboard-preferences-section";
import { DataBackupSection } from "@/components/settings/data-backup-section";
import { IntegrationsSection } from "@/components/settings/integrations-section";
import { NotificationsSection } from "@/components/settings/notifications-section";
import { ProfileSection } from "@/components/settings/profile-section";
import { SettingsHeader } from "@/components/settings/settings-header";
import { streak } from "@/lib/mock/dashboard";
import {
  appearanceSettings,
  careerPreferences,
  dashboardPreferences,
  integrations,
  notificationSettings,
} from "@/lib/mock/settings";

export default function SettingsPage() {
  return (
    <AppLayout streakDays={streak.days} hasUnreadNotifications>
      <div className="flex flex-col gap-6">
        <SettingsHeader />

        <div className="flex flex-col gap-5">
          <ProfileSection />
          <CareerPreferencesSection preferences={careerPreferences} />
          <AppearanceSection settings={appearanceSettings} />
          <NotificationsSection settings={notificationSettings} />
          <DashboardPreferencesSection settings={dashboardPreferences} />
          {false ? <IntegrationsSection items={integrations} /> : null}
          <DataBackupSection />
          <AccountSection />
        </div>
      </div>
    </AppLayout>
  );
}
