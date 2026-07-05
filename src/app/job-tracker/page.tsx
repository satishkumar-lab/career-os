import { AppLayout } from "@/components/layout/app-layout";
import { StatsRow } from "@/components/dashboard/stats-row";
import { ApplicationsList } from "@/components/job-tracker/applications-list";
import { JobTrackerHeader } from "@/components/job-tracker/job-tracker-header";
import { PipelineCard } from "@/components/job-tracker/pipeline-card";
import { streak } from "@/lib/mock/dashboard";
import { jobApplications, jobTrackerStats, pipelineStages } from "@/lib/mock/job-tracker";

const currentUser = { name: "Alex Chen", status: "Open to roles", initials: "AC" };

export default function JobTrackerPage() {
  return (
    <AppLayout user={currentUser} streakDays={streak.days} hasUnreadNotifications>
      <div className="flex flex-col gap-6">
        <JobTrackerHeader />

        <StatsRow stats={jobTrackerStats} />

        <PipelineCard stages={pipelineStages} />

        <ApplicationsList applications={jobApplications} />
      </div>
    </AppLayout>
  );
}
