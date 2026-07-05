import { AppLayout } from "@/components/layout/app-layout";
import { StatsRow } from "@/components/dashboard/stats-row";
import { LearningHeader } from "@/components/learning/learning-header";
import { WeeklyHoursChart } from "@/components/learning/weekly-hours-chart";
import { CoursesCard } from "@/components/learning/courses-card";
import { NotesCard } from "@/components/learning/notes-card";
import { streak } from "@/lib/mock/dashboard";
import { courses, learningStats, weeklyHours, weeklyHoursTotal } from "@/lib/mock/learning";

const currentUser = { name: "Alex Chen", status: "Open to roles", initials: "AC" };

export default function LearningPage() {
  return (
    <AppLayout user={currentUser} streakDays={streak.days} hasUnreadNotifications>
      <div className="flex flex-col gap-6">
        <LearningHeader />

        <StatsRow stats={learningStats} />

        <WeeklyHoursChart data={weeklyHours} totalLabel={weeklyHoursTotal} />

        <CoursesCard courses={courses} />

        <NotesCard />
      </div>
    </AppLayout>
  );
}
