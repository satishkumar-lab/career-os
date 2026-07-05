import { AiToolCard } from "@/components/ai-tools/ai-tool-card";
import type { AiTool } from "@/components/ai-tools/types";

export function AiToolsGrid({ tools }: { tools: AiTool[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {tools.map((tool) => (
        <AiToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
}
