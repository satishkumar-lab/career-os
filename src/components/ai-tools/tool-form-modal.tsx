"use client";

import { useEffect, useState } from "react";

import type { AiToolCategory, AiToolLevel, AiToolStatus } from "@/components/ai-tools/types";
import { FormModal } from "@/components/shared/form-modal";
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
  aiToolCategories,
  aiToolFormSchema,
  aiToolIconPresets,
  aiToolLevels,
  aiToolStatuses,
  type AiToolIconKey,
} from "@/lib/ai-tools/constants";
import type { AiToolInput, PersistedAiTool } from "@/lib/ai-tools/storage";
import { toolToInput } from "@/lib/ai-tools/storage";
import { hasValidationErrors, validateFields } from "@/lib/validation/form-validation";

const emptyForm: AiToolInput = {
  name: "",
  category: "AI Assistant",
  lastUsedLabel: "",
  level: "Beginner",
  percent: 0,
  projectsBuilt: 0,
  website: "",
  logo: { type: "preset", iconKey: "claude" },
  note: "",
  favourite: false,
  status: "active",
};

function getPresetIconKey(logo: AiToolInput["logo"]): AiToolIconKey {
  return logo.type === "preset" ? logo.iconKey : "claude";
}

export interface ToolFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tool?: PersistedAiTool;
  onSave: (input: AiToolInput) => void;
}

export function ToolFormModal({ open, onOpenChange, tool, onSave }: ToolFormModalProps) {
  const [form, setForm] = useState<AiToolInput>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setForm(tool ? toolToInput(tool) : emptyForm);
      setErrors({});
    }
  }, [open, tool]);

  const handleSubmit = () => {
    const nextErrors = validateFields(
      {
        name: form.name,
        category: form.category,
        percent: form.percent,
        projectsBuilt: form.projectsBuilt,
        website: form.website,
      },
      aiToolFormSchema
    );

    setErrors(nextErrors);

    if (hasValidationErrors(nextErrors)) {
      return;
    }

    onSave({
      ...form,
      percent: Number(form.percent),
      projectsBuilt: Number(form.projectsBuilt),
    });
    onOpenChange(false);
  };

  const updateField = <K extends keyof AiToolInput>(field: K, value: AiToolInput[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateLogoPreset = (iconKey: AiToolIconKey) => {
    updateField("logo", { type: "preset", iconKey });
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={tool ? "Edit Tool" : "Add Tool"}
      description={tool ? "Update tool details." : "Add a new AI tool to track."}
      submitLabel={tool ? "Save Changes" : "Add Tool"}
      onSubmit={handleSubmit}
      bodyClassName="max-h-[min(60vh,520px)] overflow-y-auto pr-1"
    >
      <div className="grid gap-2">
        <Label htmlFor="tool-name">Name</Label>
        <Input
          id="tool-name"
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>

      <div className="grid gap-2">
        <Label>Category</Label>
        <Select
          value={form.category}
          onValueChange={(value) => {
            if (value) {
              updateField("category", value as AiToolCategory);
            }
          }}
        >
          <SelectTrigger className="w-full" aria-invalid={Boolean(errors.category)}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {aiToolCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="tool-last-used">Last Used</Label>
        <Input
          id="tool-last-used"
          value={form.lastUsedLabel}
          onChange={(event) => updateField("lastUsedLabel", event.target.value)}
          placeholder="Today"
        />
      </div>

      <div className="grid gap-2">
        <Label>Level</Label>
        <Select
          value={form.level}
          onValueChange={(value) => {
            if (value) {
              updateField("level", value as AiToolLevel);
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {aiToolLevels.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="tool-percent">Mastery Progress (%)</Label>
        <Input
          id="tool-percent"
          type="number"
          min={0}
          max={100}
          value={form.percent}
          onChange={(event) => updateField("percent", Number(event.target.value))}
          aria-invalid={Boolean(errors.percent)}
        />
        {errors.percent && <p className="text-xs text-destructive">{errors.percent}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="tool-projects-built">Projects Built</Label>
        <Input
          id="tool-projects-built"
          type="number"
          min={0}
          value={form.projectsBuilt}
          onChange={(event) => updateField("projectsBuilt", Number(event.target.value))}
          aria-invalid={Boolean(errors.projectsBuilt)}
        />
        {errors.projectsBuilt && <p className="text-xs text-destructive">{errors.projectsBuilt}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="tool-website">Official Website</Label>
        <Input
          id="tool-website"
          type="url"
          value={form.website}
          onChange={(event) => updateField("website", event.target.value)}
          placeholder="https://example.com"
          aria-invalid={Boolean(errors.website)}
        />
        {errors.website && <p className="text-xs text-destructive">{errors.website}</p>}
      </div>

      <div className="grid gap-2">
        <Label>Logo</Label>
        <Select value={getPresetIconKey(form.logo)} onValueChange={(value) => value && updateLogoPreset(value as AiToolIconKey)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(aiToolIconPresets) as AiToolIconKey[]).map((iconKey) => (
              <SelectItem key={iconKey} value={iconKey}>
                {aiToolIconPresets[iconKey].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="tool-note">Notes</Label>
        <Textarea
          id="tool-note"
          value={form.note}
          onChange={(event) => updateField("note", event.target.value)}
          placeholder="How you use this tool..."
          className="min-h-[72px] resize-none"
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="tool-favourite">Favourite</Label>
        <Switch
          id="tool-favourite"
          checked={form.favourite}
          onCheckedChange={(checked) => updateField("favourite", checked)}
        />
      </div>

      <div className="grid gap-2">
        <Label>Status</Label>
        <Select
          value={form.status}
          onValueChange={(value) => {
            if (value) {
              updateField("status", value as AiToolStatus);
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {aiToolStatuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </FormModal>
  );
}
