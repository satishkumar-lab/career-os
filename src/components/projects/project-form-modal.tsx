"use client";

import { useEffect, useMemo, useState } from "react";

import type { ProjectStatus } from "@/components/projects/types";
import { FormModal } from "@/components/shared/form-modal";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { projectFormSchema, projectStatuses, techStackOptions } from "@/lib/projects/constants";
import type { ProjectInput, PersistedProject } from "@/lib/projects/storage";
import { projectToInput } from "@/lib/projects/storage";
import { hasValidationErrors, validateFields } from "@/lib/validation/form-validation";

const emptyForm: ProjectInput = {
  name: "",
  description: "",
  status: "Planning",
  startDate: "",
  endDate: "",
  techStack: [],
  githubUrl: "",
  liveUrl: "",
  thumbnail: { type: "none" },
  favourite: false,
  archived: false,
  notes: "",
};

export interface ProjectFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: PersistedProject;
  onSave: (input: ProjectInput) => void;
}

export function ProjectFormModal({ open, onOpenChange, project, onSave }: ProjectFormModalProps) {
  const [form, setForm] = useState<ProjectInput>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const stackOptions = useMemo(() => {
    const options = new Set(techStackOptions);

    for (const tech of form.techStack) {
      options.add(tech);
    }

    return Array.from(options);
  }, [form.techStack]);

  useEffect(() => {
    if (open) {
      setForm(project ? projectToInput(project) : emptyForm);
      setErrors({});
    }
  }, [open, project]);

  const handleSubmit = () => {
    const nextErrors = validateFields(
      {
        name: form.name,
        status: form.status,
        githubUrl: form.githubUrl,
        liveUrl: form.liveUrl,
      },
      projectFormSchema
    );

    setErrors(nextErrors);

    if (hasValidationErrors(nextErrors)) {
      return;
    }

    onSave(form);
    onOpenChange(false);
  };

  const updateField = <K extends keyof ProjectInput>(field: K, value: ProjectInput[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const toggleTechStack = (tech: string, checked: boolean) => {
    setForm((current) => ({
      ...current,
      techStack: checked
        ? [...current.techStack, tech]
        : current.techStack.filter((item) => item !== tech),
    }));
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={project ? "Edit Project" : "Add Project"}
      description={project ? "Update project details." : "Add a new project to track."}
      submitLabel={project ? "Save Changes" : "Add Project"}
      onSubmit={handleSubmit}
      bodyClassName="max-h-[min(60vh,520px)] overflow-y-auto pr-1"
    >
      <div className="grid gap-2">
        <Label htmlFor="project-name">Project Name</Label>
        <Input
          id="project-name"
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="project-description">Description</Label>
        <Textarea
          id="project-description"
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="What this project does..."
          className="min-h-[72px] resize-none"
        />
      </div>

      <div className="grid gap-2">
        <Label>Status</Label>
        <Select
          value={form.status}
          onValueChange={(value) => {
            if (value) {
              updateField("status", value as ProjectStatus);
            }
          }}
        >
          <SelectTrigger className="w-full" aria-invalid={Boolean(errors.status)}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {projectStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.status && <p className="text-xs text-destructive">{errors.status}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="project-start-date">Start Date</Label>
        <Input
          id="project-start-date"
          value={form.startDate}
          onChange={(event) => updateField("startDate", event.target.value)}
          placeholder="Mar 2025"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="project-end-date">End Date</Label>
        <Input
          id="project-end-date"
          value={form.endDate}
          onChange={(event) => updateField("endDate", event.target.value)}
          placeholder="Optional"
        />
      </div>

      <div className="grid gap-2">
        <Label>Tech Stack</Label>
        <div className="grid grid-cols-2 gap-2 rounded-lg border border-border p-3">
          {stackOptions.map((tech) => (
            <label key={tech} className="flex items-center gap-2 text-sm text-foreground">
              <Checkbox
                checked={form.techStack.includes(tech)}
                onCheckedChange={(checked) => toggleTechStack(tech, checked === true)}
              />
              <span>{tech}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="project-github-url">GitHub URL</Label>
        <Input
          id="project-github-url"
          type="url"
          value={form.githubUrl}
          onChange={(event) => updateField("githubUrl", event.target.value)}
          placeholder="https://github.com/..."
          aria-invalid={Boolean(errors.githubUrl)}
        />
        {errors.githubUrl && <p className="text-xs text-destructive">{errors.githubUrl}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="project-live-url">Live URL</Label>
        <Input
          id="project-live-url"
          type="url"
          value={form.liveUrl}
          onChange={(event) => updateField("liveUrl", event.target.value)}
          placeholder="https://example.com"
          aria-invalid={Boolean(errors.liveUrl)}
        />
        {errors.liveUrl && <p className="text-xs text-destructive">{errors.liveUrl}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="project-notes">Notes</Label>
        <Textarea
          id="project-notes"
          value={form.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          placeholder="Project notes..."
          className="min-h-[72px] resize-none"
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="project-favourite">Favourite</Label>
        <Switch
          id="project-favourite"
          checked={form.favourite}
          onCheckedChange={(checked) => updateField("favourite", checked)}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="project-archived">Archived</Label>
        <Switch
          id="project-archived"
          checked={form.archived}
          onCheckedChange={(checked) => updateField("archived", checked)}
        />
      </div>
    </FormModal>
  );
}
