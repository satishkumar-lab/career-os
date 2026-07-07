"use client";

import { useEffect, useState } from "react";

import type { CertificationStatus } from "@/components/certifications/types";
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
import { certificationFormSchema, certificationStatuses } from "@/lib/certifications/constants";
import type { CertificationInput, PersistedCertification } from "@/lib/certifications/storage";
import { certificationToInput } from "@/lib/certifications/storage";
import { hasValidationErrors, validateFields } from "@/lib/validation/form-validation";

const emptyForm: CertificationInput = {
  name: "",
  provider: "",
  status: "In Progress",
  percent: 0,
  examDate: "",
  credentialUrl: "",
  notes: "",
  favourite: false,
  archived: false,
};

export interface CertificationFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certification?: PersistedCertification;
  onSave: (input: CertificationInput) => void;
}

export function CertificationFormModal({
  open,
  onOpenChange,
  certification,
  onSave,
}: CertificationFormModalProps) {
  const [form, setForm] = useState<CertificationInput>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setForm(certification ? certificationToInput(certification) : emptyForm);
      setErrors({});
    }
  }, [open, certification]);

  const handleSubmit = () => {
    const nextErrors = validateFields(
      {
        name: form.name,
        provider: form.provider,
        percent: form.percent,
        credentialUrl: form.credentialUrl,
      },
      certificationFormSchema
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

  const updateField = <K extends keyof CertificationInput>(field: K, value: CertificationInput[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={certification ? "Edit Certification" : "Add Certification"}
      description={
        certification ? "Update certification details." : "Add a new certification to track."
      }
      submitLabel={certification ? "Save Changes" : "Add Cert"}
      onSubmit={handleSubmit}
      bodyClassName="max-h-[min(60vh,520px)] overflow-y-auto pr-1"
    >
      <div className="grid gap-2">
        <Label htmlFor="cert-name">Name</Label>
        <Input
          id="cert-name"
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="cert-provider">Provider</Label>
        <Input
          id="cert-provider"
          value={form.provider}
          onChange={(event) => updateField("provider", event.target.value)}
          aria-invalid={Boolean(errors.provider)}
        />
        {errors.provider && <p className="text-xs text-destructive">{errors.provider}</p>}
      </div>

      <div className="grid gap-2">
        <Label>Status</Label>
        <Select
          value={form.status}
          onValueChange={(value) => {
            if (value) {
              updateField("status", value as CertificationStatus);
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {certificationStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {form.status !== "Planned" && (
        <div className="grid gap-2">
          <Label htmlFor="cert-percent">Progress (%)</Label>
          <Input
            id="cert-percent"
            type="number"
            min={0}
            max={100}
            value={form.percent}
            onChange={(event) => updateField("percent", Number(event.target.value))}
            aria-invalid={Boolean(errors.percent)}
          />
          {errors.percent && <p className="text-xs text-destructive">{errors.percent}</p>}
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="cert-exam-date">Exam Date</Label>
        <Input
          id="cert-exam-date"
          value={form.examDate}
          onChange={(event) => updateField("examDate", event.target.value)}
          placeholder="Jul 18, 2025"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="cert-credential-url">Credential URL</Label>
        <Input
          id="cert-credential-url"
          type="url"
          value={form.credentialUrl}
          onChange={(event) => updateField("credentialUrl", event.target.value)}
          placeholder="https://example.com/credential"
          aria-invalid={Boolean(errors.credentialUrl)}
        />
        {errors.credentialUrl && <p className="text-xs text-destructive">{errors.credentialUrl}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="cert-notes">Notes</Label>
        <Textarea
          id="cert-notes"
          value={form.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          placeholder="Study notes or prep details..."
          className="min-h-[72px] resize-none"
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="cert-favourite">Favourite</Label>
        <Switch
          id="cert-favourite"
          checked={form.favourite}
          onCheckedChange={(checked) => updateField("favourite", checked)}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="cert-archived">Archived</Label>
        <Switch
          id="cert-archived"
          checked={form.archived}
          onCheckedChange={(checked) => updateField("archived", checked)}
        />
      </div>
    </FormModal>
  );
}
