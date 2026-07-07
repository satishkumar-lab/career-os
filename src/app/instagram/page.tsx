import { AppLayout } from "@/components/layout/app-layout";
import { InstagramPageContent } from "@/components/instagram/instagram-page-content";

export default function InstagramPage() {
  return (
    <AppLayout hasUnreadNotifications>
      <InstagramPageContent />
    </AppLayout>
  );
}
