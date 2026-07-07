"use client";

import { useMemo, useState } from "react";

import { PortfolioFormModal } from "@/components/portfolio/portfolio-form-modal";
import { PortfolioHeader } from "@/components/portfolio/portfolio-header";
import { ProjectProgressTable } from "@/components/portfolio/project-progress-table";
import { StatsRow } from "@/components/dashboard/stats-row";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ToastProvider, useToast } from "@/components/shared/toast-provider";
import {
  addPortfolioProject,
  archivePortfolioProject,
  buildPortfolioStats,
  editPortfolioProject,
  findPersistedPortfolioProject,
  removePortfolioProject,
  restorePortfolioProject,
  setPortfolioFavourite,
  toPortfolioProjects,
  type PersistedPortfolioProject,
  type PortfolioProjectInput,
} from "@/lib/portfolio/storage";
import { usePortfolioState } from "@/lib/portfolio/use-portfolio-state";
import { usePageSearch } from "@/lib/search/search-context";
import { filterPersistedPortfolioProjects } from "@/lib/search/page-filters";

function PortfolioPageInner() {
  const [state, setState] = usePortfolioState();
  const { normalizedQuery, isSearchActive } = usePageSearch();
  const { showToast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PersistedPortfolioProject | undefined>();
  const [deleteProject, setDeleteProject] = useState<PersistedPortfolioProject | undefined>();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const projects = useMemo(() => {
    if (!state) {
      return [];
    }

    const filtered = filterPersistedPortfolioProjects(state.projects, normalizedQuery);
    const activeProjects = toPortfolioProjects(filtered.filter((project) => !project.archived));
    const archivedProjects = toPortfolioProjects(filtered.filter((project) => project.archived));

    return [...activeProjects, ...archivedProjects];
  }, [state, normalizedQuery]);

  if (!state) {
    return null;
  }

  const stats = buildPortfolioStats(state);

  const handleAddProject = () => {
    setEditingProject(undefined);
    setFormOpen(true);
  };

  const handleEditProject = (id: string) => {
    const project = findPersistedPortfolioProject(state, id);

    if (!project) {
      return;
    }

    setEditingProject(project);
    setFormOpen(true);
  };

  const handleSaveProject = (input: PortfolioProjectInput) => {
    if (editingProject) {
      setState((current) =>
        current ? editPortfolioProject(current, editingProject.id, input) : current
      );
      showToast("Portfolio project updated successfully.");
      return;
    }

    setState((current) => (current ? addPortfolioProject(current, input) : current));
    showToast("Portfolio project added successfully.");
  };

  const handleDeleteRequest = (id: string) => {
    const project = findPersistedPortfolioProject(state, id);

    if (!project) {
      return;
    }

    setDeleteProject(project);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteProject) {
      return;
    }

    setState((current) =>
      current ? removePortfolioProject(current, deleteProject.id) : current
    );
    showToast("Portfolio project deleted successfully.");
    setDeleteOpen(false);
    setDeleteProject(undefined);
  };

  const handleArchive = (id: string) => {
    setState((current) => (current ? archivePortfolioProject(current, id) : current));
    showToast("Portfolio project archived successfully.");
  };

  const handleRestore = (id: string) => {
    setState((current) => (current ? restorePortfolioProject(current, id) : current));
    showToast("Portfolio project restored successfully.");
  };

  const handleToggleFavourite = (id: string) => {
    const project = findPersistedPortfolioProject(state, id);

    if (!project) {
      return;
    }

    const favourite = !project.favourite;
    setState((current) => (current ? setPortfolioFavourite(current, id, favourite) : current));
    showToast(
      favourite ? "Portfolio project added to favourites." : "Portfolio project removed from favourites."
    );
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <PortfolioHeader onAddProject={handleAddProject} />

        <StatsRow stats={stats} />

        <ProjectProgressTable
          projects={projects}
          isSearchEmpty={isSearchActive}
          onEdit={handleEditProject}
          onDelete={handleDeleteRequest}
          onArchive={handleArchive}
          onRestore={handleRestore}
          onToggleFavourite={handleToggleFavourite}
        />
      </div>

      <PortfolioFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        project={editingProject}
        onSave={handleSaveProject}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete portfolio project?"
        description={
          deleteProject
            ? `This will permanently remove "${deleteProject.title}" from your portfolio.`
            : "This will permanently remove this portfolio project."
        }
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export function PortfolioPageContent() {
  return (
    <ToastProvider>
      <PortfolioPageInner />
    </ToastProvider>
  );
}
