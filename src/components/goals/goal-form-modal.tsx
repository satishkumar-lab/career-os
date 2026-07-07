"use client";

import { useEffect, useState } from "react";

import type { GoalCategory, GoalPriority, GoalWorkflowStatus } from "@/components/goals/types";
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
  goalCategories,
  goalFormSchema,
  goalPriorities,
  goalWorkflowStatuses,
} from "@/lib/goals/constants";
import type { GoalInput, PersistedGoal } from "@/lib/goals/storage";
import { goalToInput } from "@/lib/goals/storage";
import { hasValidationErrors, validateFields } from "@/lib/validation/form-validation";

const emptyForm: GoalInput = {
  goalTitle: "",
  category: "Career",
  priority: "Medium",
  status: "Not Started",
  targetDate: "",
  progress: 0,
  notes: "",
  favourite: false,
  archived: false,
};

function parseOptionalNumber(value: string): number {
  const trimmed = value.trim();

  if (trimmed === "") {
    return 0;
  }

  const parsed = Number(trimmed);

  return Number.isNaN(parsed) ? 0 : parsed;
}

export interface GoalFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: PersistedGoal;
  onSave: (input: GoalInput) => void;
}

export function GoalFormModal({ open, onOpenChange, goal, onSave }: GoalFormModalProps) {
  const [form, setForm] = useState<GoalInput>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setForm(goal ? goalToInput(goal) : emptyForm);
      setErrors({});
    }
  }, [open, goal]);

  const handleSubmit = () => {
    const nextErrors = validateFields(
      {
        goalTitle: form.goalTitle,
        category: form.category,
        status: form.status,
        progress: form.progress,
      },
      goalFormSchema
    );

    setErrors(nextErrors);

    if (hasValidationErrors(nextErrors)) {
      return;
    }

    onSave(form);
    onOpenChange(false);
  };

  const updateField = <K extends keyof GoalInput>(field: K, value: GoalInput[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={goal ? "Edit Goal" : "Add Goal"}
      description={goal ? "Update goal details." : "Add a new goal to track."}
      submitLabel={goal ? "Save Changes" : "Add Goal"}
      onSubmit={handleSubmit}
      bodyClassName="max-h-[min(60vh,520px)] overflow-y-auto pr-1"
    >
      <div className="grid gap-2">
        <Label htmlFor="goal-title">Goal Title</Label>
        <Input
          id="goal-title"
          value={form.goalTitle}
          onChange={(event) => updateField("goalTitle", event.target.value)}
          aria-invalid={Boolean(errors.goalTitle)}
        />
        {errors.goalTitle && <p className="text-xs text-destructive">{errors.goalTitle}</p>}
      </div>

      <div className="grid gap-2">
        <Label>Category</Label>
        <Select
          value={form.category}
          onValueChange={(value) => {
            if (value) {
              updateField("category", value as GoalCategory);
            }
          }}
        >
          <SelectTrigger className="w-full" aria-invalid={Boolean(errors.category)}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {goalCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
      </div>

      <div className="grid gap-2">
        <Label>Priority</Label>
        <Select
          value={form.priority}
          onValueChange={(value) => {
            if (value) {
              updateField("priority", value as GoalPriority);
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {goalPriorities.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>Status</Label>
        <Select
          value={form.status}
          onValueChange={(value) => {
            if (value) {
              updateField("status", value as GoalWorkflowStatus);
            }
          }}
        >
          <SelectTrigger className="w-full" aria-invalid={Boolean(errors.status)}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {goalWorkflowStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.status && <p className="text-xs text-destructive">{errors.status}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="goal-target-date">Target Date</Label>
        <Input
          id="goal-target-date"
          value={form.targetDate}
          onChange={(event) => updateField("targetDate", event.target.value)}
          placeholder="Aug 2025"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="goal-progress">Progress</Label>
        <Input
          id="goal-progress"
          type="number"
          min={0}
          max={100}
          value={form.progress}
          onChange={(event) =>
            updateField("progress", parseOptionalNumber(event.target.value))
          }
          aria-invalid={Boolean(errors.progress)}
        />
        {errors.progress && <p className="text-xs text-destructive">{errors.progress}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="goal-notes">Notes</Label>
        <Textarea
          id="goal-notes"
          value={form.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          placeholder="Goal notes..."
          className="min-h-[72px] resize-none"
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="goal-favourite">Favourite</Label>
        <Switch
          id="goal-favourite"
          checked={form.favourite}
          onCheckedChange={(checked) => updateField("favourite", checked)}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="goal-archived">Archived</Label>
        <Switch
          id="goal-archived"
          checked={form.archived}
          onCheckedChange={(checked) => updateField("archived", checked)}
        />
      </div>
    </FormModal>
  );
}
