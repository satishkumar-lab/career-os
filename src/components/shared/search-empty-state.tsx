import { cn } from "@/lib/utils";

export interface SearchEmptyStateProps {
  className?: string;
}

export function SearchEmptyState({ className }: SearchEmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-12 text-center", className)}>
      <p className="text-[14px] font-medium text-foreground">No matching results</p>
      <p className="mt-1 text-[13px] font-medium text-muted-foreground">Try a different keyword.</p>
    </div>
  );
}
