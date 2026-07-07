import { AiToolCard } from "@/components/ai-tools/ai-tool-card";
import { SearchEmptyState } from "@/components/shared/search-empty-state";
import type { AiTool } from "@/components/ai-tools/types";

export interface AiToolsGridProps {
  tools: AiTool[];
  isSearchEmpty?: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function AiToolsGrid({ tools, isSearchEmpty = false, onEdit, onDelete }: AiToolsGridProps) {
  if (isSearchEmpty && tools.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-card shadow-xs">
        <SearchEmptyState />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {tools.map((tool) => (
        <AiToolCard key={tool.id} tool={tool} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
