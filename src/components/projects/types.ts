export type ProjectStatus = "Live" | "Building";

export interface Project {
  id: string;
  name: string;
  startedLabel: string;
  description: string;
  status: ProjectStatus;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  color: string;
  tint: string;
}
