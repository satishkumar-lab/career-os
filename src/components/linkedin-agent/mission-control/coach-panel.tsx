"use client";

import { ArrowUp, Loader2, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { contentCardRadius, transitionPremium } from "@/lib/interaction-styles";
import type { CoachMessage } from "@/lib/linkedin-agent/mission-control/types";
import { cn } from "@/lib/utils";

export interface CoachPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messages: CoachMessage[];
  onSend: (message: string) => void;
  isThinking: boolean;
  suggestedPrompts?: string[];
}

export function CoachPanel({
  open,
  onOpenChange,
  messages,
  onSend,
  isThinking,
  suggestedPrompts = [
    "What should I post today?",
    "Help me improve my headline",
    "Create a networking follow-up",
  ],
}: CoachPanelProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  function handleSend(text?: string) {
    const value = (text ?? input).trim();
    if (!value || isThinking) return;
    onSend(value);
    setInput("");
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-4 py-4">
          <div className="flex items-center gap-2">
            <span
              className="flex size-8 items-center justify-center rounded-xl shadow-sm"
              style={{ backgroundImage: "linear-gradient(135deg, #17a5fb 0%, #e80584 100%)" }}
            >
              <Sparkles className="size-4 text-white" />
            </span>
            <div>
              <SheetTitle className="text-base">AI Career Coach</SheetTitle>
              <p className="text-[11.5px] font-normal text-muted-foreground">
                Secondary capability · Ask when you need guidance
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 ? (
            <div className="space-y-4">
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                Your Mission Control dashboard surfaces priorities first. Open the coach when you
                need deeper guidance.
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-[12px] font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "max-w-[90%] rounded-[16px] px-3.5 py-2.5 text-[13px] leading-relaxed",
                    msg.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "border border-border bg-card text-foreground"
                  )}
                >
                  {msg.content}
                </div>
              ))}
              {isThinking && (
                <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" />
                  Coach is thinking…
                </div>
              )}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-border p-3">
          <div className={cn(contentCardRadius, "flex items-end gap-2 border border-border p-2")}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your career coach…"
              rows={1}
              disabled={isThinking}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="max-h-24 min-h-[40px] flex-1 resize-none bg-transparent px-2 py-1.5 text-[13px] focus:outline-none"
            />
            <Button
              type="button"
              size="icon"
              className={cn("size-9 shrink-0 rounded-xl", transitionPremium)}
              disabled={!input.trim() || isThinking}
              onClick={() => handleSend()}
            >
              <ArrowUp className="size-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
