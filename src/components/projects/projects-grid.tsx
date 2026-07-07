import { ProjectCard } from "@/components/projects/project-card";
import { SearchEmptyState } from "@/components/shared/search-empty-state";
import type { Project } from "@/components/projects/types";

export interface ProjectsGridProps {
  projects: Project[];
  isSearchEmpty?: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onToggleFavourite: (id: string) => void;
}

export function ProjectsGrid({
  projects,
  isSearchEmpty = false,
  onEdit,
  onDelete,
  onArchive,
  onRestore,
  onToggleFavourite,
}: ProjectsGridProps) {
  if (isSearchEmpty && projects.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-card shadow-xs">
        <SearchEmptyState />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
          onArchive={onArchive}
          onRestore={onRestore}
          onToggleFavourite={onToggleFavourite}
        />
      ))}
    </div>
  );
}
