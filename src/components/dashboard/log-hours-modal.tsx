"use client";

import { useEffect, useState } from "react";

import { FormModal } from "@/components/shared/form-modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface LogHoursModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (hours: number) => void;
}

export function LogHoursModal({ open, onOpenChange, onSave }: LogHoursModalProps) {
  const [hours, setHours] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setHours("");
      setError("");
    }
  }, [open]);

  const handleSubmit = () => {
    const parsed = Number(hours);

    if (!hours.trim() || Number.isNaN(parsed) || parsed <= 0) {
      setError("Enter a valid number of hours greater than 0.");
      return;
    }

    onSave(parsed);
    onOpenChange(false);
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Log Hours"
      description="Record learning time for this week."
      submitLabel="Log Hours"
      onSubmit={handleSubmit}
      submitDisabled={!hours.trim()}
    >
      <div className="grid gap-2">
        <Label htmlFor="learning-hours">Hours</Label>
        <Input
          id="learning-hours"
          type="number"
          min="0.25"
          step="0.25"
          value={hours}
          onChange={(event) => {
            setHours(event.target.value);
            if (error) {
              setError("");
            }
          }}
          placeholder="e.g. 1.5"
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </FormModal>
  );
}
