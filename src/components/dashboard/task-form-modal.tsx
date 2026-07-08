"use client";

import { useEffect, useState } from "react";

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
import { Textarea } from "@/components/ui/textarea";
import { taskPriorities, type TaskPriority } from "@/lib/dashboard/constants";
import type { DashboardTaskInput } from "@/lib/dashboard/tasks-storage";

const emptyForm: DashboardTaskInput = {
  title: "",
  description: "",
  priority: "Medium",
  dueDate: "",
};

export interface TaskFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (input: DashboardTaskInput) => void;
}

export function TaskFormModal({ open, onOpenChange, onSave }: TaskFormModalProps) {
  const [form, setForm] = useState<DashboardTaskInput>(emptyForm);
  const [titleError, setTitleError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setTitleError("");
    }
  }, [open]);

  const handleSubmit = () => {
    if (!form.title.trim()) {
      setTitleError("Task title is required.");
      return;
    }

    onSave({
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      dueDate: form.dueDate,
    });
    onOpenChange(false);
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add Task"
      description="Create a task for today's focus."
      submitLabel="Add Task"
      onSubmit={handleSubmit}
      submitDisabled={!form.title.trim()}
    >
      <div className="grid gap-2">
        <Label htmlFor="task-title">Task Title</Label>
        <Input
          id="task-title"
          value={form.title}
          onChange={(event) => {
            setForm((current) => ({ ...current, title: event.target.value }));
            if (titleError) {
              setTitleError("");
            }
          }}
          placeholder="What do you need to do?"
        />
        {titleError && <p className="text-xs text-destructive">{titleError}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="task-description">Description</Label>
        <Textarea
          id="task-description"
          value={form.description}
          onChange={(event) =>
            setForm((current) => ({ ...current, description: event.target.value }))
          }
          placeholder="Optional details"
          rows={3}
        />
      </div>

      <div className="grid gap-2">
        <Label>Priority</Label>
        <Select
          value={form.priority}
          onValueChange={(value) =>
            setForm((current) => ({ ...current, priority: value as TaskPriority }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            {taskPriorities.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="task-due-date">Due Date</Label>
        <Input
          id="task-due-date"
          type="date"
          value={form.dueDate}
          onChange={(event) =>
            setForm((current) => ({ ...current, dueDate: event.target.value }))
          }
        />
      </div>
    </FormModal>
  );
}
