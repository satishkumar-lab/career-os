"use client";

import { useEffect, useState } from "react";

import type { Course } from "@/components/learning/types";
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
import { courseFormSchema, courseIconPresets } from "@/lib/learning/constants";
import type { CourseInput } from "@/lib/learning/storage";
import { courseToInput } from "@/lib/learning/storage";
import { hasValidationErrors, validateFields } from "@/lib/validation/form-validation";

const emptyForm: CourseInput = {
  title: "",
  provider: "",
  moduleLabel: "",
  timeLeftLabel: "",
  percent: 0,
  icon: "analytics",
};

export interface CourseFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: Course;
  onSave: (input: CourseInput) => void;
}

export function CourseFormModal({ open, onOpenChange, course, onSave }: CourseFormModalProps) {
  const [form, setForm] = useState<CourseInput>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setForm(course ? courseToInput(course) : emptyForm);
      setErrors({});
    }
  }, [open, course]);

  const handleSubmit = () => {
    const nextErrors = validateFields(
      {
        title: form.title,
        provider: form.provider,
        moduleLabel: form.moduleLabel,
        timeLeftLabel: form.timeLeftLabel,
        percent: form.percent,
        icon: form.icon,
      },
      courseFormSchema
    );

    setErrors(nextErrors);

    if (hasValidationErrors(nextErrors)) {
      return;
    }

    onSave({
      ...form,
      percent: Number(form.percent),
    });
    onOpenChange(false);
  };

  const updateField = <K extends keyof CourseInput>(field: K, value: CourseInput[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={course ? "Edit Course" : "Add Course"}
      description={course ? "Update course details." : "Add a new course to track."}
      submitLabel={course ? "Save Changes" : "Add Course"}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-2">
        <Label htmlFor="course-title">Title</Label>
        <Input
          id="course-title"
          value={form.title}
          onChange={(event) => updateField("title", event.target.value)}
          aria-invalid={Boolean(errors.title)}
        />
        {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="course-provider">Provider</Label>
        <Input
          id="course-provider"
          value={form.provider}
          onChange={(event) => updateField("provider", event.target.value)}
          aria-invalid={Boolean(errors.provider)}
        />
        {errors.provider && <p className="text-xs text-destructive">{errors.provider}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="course-module">Module</Label>
        <Input
          id="course-module"
          value={form.moduleLabel}
          onChange={(event) => updateField("moduleLabel", event.target.value)}
          placeholder="Module 1/10"
          aria-invalid={Boolean(errors.moduleLabel)}
        />
        {errors.moduleLabel && <p className="text-xs text-destructive">{errors.moduleLabel}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="course-time-left">Time left</Label>
        <Input
          id="course-time-left"
          value={form.timeLeftLabel}
          onChange={(event) => updateField("timeLeftLabel", event.target.value)}
          placeholder="4.5h left"
          aria-invalid={Boolean(errors.timeLeftLabel)}
        />
        {errors.timeLeftLabel && <p className="text-xs text-destructive">{errors.timeLeftLabel}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="course-percent">Progress (%)</Label>
        <Input
          id="course-percent"
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
        <Label>Icon</Label>
        <Select
          value={form.icon}
          onValueChange={(value) => {
            if (value) {
              updateField("icon", value as Course["icon"]);
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(courseIconPresets) as Course["icon"][]).map((icon) => (
              <SelectItem key={icon} value={icon}>
                {courseIconPresets[icon].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </FormModal>
  );
}
