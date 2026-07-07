"use client";

import { useMemo, useState } from "react";

import { ProjectFormModal } from "@/components/projects/project-form-modal";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import { ProjectsHeader } from "@/components/projects/projects-header";
import { StatsRow } from "@/components/dashboard/stats-row";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ToastProvider, useToast } from "@/components/shared/toast-provider";
import {
  addProject,
  archiveProject,
  buildProjectStats,
  editProject,
  findPersistedProject,
  removeProject,
  restoreProject,
  setProjectFavourite,
  toProjects,
  type ProjectInput,
  type PersistedProject,
} from "@/lib/projects/storage";
import { useProjectsState } from "@/lib/projects/use-projects-state";
import { usePageSearch } from "@/lib/search/search-context";
import { filterPersistedProjects } from "@/lib/search/page-filters";

function ProjectsPageInner() {
  const [state, setState] = useProjectsState();
  const { normalizedQuery, isSearchActive } = usePageSearch();
  const { showToast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PersistedProject | undefined>();
  const [deleteProject, setDeleteProject] = useState<PersistedProject | undefined>();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const projects = useMemo(() => {
    if (!state) {
      return [];
    }

    const filtered = filterPersistedProjects(state.projects, normalizedQuery);
    const activeProjects = toProjects(filtered.filter((project) => !project.archived));
    const archivedProjects = toProjects(filtered.filter((project) => project.archived));

    return [...activeProjects, ...archivedProjects];
  }, [state, normalizedQuery]);

  if (!state) {
    return null;
  }

  const stats = buildProjectStats(state);

  const handleAddProject = () => {
    setEditingProject(undefined);
    setFormOpen(true);
  };

  const handleEditProject = (id: string) => {
    const project = findPersistedProject(state, id);

    if (!project) {
      return;
    }

    setEditingProject(project);
    setFormOpen(true);
  };

  const handleSaveProject = (input: ProjectInput) => {
    if (editingProject) {
      setState((current) => (current ? editProject(current, editingProject.id, input) : current));
      showToast("Project updated successfully.");
      return;
    }

    setState((current) => (current ? addProject(current, input) : current));
    showToast("Project added successfully.");
  };

  const handleDeleteRequest = (id: string) => {
    const project = findPersistedProject(state, id);

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

    setState((current) => (current ? removeProject(current, deleteProject.id) : current));
    showToast("Project deleted successfully.");
    setDeleteOpen(false);
    setDeleteProject(undefined);
  };

  const handleArchive = (id: string) => {
    setState((current) => (current ? archiveProject(current, id) : current));
    showToast("Project archived successfully.");
  };

  const handleRestore = (id: string) => {
    setState((current) => (current ? restoreProject(current, id) : current));
    showToast("Project restored successfully.");
  };

  const handleToggleFavourite = (id: string) => {
    const project = findPersistedProject(state, id);

    if (!project) {
      return;
    }

    const favourite = !project.favourite;
    setState((current) => (current ? setProjectFavourite(current, id, favourite) : current));
    showToast(favourite ? "Project added to favourites." : "Project removed from favourites.");
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <ProjectsHeader onAddProject={handleAddProject} />

        <StatsRow stats={stats} />

        <ProjectsGrid
          projects={projects}
          isSearchEmpty={isSearchActive}
          onEdit={handleEditProject}
          onDelete={handleDeleteRequest}
          onArchive={handleArchive}
          onRestore={handleRestore}
          onToggleFavourite={handleToggleFavourite}
        />
      </div>

      <ProjectFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        project={editingProject}
        onSave={handleSaveProject}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete project?"
        description={
          deleteProject
            ? `This will permanently remove "${deleteProject.name}" from your projects.`
            : "This will permanently remove this project."
        }
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export function ProjectsPageContent() {
  return (
    <ToastProvider>
      <ProjectsPageInner />
    </ToastProvider>
  );
}
