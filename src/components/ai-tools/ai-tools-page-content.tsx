"use client";

import { useMemo, useState } from "react";

import { AiToolsGrid } from "@/components/ai-tools/ai-tools-grid";
import { AiToolsHeader } from "@/components/ai-tools/ai-tools-header";
import { ToolFormModal } from "@/components/ai-tools/tool-form-modal";
import { StatsRow } from "@/components/dashboard/stats-row";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ToastProvider, useToast } from "@/components/shared/toast-provider";
import {
  addAiTool,
  buildAiToolsStats,
  editAiTool,
  findPersistedTool,
  removeAiTool,
  toAiTools,
  type AiToolInput,
  type PersistedAiTool,
} from "@/lib/ai-tools/storage";
import { useAiToolsState } from "@/lib/ai-tools/use-ai-tools-state";
import { usePageSearch } from "@/lib/search/search-context";
import { filterPersistedAiTools } from "@/lib/search/page-filters";

function AiToolsPageInner() {
  const [state, setState] = useAiToolsState();
  const { normalizedQuery, isSearchActive } = usePageSearch();
  const { showToast } = useToast();

  const [toolFormOpen, setToolFormOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<PersistedAiTool | undefined>();
  const [deleteTool, setDeleteTool] = useState<PersistedAiTool | undefined>();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const filteredTools = useMemo(
    () => (state ? toAiTools(filterPersistedAiTools(state.tools, normalizedQuery)) : []),
    [state, normalizedQuery]
  );

  if (!state) {
    return null;
  }

  const stats = buildAiToolsStats(state);

  const handleAddTool = () => {
    setEditingTool(undefined);
    setToolFormOpen(true);
  };

  const handleEditTool = (id: string) => {
    const tool = findPersistedTool(state, id);
    if (!tool) {
      return;
    }

    setEditingTool(tool);
    setToolFormOpen(true);
  };

  const handleSaveTool = (input: AiToolInput) => {
    if (editingTool) {
      setState((current) => (current ? editAiTool(current, editingTool.id, input) : current));
      showToast("Tool updated successfully.");
      return;
    }

    setState((current) => (current ? addAiTool(current, input) : current));
    showToast("Tool added successfully.");
  };

  const handleDeleteRequest = (id: string) => {
    const tool = findPersistedTool(state, id);
    if (!tool) {
      return;
    }

    setDeleteTool(tool);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTool) {
      return;
    }

    setState((current) => (current ? removeAiTool(current, deleteTool.id) : current));
    showToast("Tool deleted successfully.");
    setDeleteOpen(false);
    setDeleteTool(undefined);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <AiToolsHeader onAddTool={handleAddTool} />

        <StatsRow stats={stats} />

        <AiToolsGrid
          tools={filteredTools}
          isSearchEmpty={isSearchActive}
          onEdit={handleEditTool} onDelete={handleDeleteRequest} />
      </div>

      <ToolFormModal
        open={toolFormOpen}
        onOpenChange={setToolFormOpen}
        tool={editingTool}
        onSave={handleSaveTool}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete tool?"
        description={
          deleteTool
            ? `This will permanently remove "${deleteTool.name}" from your AI tools.`
            : "This will permanently remove this tool."
        }
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export function AiToolsPageContent() {
  return (
    <ToastProvider>
      <AiToolsPageInner />
    </ToastProvider>
  );
}
