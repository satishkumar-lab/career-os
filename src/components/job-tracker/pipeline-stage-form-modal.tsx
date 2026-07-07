"use client";

import { useEffect, useState } from "react";

import { FormModal } from "@/components/shared/form-modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pipelineStageFormSchema } from "@/lib/job-tracker/constants";
import { hasValidationErrors, validateFields } from "@/lib/validation/form-validation";

export interface PipelineStageFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  initialName?: string;
  submitLabel: string;
  onSave: (name: string) => void;
}

export function PipelineStageFormModal({
  open,
  onOpenChange,
  title,
  initialName = "",
  submitLabel,
  onSave,
}: PipelineStageFormModalProps) {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setName(initialName);
      setErrors({});
    }
  }, [open, initialName]);

  const handleSubmit = () => {
    const nextErrors = validateFields({ name }, pipelineStageFormSchema);

    setErrors(nextErrors);

    if (hasValidationErrors(nextErrors)) {
      return;
    }

    onSave(name.trim());
    onOpenChange(false);
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      submitLabel={submitLabel}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-2">
        <Label htmlFor="pipeline-stage-name">Stage Name</Label>
        <Input
          id="pipeline-stage-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>
    </FormModal>
  );
}
