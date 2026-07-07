import { CareerOsLogo } from "@/components/auth/careeros-logo";
import { cn } from "@/lib/utils";

export interface AuthLoadingScreenProps {
  className?: string;
  message?: string;
}

export function AuthLoadingScreen({
  className,
  message = "Loading CareerOS…",
}: AuthLoadingScreenProps) {
  return (
    <div
      className={cn(
        "flex min-h-svh flex-col items-center justify-center bg-background px-6",
        className
      )}
    >
      <div className="animate-in fade-in zoom-in-95 flex flex-col items-center gap-6 duration-500">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <CareerOsLogo layout="mark" tone="default" size="lg" className="relative animate-pulse" priority />
        </div>
        <p className="text-sm font-medium text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
