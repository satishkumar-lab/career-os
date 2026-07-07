"use client";

import { useEffect, useState } from "react";

import type { Course } from "@/components/learning/types";
import { FormModal } from "@/components/shared/form-modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { progressFormSchema } from "@/lib/learning/constants";
import { hasValidationErrors, validateFields } from "@/lib/validation/form-validation";

export interface ProgressUpdateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: Course;
  onSave: (percent: number) => void;
}

export function ProgressUpdateModal({ open, onOpenChange, course, onSave }: ProgressUpdateModalProps) {
  const [percent, setPercent] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && course) {
      setPercent(course.percent);
      setErrors({});
    }
  }, [open, course]);

  const handleSubmit = () => {
    const nextErrors = validateFields({ percent }, progressFormSchema);
    setErrors(nextErrors);

    if (hasValidationErrors(nextErrors)) {
      return;
    }

    onSave(Number(percent));
    onOpenChange(false);
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Update Progress"
      description={course ? `Update progress for ${course.title}.` : undefined}
      submitLabel="Save Progress"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-2">
        <Label htmlFor="course-progress-percent">Progress (%)</Label>
        <Input
          id="course-progress-percent"
          type="number"
          min={0}
          max={100}
          value={percent}
          onChange={(event) => setPercent(Number(event.target.value))}
          aria-invalid={Boolean(errors.percent)}
        />
        {errors.percent && <p className="text-xs text-destructive">{errors.percent}</p>}
      </div>
    </FormModal>
  );
}
