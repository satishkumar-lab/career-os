"use client";

import { useMemo, useState } from "react";

import type { Course } from "@/components/learning/types";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { CourseFormModal } from "@/components/learning/course-form-modal";
import { ProgressUpdateModal } from "@/components/learning/progress-update-modal";
import { CoursesCard } from "@/components/learning/courses-card";
import { LearningHeader } from "@/components/learning/learning-header";
import { NotesCard } from "@/components/learning/notes-card";
import { WeeklyHoursChart } from "@/components/learning/weekly-hours-chart";
import { StatsRow } from "@/components/dashboard/stats-row";
import { ToastProvider, useToast } from "@/components/shared/toast-provider";
import {
  addCourse,
  buildLearningStats,
  editCourse,
  markCourseCompleted,
  removeCourse,
  updateCourseProgress,
  updateLearningNotes,
  type CourseInput,
} from "@/lib/learning/storage";
import { useLearningState } from "@/lib/learning/use-learning-state";
import { usePageSearch } from "@/lib/search/search-context";
import { filterCourses } from "@/lib/search/page-filters";

function LearningPageInner() {
  const [state, setState] = useLearningState();
  const { normalizedQuery, isSearchActive } = usePageSearch();
  const { showToast } = useToast();

  const [courseFormOpen, setCourseFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | undefined>();
  const [progressCourse, setProgressCourse] = useState<Course | undefined>();
  const [progressOpen, setProgressOpen] = useState(false);
  const [deleteCourse, setDeleteCourse] = useState<Course | undefined>();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const filteredCourses = useMemo(
    () => (state ? filterCourses(state.courses, normalizedQuery) : []),
    [state, normalizedQuery]
  );

  if (!state) {
    return null;
  }

  const stats = buildLearningStats(state);

  const handleAddCourse = () => {
    setEditingCourse(undefined);
    setCourseFormOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseFormOpen(true);
  };

  const handleSaveCourse = (input: CourseInput) => {
    if (editingCourse) {
      setState((current) => (current ? editCourse(current, editingCourse.id, input) : current));
      showToast("Course updated successfully.");
      return;
    }

    setState((current) => (current ? addCourse(current, input) : current));
    showToast("Course added successfully.");
  };

  const handleUpdateProgress = (course: Course) => {
    setProgressCourse(course);
    setProgressOpen(true);
  };

  const handleSaveProgress = (percent: number) => {
    if (!progressCourse) {
      return;
    }

    setState((current) =>
      current ? updateCourseProgress(current, progressCourse.id, percent) : current
    );
  };

  const handleMarkComplete = (course: Course) => {
    setState((current) => (current ? markCourseCompleted(current, course.id) : current));
  };

  const handleDeleteRequest = (course: Course) => {
    setDeleteCourse(course);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteCourse) {
      return;
    }

    setState((current) => (current ? removeCourse(current, deleteCourse.id) : current));
    showToast("Course deleted successfully.");
    setDeleteOpen(false);
    setDeleteCourse(undefined);
  };

  const handleNotesChange = (notes: string) => {
    setState((current) => (current ? updateLearningNotes(current, notes) : current));
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <LearningHeader onAddCourse={handleAddCourse} />

        <StatsRow stats={stats} />

        <WeeklyHoursChart data={state.weeklyHours} totalLabel={state.weeklyHoursTotal} />

        <CoursesCard
          courses={filteredCourses}
          isSearchEmpty={isSearchActive}
          onEdit={handleEditCourse}
          onDelete={handleDeleteRequest}
          onUpdateProgress={handleUpdateProgress}
          onMarkComplete={handleMarkComplete}
        />

        <NotesCard notes={state.notes} onNotesChange={handleNotesChange} />
      </div>

      <CourseFormModal
        open={courseFormOpen}
        onOpenChange={setCourseFormOpen}
        course={editingCourse}
        onSave={handleSaveCourse}
      />

      <ProgressUpdateModal
        open={progressOpen}
        onOpenChange={setProgressOpen}
        course={progressCourse}
        onSave={handleSaveProgress}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete course?"
        description={
          deleteCourse
            ? `This will permanently remove "${deleteCourse.title}" from your courses.`
            : "This will permanently remove this course."
        }
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export function LearningPageContent() {
  return (
    <ToastProvider>
      <LearningPageInner />
    </ToastProvider>
  );
}
