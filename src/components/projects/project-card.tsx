import { Code2, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/projects/github-icon";
import type { Project, ProjectStatus } from "@/components/projects/types";

const statusStyles: Record<ProjectStatus, { bg: string; text: string }> = {
  Live: { bg: "#f0fdf4", text: "#10b981" },
  Building: { bg: "#eef0ff", text: "#5b5bd6" },
};

export function ProjectCard({ project }: { project: Project }) {
  const status = statusStyles[project.status];

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[0px_1px_1.5px_rgba(0,0,0,0.04),0px_2px_4px_rgba(0,0,0,0.02)]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: project.tint }}
          >
            <Code2 className="size-4.5" style={{ color: project.color }} />
          </span>
          <div>
            <p className="text-[15px] font-medium text-foreground">{project.name}</p>
            <p className="text-[11.5px] font-medium text-muted-foreground">{project.startedLabel}</p>
          </div>
        </div>
        <Badge
          className="rounded-full border-transparent px-2.5 py-1 text-[11px] font-medium"
          style={{ backgroundColor: status.bg, color: status.text }}
        >
          {project.status}
        </Badge>
      </div>

      <p className="mt-3 text-[13px] font-medium text-muted-foreground">{project.description}</p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
        {project.githubUrl && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto gap-1.5 rounded-xl px-3 py-1.5 text-[12.5px] font-medium text-muted-foreground"
          >
            <GithubIcon className="size-3.5" />
            GitHub
          </Button>
        )}
        {project.liveUrl && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto gap-1.5 rounded-xl px-3 py-1.5 text-[12.5px] font-medium text-muted-foreground"
          >
            <ExternalLink className="size-3" />
            Live
          </Button>
        )}
      </div>
    </div>
  );
}
