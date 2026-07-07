import { AppLayout } from "@/components/layout/app-layout";
import { InstagramPageContent } from "@/components/instagram/instagram-page-content";
import { streak } from "@/lib/mock/dashboard";

export default function InstagramPage() {
  return (
    <AppLayout streakDays={streak.days} hasUnreadNotifications>
      <InstagramPageContent />
    </AppLayout>
  );
}
