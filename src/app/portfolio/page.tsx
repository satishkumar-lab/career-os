import { AppLayout } from "@/components/layout/app-layout";
import { PortfolioPageContent } from "@/components/portfolio/portfolio-page-content";
import { streak } from "@/lib/mock/dashboard";

export default function PortfolioPage() {
  return (
    <AppLayout streakDays={streak.days} hasUnreadNotifications>
      <PortfolioPageContent />
    </AppLayout>
  );
}
