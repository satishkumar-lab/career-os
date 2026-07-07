"use client";

import { useEffect, useMemo, useState } from "react";

import type { PortfolioCategory, PortfolioStatus } from "@/components/portfolio/types";
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
import {
  portfolioCategories,
  portfolioFormSchema,
  portfolioStatuses,
  portfolioTagOptions,
} from "@/lib/portfolio/constants";
import type { PersistedPortfolioProject, PortfolioProjectInput } from "@/lib/portfolio/storage";
import { portfolioProjectToInput } from "@/lib/portfolio/storage";
import { hasValidationErrors, validateFields } from "@/lib/validation/form-validation";

const emptyForm: PortfolioProjectInput = {
  title: "",
  description: "",
  category: "UX Case Study",
  status: "Draft",
  completionDate: "",
  behanceUrl: "",
  dribbbleUrl: "",
  liveWebsiteUrl: "",
  figmaUrl: "",
  thumbnail: { type: "none" },
  tags: [],
  favourite: false,
  archived: false,
  notes: "",
};

export interface PortfolioFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: PersistedPortfolioProject;
  onSave: (input: PortfolioProjectInput) => void;
}

export function PortfolioFormModal({ open, onOpenChange, project, onSave }: PortfolioFormModalProps) {
  const [form, setForm] = useState<PortfolioProjectInput>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const tagOptions = useMemo(() => {
    const options = new Set(portfolioTagOptions);

    for (const tag of form.tags) {
      options.add(tag);
    }

    return Array.from(options);
  }, [form.tags]);

  useEffect(() => {
    if (open) {
      setForm(project ? portfolioProjectToInput(project) : emptyForm);
      setErrors({});
    }
  }, [open, project]);

  const handleSubmit = () => {
    const nextErrors = validateFields(
      {
        title: form.title,
        category: form.category,
        status: form.status,
        behanceUrl: form.behanceUrl,
        dribbbleUrl: form.dribbbleUrl,
        liveWebsiteUrl: form.liveWebsiteUrl,
        figmaUrl: form.figmaUrl,
      },
      portfolioFormSchema
    );

    setErrors(nextErrors);

    if (hasValidationErrors(nextErrors)) {
      return;
    }

    onSave(form);
    onOpenChange(false);
  };

  const updateField = <K extends keyof PortfolioProjectInput>(
    field: K,
    value: PortfolioProjectInput[K]
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const toggleTag = (tag: string, checked: boolean) => {
    setForm((current) => ({
      ...current,
      tags: checked ? [...current.tags, tag] : current.tags.filter((item) => item !== tag),
    }));
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={project ? "Edit Portfolio Project" : "Add Portfolio Project"}
      description={
        project ? "Update portfolio project details." : "Add a new portfolio project to track."
      }
      submitLabel={project ? "Save Changes" : "Add Project"}
      onSubmit={handleSubmit}
      bodyClassName="max-h-[min(60vh,520px)] overflow-y-auto pr-1"
    >
      <div className="grid gap-2">
        <Label htmlFor="portfolio-title">Project Title</Label>
        <Input
          id="portfolio-title"
          value={form.title}
          onChange={(event) => updateField("title", event.target.value)}
          aria-invalid={Boolean(errors.title)}
        />
        {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="portfolio-description">Short Description</Label>
        <Textarea
          id="portfolio-description"
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Brief project summary..."
          className="min-h-[72px] resize-none"
        />
      </div>

      <div className="grid gap-2">
        <Label>Category</Label>
        <Select
          value={form.category}
          onValueChange={(value) => {
            if (value) {
              updateField("category", value as PortfolioCategory);
            }
          }}
        >
          <SelectTrigger className="w-full" aria-invalid={Boolean(errors.category)}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {portfolioCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
      </div>

      <div className="grid gap-2">
        <Label>Status</Label>
        <Select
          value={form.status}
          onValueChange={(value) => {
            if (value) {
              updateField("status", value as PortfolioStatus);
            }
          }}
        >
          <SelectTrigger className="w-full" aria-invalid={Boolean(errors.status)}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {portfolioStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.status && <p className="text-xs text-destructive">{errors.status}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="portfolio-completion-date">Completion Date</Label>
        <Input
          id="portfolio-completion-date"
          value={form.completionDate}
          onChange={(event) => updateField("completionDate", event.target.value)}
          placeholder="Jan 2025"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="portfolio-behance-url">Behance URL</Label>
        <Input
          id="portfolio-behance-url"
          type="url"
          value={form.behanceUrl}
          onChange={(event) => updateField("behanceUrl", event.target.value)}
          placeholder="https://behance.net/..."
          aria-invalid={Boolean(errors.behanceUrl)}
        />
        {errors.behanceUrl && <p className="text-xs text-destructive">{errors.behanceUrl}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="portfolio-dribbble-url">Dribbble URL</Label>
        <Input
          id="portfolio-dribbble-url"
          type="url"
          value={form.dribbbleUrl}
          onChange={(event) => updateField("dribbbleUrl", event.target.value)}
          placeholder="https://dribbble.com/..."
          aria-invalid={Boolean(errors.dribbbleUrl)}
        />
        {errors.dribbbleUrl && <p className="text-xs text-destructive">{errors.dribbbleUrl}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="portfolio-live-url">Live Website URL</Label>
        <Input
          id="portfolio-live-url"
          type="url"
          value={form.liveWebsiteUrl}
          onChange={(event) => updateField("liveWebsiteUrl", event.target.value)}
          placeholder="https://example.com"
          aria-invalid={Boolean(errors.liveWebsiteUrl)}
        />
        {errors.liveWebsiteUrl && (
          <p className="text-xs text-destructive">{errors.liveWebsiteUrl}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="portfolio-figma-url">Figma URL</Label>
        <Input
          id="portfolio-figma-url"
          type="url"
          value={form.figmaUrl}
          onChange={(event) => updateField("figmaUrl", event.target.value)}
          placeholder="https://figma.com/..."
          aria-invalid={Boolean(errors.figmaUrl)}
        />
        {errors.figmaUrl && <p className="text-xs text-destructive">{errors.figmaUrl}</p>}
      </div>

      <div className="grid gap-2">
        <Label>Tags</Label>
        <div className="grid grid-cols-2 gap-2 rounded-lg border border-border p-3">
          {tagOptions.map((tag) => (
            <label key={tag} className="flex items-center gap-2 text-sm text-foreground">
              <Checkbox
                checked={form.tags.includes(tag)}
                onCheckedChange={(checked) => toggleTag(tag, checked === true)}
              />
              <span>{tag}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="portfolio-notes">Notes</Label>
        <Textarea
          id="portfolio-notes"
          value={form.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          placeholder="Portfolio notes..."
          className="min-h-[72px] resize-none"
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="portfolio-favourite">Favourite</Label>
        <Switch
          id="portfolio-favourite"
          checked={form.favourite}
          onCheckedChange={(checked) => updateField("favourite", checked)}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="portfolio-archived">Archived</Label>
        <Switch
          id="portfolio-archived"
          checked={form.archived}
          onCheckedChange={(checked) => updateField("archived", checked)}
        />
      </div>
    </FormModal>
  );
}
