"use client";

import { useEffect, useState } from "react";

import type { CurrentStage, JobApplicationStatus, JobType, WorkMode } from "@/components/job-tracker/types";
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
  applicationStatuses,
  currentStages,
  jobApplicationFormSchema,
  jobTypes,
  workModes,
} from "@/lib/job-tracker/constants";
import type { JobApplicationInput, PersistedJobApplication } from "@/lib/job-tracker/storage";
import { jobApplicationToInput } from "@/lib/job-tracker/storage";
import { hasValidationErrors, validateFields } from "@/lib/validation/form-validation";

const emptyForm: JobApplicationInput = {
  companyName: "",
  jobTitle: "",
  jobType: "Full-time",
  workMode: "Remote",
  location: "",
  appliedDate: "",
  currentStage: "Applied",
  applicationStatus: "Active",
  salary: "",
  jobUrl: "",
  recruiterName: "",
  recruiterEmail: "",
  recruiterLinkedIn: "",
  interviewDate: "",
  notes: "",
  favourite: false,
  archived: false,
};

export interface JobApplicationFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application?: PersistedJobApplication;
  onSave: (input: JobApplicationInput) => void;
}

export function JobApplicationFormModal({
  open,
  onOpenChange,
  application,
  onSave,
}: JobApplicationFormModalProps) {
  const [form, setForm] = useState<JobApplicationInput>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setForm(application ? jobApplicationToInput(application) : emptyForm);
      setErrors({});
    }
  }, [open, application]);

  const handleSubmit = () => {
    const nextErrors = validateFields(
      {
        companyName: form.companyName,
        jobTitle: form.jobTitle,
        currentStage: form.currentStage,
        jobUrl: form.jobUrl,
        recruiterEmail: form.recruiterEmail,
        recruiterLinkedIn: form.recruiterLinkedIn,
      },
      jobApplicationFormSchema
    );

    setErrors(nextErrors);

    if (hasValidationErrors(nextErrors)) {
      return;
    }

    onSave(form);
    onOpenChange(false);
  };

  const updateField = <K extends keyof JobApplicationInput>(field: K, value: JobApplicationInput[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={application ? "Edit Job Application" : "Add Job Application"}
      description={
        application ? "Update job application details." : "Add a new job application to track."
      }
      submitLabel={application ? "Save Changes" : "Add Application"}
      onSubmit={handleSubmit}
      bodyClassName="max-h-[min(60vh,520px)] overflow-y-auto pr-1"
    >
      <div className="grid gap-2">
        <Label htmlFor="job-company-name">Company Name</Label>
        <Input
          id="job-company-name"
          value={form.companyName}
          onChange={(event) => updateField("companyName", event.target.value)}
          aria-invalid={Boolean(errors.companyName)}
        />
        {errors.companyName && <p className="text-xs text-destructive">{errors.companyName}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="job-title">Job Title</Label>
        <Input
          id="job-title"
          value={form.jobTitle}
          onChange={(event) => updateField("jobTitle", event.target.value)}
          aria-invalid={Boolean(errors.jobTitle)}
        />
        {errors.jobTitle && <p className="text-xs text-destructive">{errors.jobTitle}</p>}
      </div>

      <div className="grid gap-2">
        <Label>Job Type</Label>
        <Select
          value={form.jobType}
          onValueChange={(value) => {
            if (value) {
              updateField("jobType", value as JobType);
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {jobTypes.map((jobType) => (
              <SelectItem key={jobType} value={jobType}>
                {jobType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>Work Mode</Label>
        <Select
          value={form.workMode}
          onValueChange={(value) => {
            if (value) {
              updateField("workMode", value as WorkMode);
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {workModes.map((workMode) => (
              <SelectItem key={workMode} value={workMode}>
                {workMode}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="job-location">Location</Label>
        <Input
          id="job-location"
          value={form.location}
          onChange={(event) => updateField("location", event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="job-applied-date">Applied Date</Label>
        <Input
          id="job-applied-date"
          value={form.appliedDate}
          onChange={(event) => updateField("appliedDate", event.target.value)}
          placeholder="Jul 3"
        />
      </div>

      <div className="grid gap-2">
        <Label>Current Stage</Label>
        <Select
          value={form.currentStage}
          onValueChange={(value) => {
            if (value) {
              updateField("currentStage", value as CurrentStage);
            }
          }}
        >
          <SelectTrigger className="w-full" aria-invalid={Boolean(errors.currentStage)}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {currentStages.map((stage) => (
              <SelectItem key={stage} value={stage}>
                {stage}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.currentStage && <p className="text-xs text-destructive">{errors.currentStage}</p>}
      </div>

      <div className="grid gap-2">
        <Label>Application Status</Label>
        <Select
          value={form.applicationStatus}
          onValueChange={(value) => {
            if (value) {
              updateField("applicationStatus", value as JobApplicationStatus);
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {applicationStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="job-salary">Salary</Label>
        <Input
          id="job-salary"
          value={form.salary}
          onChange={(event) => updateField("salary", event.target.value)}
          placeholder="Optional"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="job-url">Job URL</Label>
        <Input
          id="job-url"
          type="url"
          value={form.jobUrl}
          onChange={(event) => updateField("jobUrl", event.target.value)}
          placeholder="https://..."
          aria-invalid={Boolean(errors.jobUrl)}
        />
        {errors.jobUrl && <p className="text-xs text-destructive">{errors.jobUrl}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="job-recruiter-name">Recruiter Name</Label>
        <Input
          id="job-recruiter-name"
          value={form.recruiterName}
          onChange={(event) => updateField("recruiterName", event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="job-recruiter-email">Recruiter Email</Label>
        <Input
          id="job-recruiter-email"
          type="email"
          value={form.recruiterEmail}
          onChange={(event) => updateField("recruiterEmail", event.target.value)}
          aria-invalid={Boolean(errors.recruiterEmail)}
        />
        {errors.recruiterEmail && <p className="text-xs text-destructive">{errors.recruiterEmail}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="job-recruiter-linkedin">Recruiter LinkedIn</Label>
        <Input
          id="job-recruiter-linkedin"
          type="url"
          value={form.recruiterLinkedIn}
          onChange={(event) => updateField("recruiterLinkedIn", event.target.value)}
          placeholder="https://linkedin.com/in/..."
          aria-invalid={Boolean(errors.recruiterLinkedIn)}
        />
        {errors.recruiterLinkedIn && (
          <p className="text-xs text-destructive">{errors.recruiterLinkedIn}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="job-interview-date">Interview Date</Label>
        <Input
          id="job-interview-date"
          value={form.interviewDate}
          onChange={(event) => updateField("interviewDate", event.target.value)}
          placeholder="Optional"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="job-notes">Notes</Label>
        <Textarea
          id="job-notes"
          value={form.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          placeholder="Application notes..."
          className="min-h-[72px] resize-none"
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="job-favourite">Favourite</Label>
        <Switch
          id="job-favourite"
          checked={form.favourite}
          onCheckedChange={(checked) => updateField("favourite", checked)}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="job-archived">Archived</Label>
        <Switch
          id="job-archived"
          checked={form.archived}
          onCheckedChange={(checked) => updateField("archived", checked)}
        />
      </div>
    </FormModal>
  );
}
