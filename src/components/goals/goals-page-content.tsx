"use client";

import { useMemo, useState } from "react";

import { GoalFormModal } from "@/components/goals/goal-form-modal";
import { GoalsHeader } from "@/components/goals/goals-header";
import { GoalsList } from "@/components/goals/goals-list";
import { StatsRow } from "@/components/dashboard/stats-row";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ToastProvider, useToast } from "@/components/shared/toast-provider";
import {
  addGoal,
  archiveGoal,
  buildGoalsStats,
  editGoal,
  findPersistedGoal,
  removeGoal,
  restoreGoal,
  setGoalFavourite,
  toGoals,
  type GoalInput,
  type PersistedGoal,
} from "@/lib/goals/storage";
import { useGoalsState } from "@/lib/goals/use-goals-state";
import { usePageSearch } from "@/lib/search/search-context";
import { filterPersistedGoals } from "@/lib/search/page-filters";

function GoalsPageInner() {
  const [state, setState] = useGoalsState();
  const { normalizedQuery, isSearchActive } = usePageSearch();
  const { showToast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<PersistedGoal | undefined>();
  const [deleteGoal, setDeleteGoal] = useState<PersistedGoal | undefined>();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const goals = useMemo(() => {
    if (!state) {
      return [];
    }

    const filtered = filterPersistedGoals(state.goals, normalizedQuery);
    const activeGoals = toGoals(filtered.filter((goal) => !goal.archived));
    const archivedGoals = toGoals(filtered.filter((goal) => goal.archived));

    return [...activeGoals, ...archivedGoals];
  }, [state, normalizedQuery]);

  if (!state) {
    return null;
  }

  const stats = buildGoalsStats(state);

  const handleAddGoal = () => {
    setEditingGoal(undefined);
    setFormOpen(true);
  };

  const handleEditGoal = (id: string) => {
    const goal = findPersistedGoal(state, id);

    if (!goal) {
      return;
    }

    setEditingGoal(goal);
    setFormOpen(true);
  };

  const handleSaveGoal = (input: GoalInput) => {
    if (editingGoal) {
      setState((current) => (current ? editGoal(current, editingGoal.id, input) : current));
      showToast("Goal updated successfully.");
      return;
    }

    setState((current) => (current ? addGoal(current, input) : current));
    showToast("Goal added successfully.");
  };

  const handleDeleteRequest = (id: string) => {
    const goal = findPersistedGoal(state, id);

    if (!goal) {
      return;
    }

    setDeleteGoal(goal);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteGoal) {
      return;
    }

    setState((current) => (current ? removeGoal(current, deleteGoal.id) : current));
    showToast("Goal deleted successfully.");
    setDeleteOpen(false);
    setDeleteGoal(undefined);
  };

  const handleArchive = (id: string) => {
    setState((current) => (current ? archiveGoal(current, id) : current));
    showToast("Goal archived successfully.");
  };

  const handleRestore = (id: string) => {
    setState((current) => (current ? restoreGoal(current, id) : current));
    showToast("Goal restored successfully.");
  };

  const handleToggleFavourite = (id: string) => {
    const goal = findPersistedGoal(state, id);

    if (!goal) {
      return;
    }

    const favourite = !goal.favourite;
    setState((current) => (current ? setGoalFavourite(current, id, favourite) : current));
    showToast(favourite ? "Goal added to favourites." : "Goal removed from favourites.");
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <GoalsHeader onAddGoal={handleAddGoal} />

        <StatsRow stats={stats} />

        <GoalsList
          goals={goals}
          isSearchEmpty={isSearchActive}
          onEdit={handleEditGoal}
          onDelete={handleDeleteRequest}
          onArchive={handleArchive}
          onRestore={handleRestore}
          onToggleFavourite={handleToggleFavourite}
        />
      </div>

      <GoalFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        goal={editingGoal}
        onSave={handleSaveGoal}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete goal?"
        description={
          deleteGoal
            ? `This will permanently remove "${deleteGoal.goalTitle}" from your goals.`
            : "This will permanently remove this goal."
        }
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export function GoalsPageContent() {
  return (
    <ToastProvider>
      <GoalsPageInner />
    </ToastProvider>
  );
}
