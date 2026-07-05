"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { BarChart3, Clock, Cloud, Users, type LucideIcon } from "lucide-react";

import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Course } from "@/components/learning/types";

const courseIcons: Record<Course["icon"], LucideIcon> = {
  analytics: BarChart3,
  leadership: Users,
  cloud: Cloud,
};

export interface CoursesCardProps {
  courses: Course[];
  className?: string;
}

function CourseRow({ course }: { course: Course }) {
  const Icon = courseIcons[course.icon];

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border px-4 py-2.5">
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: course.tint }}
      >
        <Icon className="size-3.5" style={{ color: course.color }} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-medium text-foreground">{course.title}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11.5px] font-medium text-muted-foreground">
          <Badge
            className="rounded-full border-transparent px-1.5 py-0 text-[10px] font-medium"
            style={{ backgroundColor: `${course.color}14`, color: course.color }}
          >
            {course.provider}
          </Badge>
          <span className="text-muted-foreground/30">·</span>
          <span>{course.moduleLabel}</span>
          <span className="text-muted-foreground/30">·</span>
          <span className="flex items-center gap-1">
            <Clock className="size-2.5" />
            {course.timeLeftLabel}
          </span>
        </div>
        <ProgressPrimitive.Root value={course.percent} className="mt-1.5 block">
          <ProgressPrimitive.Track
            className="relative flex h-1.5 w-full items-center overflow-hidden rounded-full"
            style={{ backgroundColor: course.tint }}
          >
            <ProgressPrimitive.Indicator
              className="h-full rounded-full transition-all"
              style={{ backgroundColor: course.color }}
            />
          </ProgressPrimitive.Track>
        </ProgressPrimitive.Root>
      </div>

      <p className="shrink-0 font-mono text-sm font-medium" style={{ color: course.color }}>
        {course.percent}%
      </p>
    </div>
  );
}

export function CoursesCard({ courses, className }: CoursesCardProps) {
  const active = courses.filter((course) => course.status === "active");
  const completed = courses.filter((course) => course.status === "completed");

  return (
    <Tabs defaultValue="active">
      <DashboardCard
        title="Courses"
        className={className}
        action={
          <TabsList className="h-auto gap-1 rounded-2xl bg-secondary p-1">
            <TabsTrigger
              value="active"
              className="rounded-xl px-3.5 py-1.5 text-[12.5px] font-medium text-muted-foreground capitalize data-active:bg-white data-active:text-foreground data-active:shadow-sm"
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="rounded-xl px-3.5 py-1.5 text-[12.5px] font-medium text-muted-foreground capitalize data-active:bg-white data-active:text-foreground data-active:shadow-sm"
            >
              Completed
            </TabsTrigger>
          </TabsList>
        }
      >
        <TabsContent value="active" className="flex flex-col gap-2">
          {active.map((course) => (
            <CourseRow key={course.id} course={course} />
          ))}
        </TabsContent>
        <TabsContent value="completed" className="flex flex-col gap-2">
          {completed.map((course) => (
            <CourseRow key={course.id} course={course} />
          ))}
        </TabsContent>
      </DashboardCard>
    </Tabs>
  );
}
