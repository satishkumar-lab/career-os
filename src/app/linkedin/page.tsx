import { AppLayout } from "@/components/layout/app-layout";
import { StatsRow } from "@/components/dashboard/stats-row";
import { FollowerGrowthCard } from "@/components/linkedin/follower-growth-card";
import { LinkedInHeader } from "@/components/linkedin/linkedin-header";
import { RecentPostsCard } from "@/components/linkedin/recent-posts-card";
import { streak } from "@/lib/mock/dashboard";
import {
  followerGrowthData,
  followerGrowthSummary,
  linkedInPosts,
  linkedInStats,
} from "@/lib/mock/linkedin";

const currentUser = { name: "Alex Chen", status: "Open to roles", initials: "AC" };

export default function LinkedInPage() {
  return (
    <AppLayout user={currentUser} streakDays={streak.days} hasUnreadNotifications>
      <div className="flex flex-col gap-6">
        <LinkedInHeader />

        <StatsRow stats={linkedInStats} />

        <FollowerGrowthCard summary={followerGrowthSummary} data={followerGrowthData} />

        <RecentPostsCard posts={linkedInPosts} />
      </div>
    </AppLayout>
  );
}
