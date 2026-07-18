"use client";

import { Check, Copy, Loader2, Pencil, RefreshCw } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { cardShell, contentCardRadius, transitionPremium } from "@/lib/interaction-styles";
import { cn } from "@/lib/utils";

export interface MissionOutputSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
  type: string;
  isGenerating?: boolean;
  onRegenerate?: () => void;
}

export function MissionOutputSheet({
  open,
  onOpenChange,
  title,
  content,
  type,
  isGenerating = false,
  onRegenerate,
}: MissionOutputSheetProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState(content);

  const display = isEditing ? edited : content;

  async function handleCopy() {
    await navigator.clipboard.writeText(display);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border px-4 py-4">
          <p className="text-[11px] font-medium tracking-[0.08em] text-primary uppercase">
            AI Output · {type}
          </p>
          <SheetTitle className="text-base">{title}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-[13px] text-muted-foreground">Generating from CareerOS signals…</p>
            </div>
          ) : isEditing ? (
            <Textarea
              value={edited}
              onChange={(e) => setEdited(e.target.value)}
              className="min-h-[320px] resize-none rounded-2xl text-[13.5px] leading-relaxed"
            />
          ) : (
            <div className={cn(cardShell, contentCardRadius, "p-4")}>
              <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed text-foreground">
                {display}
              </p>
            </div>
          )}
        </div>

        {!isGenerating && (
          <div className="flex flex-wrap gap-2 border-t border-border p-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn("rounded-xl text-[12px]", transitionPremium)}
              onClick={handleCopy}
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl text-[12px]"
              onClick={() => {
                setEdited(content);
                setIsEditing((v) => !v);
              }}
            >
              <Pencil className="size-3.5" />
              {isEditing ? "Preview" : "Edit"}
            </Button>
            {onRegenerate && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-xl text-[12px]"
                onClick={onRegenerate}
              >
                <RefreshCw className="size-3.5" />
                Regenerate
              </Button>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
