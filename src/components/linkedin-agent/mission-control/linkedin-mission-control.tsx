"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { AlertCircle } from "lucide-react";

import { ActionCenter } from "@/components/linkedin-agent/mission-control/action-center";
import { CoachPanel } from "@/components/linkedin-agent/mission-control/coach-panel";
import { ContentHub } from "@/components/linkedin-agent/mission-control/content-hub";
import { MissionBriefHero } from "@/components/linkedin-agent/mission-control/mission-brief-hero";
import { MissionControlHeader } from "@/components/linkedin-agent/mission-control/mission-control-header";
import { MissionOutputSheet } from "@/components/linkedin-agent/mission-control/mission-output-sheet";
import { NetworkingHub } from "@/components/linkedin-agent/mission-control/networking-hub";
import { OpportunitiesSection } from "@/components/linkedin-agent/mission-control/opportunities-section";
import { useToast } from "@/components/shared/toast-provider";
import { useLinkedInConnection } from "@/lib/linkedin/connection/use-linkedin-connection";
import {
  buildMissionControlData,
  buildMockDraft,
} from "@/lib/linkedin-agent/mission-control/signals";
import type {
  CoachMessage,
  ContentItem,
  MissionAction,
  NetworkingContact,
  TrendingTopic,
} from "@/lib/linkedin-agent/mission-control/types";
import { useProfile } from "@/lib/settings/profile-context";
import { cardShell, contentCardRadius } from "@/lib/interaction-styles";
import { cn } from "@/lib/utils";

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function LinkedInMissionControl() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { user } = useProfile();
  const linkedIn = useLinkedInConnection();

  const [coachOpen, setCoachOpen] = useState(false);
  const [coachMessages, setCoachMessages] = useState<CoachMessage[]>([]);
  const [isCoachThinking, setIsCoachThinking] = useState(false);

  const [outputOpen, setOutputOpen] = useState(false);
  const [outputTitle, setOutputTitle] = useState("");
  const [outputContent, setOutputContent] = useState("");
  const [outputType, setOutputType] = useState("draft");
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastActionId, setLastActionId] = useState("generate-post");

  const data = useMemo(
    () =>
      buildMissionControlData({
        userNameOverride: user.name || undefined,
      }),
    [user.name]
  );

  useEffect(() => {
    const linkedinParam = searchParams.get("linkedin");
    const reason = searchParams.get("reason");

    if (!linkedinParam) return;

    if (linkedinParam === "connected") {
      showToast("LinkedIn connected successfully.");
      void linkedIn.refresh();
    } else if (linkedinParam === "error") {
      const decodedReason = reason ? decodeURIComponent(reason) : null;
      console.error("[LinkedIn OAuth][oauth_callback] UI error toast", {
        reason: decodedReason,
        rawReason: reason,
      });
      showToast(decodedReason || "LinkedIn connection failed.", { variant: "error" });
    }

    router.replace(pathname, { scroll: false });
  }, [linkedIn, pathname, router, searchParams, showToast]);

  const runAction = useCallback(
    (actionId: string, label?: string) => {
      setLastActionId(actionId);
      setIsGenerating(true);
      setOutputOpen(true);
      setOutputTitle(label ?? "Generating…");
      setOutputContent("");
      setOutputType("draft");

      setTimeout(() => {
        const draft = buildMockDraft(actionId, data);
        setOutputTitle(draft.title);
        setOutputContent(draft.content);
        setOutputType(draft.type);
        setIsGenerating(false);
        showToast(`${draft.title} ready (prototype).`);
      }, 1200 + Math.random() * 600);
    },
    [data, showToast]
  );

  const handleSync = useCallback(async () => {
    try {
      await linkedIn.sync();
      showToast("LinkedIn profile synced.");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "LinkedIn sync failed.", {
        variant: "error",
      });
    }
  }, [linkedIn, showToast]);

  const handleDisconnect = useCallback(async () => {
    try {
      await linkedIn.disconnect();
      showToast("LinkedIn disconnected.");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "LinkedIn disconnect failed.", {
        variant: "error",
      });
    }
  }, [linkedIn, showToast]);

  const handleCoachSend = useCallback(
    (message: string) => {
      const userMsg: CoachMessage = {
        id: createId("user"),
        role: "user",
        content: message,
      };
      setCoachMessages((prev) => [...prev, userMsg]);
      setIsCoachThinking(true);

      setTimeout(() => {
        const reply: CoachMessage = {
          id: createId("assistant"),
          role: "assistant",
          content: data.hasCareerOsData
            ? `Based on your CareerOS signals, I'd prioritize "${data.brief.recommended.title}". Want me to generate that draft for you?`
            : "Add Projects or Certifications in CareerOS and I can give much sharper guidance. For now, try the Action Center on your dashboard.",
        };
        setCoachMessages((prev) => [...prev, reply]);
        setIsCoachThinking(false);
      }, 1000 + Math.random() * 500);
    },
    [data]
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-12">
      {linkedIn.error ? (
        <div
          className={cn(
            cardShell,
            contentCardRadius,
            "flex items-start gap-3 border-amber-200/80 bg-amber-50/70 p-4 dark:border-amber-900/50 dark:bg-amber-950/20"
          )}
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-700 dark:text-amber-400" />
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-amber-900 dark:text-amber-100">
              Unable to load LinkedIn connection status
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-amber-800/90 dark:text-amber-200/80">
              {linkedIn.error}
            </p>
          </div>
        </div>
      ) : null}

      <MissionControlHeader
        connectionStatus={linkedIn.status}
        isConnectionLoading={linkedIn.isLoading}
        isConnecting={linkedIn.isConnecting}
        isSyncing={linkedIn.isSyncing}
        isDisconnecting={linkedIn.isDisconnecting}
        onConnect={linkedIn.connect}
        onSync={handleSync}
        onDisconnect={handleDisconnect}
        onOpenCoach={() => setCoachOpen(true)}
      />

      <MissionBriefHero
        firstName={data.firstName}
        brief={data.brief}
        onRecommendedAction={runAction}
        isLoading={false}
      />

      <ActionCenter
        actions={data.actions}
        onAction={(action: MissionAction) => runAction(action.id, action.label)}
        disabled={isGenerating}
      />

      <ContentHub
        items={data.content}
        trending={data.trending}
        onItemAction={(item: ContentItem) => runAction("generate-post", item.title)}
        onTrendAction={(topic: TrendingTopic) =>
          runAction("generate-post", `Post about ${topic.topic}`)
        }
      />

      <div className="grid items-stretch gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <OpportunitiesSection
          opportunities={data.brief.opportunities}
          improvements={data.brief.improvements}
          achievements={data.brief.achievements}
          onAction={(actionId, title) => runAction(actionId, title)}
        />

        <NetworkingHub
          contacts={data.networking}
          onAction={(contact: NetworkingContact) =>
            runAction("networking-followup", contact.actionLabel)
          }
        />
      </div>

      <CoachPanel
        open={coachOpen}
        onOpenChange={setCoachOpen}
        messages={coachMessages}
        onSend={handleCoachSend}
        isThinking={isCoachThinking}
      />

      <MissionOutputSheet
        open={outputOpen}
        onOpenChange={setOutputOpen}
        title={outputTitle}
        content={outputContent}
        type={outputType}
        isGenerating={isGenerating}
        onRegenerate={() => runAction(lastActionId, outputTitle)}
      />
    </div>
  );
}
