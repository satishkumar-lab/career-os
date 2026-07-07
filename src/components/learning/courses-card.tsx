"use client";

import {
  BarChart3,
  CheckCircle2,
  Clock,
  Cloud,
  MoreHorizontal,
  Pencil,
  Trash2,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { SearchEmptyState } from "@/components/shared/search-empty-state";
import { AnimatedProgressFill } from "@/components/ui/animated-progress-fill";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { subtleSurfaceHover, transitionFast, contentCardRadius } from "@/lib/interaction-styles";
import type { Course } from "@/components/learning/types";

const courseIcons: Record<Course["icon"], LucideIcon> = {
  analytics: BarChart3,
  leadership: Users,
  cloud: Cloud,
};

export interface CoursesCardProps {
  courses: Course[];
  isSearchEmpty?: boolean;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
  onUpdateProgress: (course: Course) => void;
  onMarkComplete: (course: Course) => void;
  className?: string;
}

interface CourseRowProps {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
  onUpdateProgress: (course: Course) => void;
  onMarkComplete: (course: Course) => void;
}

function CourseRow({ course, onEdit, onDelete, onUpdateProgress, onMarkComplete }: CourseRowProps) {
  const Icon = courseIcons[course.icon];
  const isActive = course.status === "active";

  return (
    <div className={cn("flex items-center gap-3 border border-border px-4 py-2.5", contentCardRadius, subtleSurfaceHover)}>
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
        <div
          className="relative mt-1.5 flex h-1.5 w-full overflow-hidden rounded-full"
          style={{ backgroundColor: course.tint }}
        >
          <AnimatedProgressFill value={course.percent} style={{ backgroundColor: course.color }} />
        </div>
      </div>

      <p className="shrink-0 font-mono text-sm font-medium" style={{ color: course.color }}>
        {course.percent}%
      </p>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-7 shrink-0 text-muted-foreground"
              aria-label={`Actions for ${course.title}`}
            />
          }
        >
          <MoreHorizontal className="size-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(course)}>
            <Pencil className="size-3.5" />
            Edit
          </DropdownMenuItem>
          {isActive && (
            <>
              <DropdownMenuItem onClick={() => onUpdateProgress(course)}>
                <TrendingUp className="size-3.5" />
                Update Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMarkComplete(course)}>
                <CheckCircle2 className="size-3.5" />
                Mark Complete
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => onDelete(course)}>
            <Trash2 className="size-3.5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function CoursesCard({
  courses,
  isSearchEmpty = false,
  onEdit,
  onDelete,
  onUpdateProgress,
  onMarkComplete,
  className,
}: CoursesCardProps) {
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
              className={cn(
                "rounded-xl px-3.5 py-1.5 text-[12.5px] font-medium text-muted-foreground capitalize",
                transitionFast,
                "hover:text-foreground data-active:bg-white data-active:text-foreground data-active:shadow-sm"
              )}
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className={cn(
                "rounded-xl px-3.5 py-1.5 text-[12.5px] font-medium text-muted-foreground capitalize",
                transitionFast,
                "hover:text-foreground data-active:bg-white data-active:text-foreground data-active:shadow-sm"
              )}
            >
              Completed
            </TabsTrigger>
          </TabsList>
        }
      >
        {isSearchEmpty && courses.length === 0 ? (
          <SearchEmptyState />
        ) : (
          <>
        <TabsContent value="active" className="flex flex-col gap-2">
          {active.map((course) => (
            <CourseRow
              key={course.id}
              course={course}
              onEdit={onEdit}
              onDelete={onDelete}
              onUpdateProgress={onUpdateProgress}
              onMarkComplete={onMarkComplete}
            />
          ))}
        </TabsContent>
        <TabsContent value="completed" className="flex flex-col gap-2">
          {completed.map((course) => (
            <CourseRow
              key={course.id}
              course={course}
              onEdit={onEdit}
              onDelete={onDelete}
              onUpdateProgress={onUpdateProgress}
              onMarkComplete={onMarkComplete}
            />
          ))}
        </TabsContent>
          </>
        )}
      </DashboardCard>
    </Tabs>
  );
}
