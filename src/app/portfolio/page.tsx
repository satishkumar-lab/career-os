import { AppLayout } from "@/components/layout/app-layout";
import { PortfolioPageContent } from "@/components/portfolio/portfolio-page-content";

export default function PortfolioPage() {
  return (
    <AppLayout hasUnreadNotifications>
      <PortfolioPageContent />
    </AppLayout>
  );
}
