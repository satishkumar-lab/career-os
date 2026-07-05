import { AppLayout } from "@/components/layout/app-layout";
import { StatsRow } from "@/components/dashboard/stats-row";
import { ContentBreakdown } from "@/components/instagram/content-breakdown";
import { FollowerGrowthCard } from "@/components/instagram/follower-growth-card";
import { InstagramHeader } from "@/components/instagram/instagram-header";
import { streak } from "@/lib/mock/dashboard";
import {
  contentBreakdown,
  followerGrowthData,
  followerGrowthSummary,
  instagramStats,
} from "@/lib/mock/instagram";

const currentUser = { name: "Alex Chen", status: "Open to roles", initials: "AC" };

export default function InstagramPage() {
  return (
    <AppLayout user={currentUser} streakDays={streak.days} hasUnreadNotifications>
      <div className="flex flex-col gap-6">
        <InstagramHeader />

        <StatsRow stats={instagramStats} />

        <FollowerGrowthCard summary={followerGrowthSummary} data={followerGrowthData} />

        <ContentBreakdown items={contentBreakdown} />
      </div>
    </AppLayout>
  );
}
