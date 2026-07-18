import { cn } from "@/lib/utils";
import { onboardingStepLabels } from "@/lib/linkedin-agent/constants";

export interface OnboardingProgressProps {
  currentStep: number;
  totalSteps?: number;
}

export function OnboardingProgress({ currentStep, totalSteps = onboardingStepLabels.length }: OnboardingProgressProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
        <span>
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span>{onboardingStepLabels[currentStep]}</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              index <= currentStep ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>
    </div>
  );
}
