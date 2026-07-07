export type ProjectStatus = "Planning" | "Building" | "Live" | "Completed" | "Archived";

export interface Project {
  id: string;
  name: string;
  startedLabel: string;
  description: string;
  status: ProjectStatus;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  favourite: boolean;
  archived: boolean;
  color: string;
  tint: string;
}
