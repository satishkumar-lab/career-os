"use client";

import { NotebookPen } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { cardHover, contentCardRadius } from "@/lib/interaction-styles";
import { cn } from "@/lib/utils";

export interface NotesCardProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  className?: string;
}

export function NotesCard({ notes, onNotesChange, className }: NotesCardProps) {
  return (
    <div className={cn(contentCardRadius, "border border-border bg-card p-5 shadow-xs", cardHover, className)}>
      <div className="flex items-center gap-2 pb-3">
        <NotebookPen className="size-3.5 text-foreground" />
        <h2 className="text-[14.5px] font-medium tracking-tight text-foreground">Notes</h2>
      </div>
      <Textarea
        value={notes}
        onChange={(event) => onNotesChange(event.target.value)}
        placeholder="Add a learning note, insight, or key takeaway..."
        className="min-h-[88px] resize-none border-none px-0 py-0 text-[13.5px] text-muted-foreground shadow-none focus-visible:ring-0"
      />
    </div>
  );
}
