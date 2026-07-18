"use client";

import { useEffect, useState } from "react";

import { OnboardingConnectStep } from "@/components/linkedin-agent/onboarding/onboarding-connect-step";
import { OnboardingProgress } from "@/components/linkedin-agent/onboarding/onboarding-progress";
import {
  OnboardingStepCareer,
  OnboardingStepExperience,
  OnboardingStepFrequency,
  OnboardingStepGoal,
  OnboardingStepLocation,
  OnboardingStepNiche,
  OnboardingStepTone,
} from "@/components/linkedin-agent/onboarding/onboarding-steps";
import { Button } from "@/components/ui/button";
import { ONBOARDING_STEP_COUNT } from "@/lib/linkedin-agent/constants";
import { profileToForm, validateOnboardingStep } from "@/lib/linkedin-agent/form-utils";
import type { LinkedInAgentOnboardingForm, LinkedInAgentProfile } from "@/lib/linkedin-agent/types";
import { cardShell, contentCardRadius } from "@/lib/interaction-styles";
import { cn } from "@/lib/utils";

export interface LinkedInOnboardingWizardProps {
  initialProfile: LinkedInAgentProfile | null;
  onSaveProgress: (
    form: LinkedInAgentOnboardingForm,
    options?: { skipped?: boolean; completed?: boolean }
  ) => Promise<void>;
  onConnectPlaceholder: () => void;
  isSaving?: boolean;
}

export function LinkedInOnboardingWizard({
  initialProfile,
  onSaveProgress,
  onConnectPlaceholder,
  isSaving = false,
}: LinkedInOnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<LinkedInAgentOnboardingForm>(() => profileToForm(initialProfile));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(profileToForm(initialProfile));
  }, [initialProfile]);

  const isLastStep = step === ONBOARDING_STEP_COUNT - 1;
  const isConnectStep = step === ONBOARDING_STEP_COUNT - 1;

  function updateField(field: keyof LinkedInAgentOnboardingForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    if (error) {
      setError(null);
    }
  }

  async function persistCurrentProgress(options?: { skipped?: boolean; completed?: boolean }) {
    await onSaveProgress(form, options);
  }

  async function handleContinue() {
    if (!isConnectStep) {
      const validationError = validateOnboardingStep(step, form);

      if (validationError) {
        setError(validationError);
        return;
      }
    }

    if (isLastStep) {
      await persistCurrentProgress({ completed: true });
      return;
    }

    await persistCurrentProgress();
    setStep((current) => Math.min(current + 1, ONBOARDING_STEP_COUNT - 1));
    setError(null);
  }

  async function handleSkip() {
    await persistCurrentProgress({ skipped: true });
  }

  function handleBack() {
    setStep((current) => Math.max(current - 1, 0));
    setError(null);
  }

  function renderStep() {
    const stepProps = { form, onChange: updateField, error };

    switch (step) {
      case 0:
        return <OnboardingStepCareer {...stepProps} />;
      case 1:
        return <OnboardingStepExperience {...stepProps} />;
      case 2:
        return <OnboardingStepGoal {...stepProps} />;
      case 3:
        return <OnboardingStepTone {...stepProps} />;
      case 4:
        return <OnboardingStepFrequency {...stepProps} />;
      case 5:
        return <OnboardingStepLocation {...stepProps} />;
      case 6:
        return <OnboardingStepNiche {...stepProps} />;
      case 7:
        return <OnboardingConnectStep onConnectPlaceholder={onConnectPlaceholder} />;
      default:
        return null;
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <p className="text-[11px] font-medium tracking-[0.08em] text-primary uppercase">AI LinkedIn Agent</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-[24px]">
          Set up your workspace
        </h1>
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          A quick onboarding flow to personalize your future AI LinkedIn experience.
        </p>
      </div>

      <div className={cn(contentCardRadius, cardShell, "p-6 sm:p-8")}>
        <OnboardingProgress currentStep={step} />

        <div className="mt-8 min-h-[220px]">{renderStep()}</div>

        <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            className="rounded-2xl text-muted-foreground"
            onClick={() => void handleSkip()}
            disabled={isSaving}
          >
            Skip for Now
          </Button>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl"
              onClick={handleBack}
              disabled={step === 0 || isSaving}
            >
              Back
            </Button>
            <Button
              type="button"
              className="rounded-2xl"
              onClick={() => void handleContinue()}
              disabled={isSaving}
            >
              {isLastStep ? "Finish Setup" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
