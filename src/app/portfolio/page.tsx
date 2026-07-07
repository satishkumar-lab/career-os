import { AppLayout } from "@/components/layout/app-layout";
import { PortfolioPageContent } from "@/components/portfolio/portfolio-page-content";
import { streak } from "@/lib/mock/dashboard";

const currentUser = { name: "Alex Chen", status: "Open to roles", initials: "AC" };

export default function PortfolioPage() {
  return (
    <AppLayout user={currentUser} streakDays={streak.days} hasUnreadNotifications>
      <PortfolioPageContent />
    </AppLayout>
  );
}
