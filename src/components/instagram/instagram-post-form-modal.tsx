"use client";

import { useEffect, useState } from "react";

import type { InstagramContentType, InstagramPostStatus } from "@/components/instagram/types";
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
  instagramContentTypes,
  instagramPostFormSchema,
  instagramPostStatuses,
} from "@/lib/instagram/constants";
import type { InstagramPostInput, PersistedInstagramPost } from "@/lib/instagram/storage";
import { instagramPostToInput } from "@/lib/instagram/storage";
import { hasValidationErrors, validateFields } from "@/lib/validation/form-validation";

const emptyForm: InstagramPostInput = {
  postTitle: "",
  contentType: "Single Image",
  status: "Draft",
  publishDate: "",
  postUrl: "",
  caption: "",
  topic: "",
  contentPillar: "",
  reach: 0,
  likes: 0,
  comments: 0,
  shares: 0,
  saves: 0,
  followersGained: 0,
  hashtags: "",
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

export interface InstagramPostFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: PersistedInstagramPost;
  onSave: (input: InstagramPostInput) => void;
}

export function InstagramPostFormModal({
  open,
  onOpenChange,
  post,
  onSave,
}: InstagramPostFormModalProps) {
  const [form, setForm] = useState<InstagramPostInput>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setForm(post ? instagramPostToInput(post) : emptyForm);
      setErrors({});
    }
  }, [open, post]);

  const handleSubmit = () => {
    const nextErrors = validateFields(
      {
        postTitle: form.postTitle,
        contentType: form.contentType,
        status: form.status,
        postUrl: form.postUrl,
        reach: form.reach,
        likes: form.likes,
        comments: form.comments,
        shares: form.shares,
        saves: form.saves,
        followersGained: form.followersGained,
      },
      instagramPostFormSchema
    );

    setErrors(nextErrors);

    if (hasValidationErrors(nextErrors)) {
      return;
    }

    onSave(form);
    onOpenChange(false);
  };

  const updateField = <K extends keyof InstagramPostInput>(field: K, value: InstagramPostInput[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateNumericField = (field: keyof InstagramPostInput, value: string) => {
    updateField(field, parseOptionalNumber(value) as InstagramPostInput[typeof field]);
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={post ? "Edit Instagram Post" : "Add Instagram Post"}
      description={post ? "Update Instagram post details." : "Log a new Instagram post."}
      submitLabel={post ? "Save Changes" : "Log Post"}
      onSubmit={handleSubmit}
      bodyClassName="max-h-[min(60vh,520px)] overflow-y-auto pr-1"
    >
      <div className="grid gap-2">
        <Label htmlFor="instagram-post-title">Post Title</Label>
        <Input
          id="instagram-post-title"
          value={form.postTitle}
          onChange={(event) => updateField("postTitle", event.target.value)}
          aria-invalid={Boolean(errors.postTitle)}
        />
        {errors.postTitle && <p className="text-xs text-destructive">{errors.postTitle}</p>}
      </div>

      <div className="grid gap-2">
        <Label>Content Type</Label>
        <Select
          value={form.contentType}
          onValueChange={(value) => {
            if (value) {
              updateField("contentType", value as InstagramContentType);
            }
          }}
        >
          <SelectTrigger className="w-full" aria-invalid={Boolean(errors.contentType)}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {instagramContentTypes.map((contentType) => (
              <SelectItem key={contentType} value={contentType}>
                {contentType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.contentType && <p className="text-xs text-destructive">{errors.contentType}</p>}
      </div>

      <div className="grid gap-2">
        <Label>Status</Label>
        <Select
          value={form.status}
          onValueChange={(value) => {
            if (value) {
              updateField("status", value as InstagramPostStatus);
            }
          }}
        >
          <SelectTrigger className="w-full" aria-invalid={Boolean(errors.status)}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {instagramPostStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.status && <p className="text-xs text-destructive">{errors.status}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="instagram-publish-date">Publish Date</Label>
        <Input
          id="instagram-publish-date"
          value={form.publishDate}
          onChange={(event) => updateField("publishDate", event.target.value)}
          placeholder="Jul 2"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="instagram-post-url">Instagram Post URL</Label>
        <Input
          id="instagram-post-url"
          type="url"
          value={form.postUrl}
          onChange={(event) => updateField("postUrl", event.target.value)}
          placeholder="https://instagram.com/..."
          aria-invalid={Boolean(errors.postUrl)}
        />
        {errors.postUrl && <p className="text-xs text-destructive">{errors.postUrl}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="instagram-caption">Caption</Label>
        <Textarea
          id="instagram-caption"
          value={form.caption}
          onChange={(event) => updateField("caption", event.target.value)}
          placeholder="Optional caption..."
          className="min-h-[72px] resize-none"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="instagram-topic">Topic</Label>
        <Input
          id="instagram-topic"
          value={form.topic}
          onChange={(event) => updateField("topic", event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="instagram-content-pillar">Content Pillar</Label>
        <Input
          id="instagram-content-pillar"
          value={form.contentPillar}
          onChange={(event) => updateField("contentPillar", event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="instagram-reach">Reach</Label>
        <Input
          id="instagram-reach"
          type="number"
          min={0}
          value={form.reach || ""}
          onChange={(event) => updateNumericField("reach", event.target.value)}
          aria-invalid={Boolean(errors.reach)}
        />
        {errors.reach && <p className="text-xs text-destructive">{errors.reach}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="instagram-likes">Likes</Label>
        <Input
          id="instagram-likes"
          type="number"
          min={0}
          value={form.likes || ""}
          onChange={(event) => updateNumericField("likes", event.target.value)}
          aria-invalid={Boolean(errors.likes)}
        />
        {errors.likes && <p className="text-xs text-destructive">{errors.likes}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="instagram-comments">Comments</Label>
        <Input
          id="instagram-comments"
          type="number"
          min={0}
          value={form.comments || ""}
          onChange={(event) => updateNumericField("comments", event.target.value)}
          aria-invalid={Boolean(errors.comments)}
        />
        {errors.comments && <p className="text-xs text-destructive">{errors.comments}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="instagram-shares">Shares</Label>
        <Input
          id="instagram-shares"
          type="number"
          min={0}
          value={form.shares || ""}
          onChange={(event) => updateNumericField("shares", event.target.value)}
          aria-invalid={Boolean(errors.shares)}
        />
        {errors.shares && <p className="text-xs text-destructive">{errors.shares}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="instagram-saves">Saves</Label>
        <Input
          id="instagram-saves"
          type="number"
          min={0}
          value={form.saves || ""}
          onChange={(event) => updateNumericField("saves", event.target.value)}
          aria-invalid={Boolean(errors.saves)}
        />
        {errors.saves && <p className="text-xs text-destructive">{errors.saves}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="instagram-followers-gained">Followers Gained</Label>
        <Input
          id="instagram-followers-gained"
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
        <Label htmlFor="instagram-hashtags">Hashtags</Label>
        <Input
          id="instagram-hashtags"
          value={form.hashtags}
          onChange={(event) => updateField("hashtags", event.target.value)}
          placeholder="#product #career"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="instagram-notes">Notes</Label>
        <Textarea
          id="instagram-notes"
          value={form.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          placeholder="Post notes..."
          className="min-h-[72px] resize-none"
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="instagram-favourite">Favourite</Label>
        <Switch
          id="instagram-favourite"
          checked={form.favourite}
          onCheckedChange={(checked) => updateField("favourite", checked)}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="instagram-archived">Archived</Label>
        <Switch
          id="instagram-archived"
          checked={form.archived}
          onCheckedChange={(checked) => updateField("archived", checked)}
        />
      </div>
    </FormModal>
  );
}
