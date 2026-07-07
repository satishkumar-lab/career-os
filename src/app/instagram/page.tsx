import { AppLayout } from "@/components/layout/app-layout";
import { InstagramPageContent } from "@/components/instagram/instagram-page-content";
import { streak } from "@/lib/mock/dashboard";

const currentUser = { name: "Alex Chen", status: "Open to roles", initials: "AC" };

export default function InstagramPage() {
  return (
    <AppLayout user={currentUser} streakDays={streak.days} hasUnreadNotifications>
      <InstagramPageContent />
    </AppLayout>
  );
}
