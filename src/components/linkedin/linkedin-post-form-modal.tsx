"use client";

import { useEffect, useState } from "react";

import type { LinkedInPostStatus, LinkedInPostType } from "@/components/linkedin/types";
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
  linkedInPostFormSchema,
  linkedInPostStatuses,
  linkedInPostTypes,
} from "@/lib/linkedin/constants";
import type { LinkedInPostInput, PersistedLinkedInPost } from "@/lib/linkedin/storage";
import { linkedInPostToInput } from "@/lib/linkedin/storage";
import { hasValidationErrors, validateFields } from "@/lib/validation/form-validation";

const emptyForm: LinkedInPostInput = {
  postTitle: "",
  postType: "Text",
  status: "Draft",
  publishDate: "",
  postUrl: "",
  topic: "",
  contentPillar: "",
  impressions: 0,
  likes: 0,
  comments: 0,
  reposts: 0,
  followersGained: 0,
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

export interface LinkedInPostFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: PersistedLinkedInPost;
  onSave: (input: LinkedInPostInput) => void;
}

export function LinkedInPostFormModal({
  open,
  onOpenChange,
  post,
  onSave,
}: LinkedInPostFormModalProps) {
  const [form, setForm] = useState<LinkedInPostInput>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setForm(post ? linkedInPostToInput(post) : emptyForm);
      setErrors({});
    }
  }, [open, post]);

  const handleSubmit = () => {
    const nextErrors = validateFields(
      {
        postTitle: form.postTitle,
        postType: form.postType,
        status: form.status,
        postUrl: form.postUrl,
        impressions: form.impressions,
        likes: form.likes,
        comments: form.comments,
        reposts: form.reposts,
        followersGained: form.followersGained,
      },
      linkedInPostFormSchema
    );

    setErrors(nextErrors);

    if (hasValidationErrors(nextErrors)) {
      return;
    }

    onSave(form);
    onOpenChange(false);
  };

  const updateField = <K extends keyof LinkedInPostInput>(field: K, value: LinkedInPostInput[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateNumericField = (field: keyof LinkedInPostInput, value: string) => {
    updateField(field, parseOptionalNumber(value) as LinkedInPostInput[typeof field]);
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={post ? "Edit LinkedIn Post" : "Add LinkedIn Post"}
      description={post ? "Update LinkedIn post details." : "Log a new LinkedIn post."}
      submitLabel={post ? "Save Changes" : "Log Post"}
      onSubmit={handleSubmit}
      bodyClassName="max-h-[min(60vh,520px)] overflow-y-auto pr-1"
    >
      <div className="grid gap-2">
        <Label htmlFor="linkedin-post-title">Post Title</Label>
        <Input
          id="linkedin-post-title"
          value={form.postTitle}
          onChange={(event) => updateField("postTitle", event.target.value)}
          aria-invalid={Boolean(errors.postTitle)}
        />
        {errors.postTitle && <p className="text-xs text-destructive">{errors.postTitle}</p>}
      </div>

      <div className="grid gap-2">
        <Label>Post Type</Label>
        <Select
          value={form.postType}
          onValueChange={(value) => {
            if (value) {
              updateField("postType", value as LinkedInPostType);
            }
          }}
        >
          <SelectTrigger className="w-full" aria-invalid={Boolean(errors.postType)}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {linkedInPostTypes.map((postType) => (
              <SelectItem key={postType} value={postType}>
                {postType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.postType && <p className="text-xs text-destructive">{errors.postType}</p>}
      </div>

      <div className="grid gap-2">
        <Label>Status</Label>
        <Select
          value={form.status}
          onValueChange={(value) => {
            if (value) {
              updateField("status", value as LinkedInPostStatus);
            }
          }}
        >
          <SelectTrigger className="w-full" aria-invalid={Boolean(errors.status)}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {linkedInPostStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.status && <p className="text-xs text-destructive">{errors.status}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="linkedin-publish-date">Publish Date</Label>
        <Input
          id="linkedin-publish-date"
          value={form.publishDate}
          onChange={(event) => updateField("publishDate", event.target.value)}
          placeholder="Jul 3"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="linkedin-post-url">LinkedIn Post URL</Label>
        <Input
          id="linkedin-post-url"
          type="url"
          value={form.postUrl}
          onChange={(event) => updateField("postUrl", event.target.value)}
          placeholder="https://linkedin.com/..."
          aria-invalid={Boolean(errors.postUrl)}
        />
        {errors.postUrl && <p className="text-xs text-destructive">{errors.postUrl}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="linkedin-topic">Topic</Label>
        <Input
          id="linkedin-topic"
          value={form.topic}
          onChange={(event) => updateField("topic", event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="linkedin-content-pillar">Content Pillar</Label>
        <Input
          id="linkedin-content-pillar"
          value={form.contentPillar}
          onChange={(event) => updateField("contentPillar", event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="linkedin-impressions">Impressions</Label>
        <Input
          id="linkedin-impressions"
          type="number"
          min={0}
          value={form.impressions || ""}
          onChange={(event) => updateNumericField("impressions", event.target.value)}
          aria-invalid={Boolean(errors.impressions)}
        />
        {errors.impressions && <p className="text-xs text-destructive">{errors.impressions}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="linkedin-likes">Likes</Label>
        <Input
          id="linkedin-likes"
          type="number"
          min={0}
          value={form.likes || ""}
          onChange={(event) => updateNumericField("likes", event.target.value)}
          aria-invalid={Boolean(errors.likes)}
        />
        {errors.likes && <p className="text-xs text-destructive">{errors.likes}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="linkedin-comments">Comments</Label>
        <Input
          id="linkedin-comments"
          type="number"
          min={0}
          value={form.comments || ""}
          onChange={(event) => updateNumericField("comments", event.target.value)}
          aria-invalid={Boolean(errors.comments)}
        />
        {errors.comments && <p className="text-xs text-destructive">{errors.comments}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="linkedin-reposts">Reposts</Label>
        <Input
          id="linkedin-reposts"
          type="number"
          min={0}
          value={form.reposts || ""}
          onChange={(event) => updateNumericField("reposts", event.target.value)}
          aria-invalid={Boolean(errors.reposts)}
        />
        {errors.reposts && <p className="text-xs text-destructive">{errors.reposts}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="linkedin-followers-gained">Followers Gained</Label>
        <Input
          id="linkedin-followers-gained"
          type="number"
          min={0}
          value={form.followersGained || ""}
          onChange={(event) => updateNumericField("followersGained", event.target.value)}
          aria-invalid={Boolean(errors.followersGained)}
        />
        {errors.followersGained && (
          <p className="text-xs text-destructive">{errors.followersGained}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="linkedin-notes">Notes</Label>
        <Textarea
          id="linkedin-notes"
          value={form.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          placeholder="Post notes..."
          className="min-h-[72px] resize-none"
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="linkedin-favourite">Favourite</Label>
        <Switch
          id="linkedin-favourite"
          checked={form.favourite}
          onCheckedChange={(checked) => updateField("favourite", checked)}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="linkedin-archived">Archived</Label>
        <Switch
          id="linkedin-archived"
          checked={form.archived}
          onCheckedChange={(checked) => updateField("archived", checked)}
        />
      </div>
    </FormModal>
  );
}
