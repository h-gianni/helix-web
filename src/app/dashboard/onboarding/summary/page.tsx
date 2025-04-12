// app/dashboard/onboarding/summary/page.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/core/Button";
import { Loader2 } from "lucide-react";
import PageNavigator from "../components/PageNavigator";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { AlertCircle } from "lucide-react";
import { useOnboardingConfig } from "@/hooks/useOnboardingConfig";
import { useCompleteOnboarding } from "@/store/onboarding-store";
import { useSetupStore } from "@/store/setup-store";
import OrganizationSummary from "../../components/configuration/ConfigurationOrganizationSummary";
import OrgActionsSummary from "../../components/configuration/ConfigurationActionsSummary";
import TeamsSummary from "../../components/configuration/ConfigurationTeamsSummary";

export default function SummaryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use our custom hooks
  const { config, isStepComplete } = useOnboardingConfig();
  const { completeSetup } = useSetupStore();

  // Setup mutation
  const completeOnboardingMutation = useCompleteOnboarding();

  // Handle onboarding completion
  const handleComplete = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Submit the configuration data
      await completeOnboardingMutation.mutateAsync();

      // Mark setup as complete
      completeSetup();

      // Navigate to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Onboarding completion failed:", err);
      setError(err instanceof Error ? err.message : "Failed to complete setup");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if all steps are completed
  const isConfigurationValid = isStepComplete.summary();

  return (
    <div>
      <PageNavigator
        title="Review Your Configuration"
        description={
          <>
            Please review your configuration details before finalizing setup.
            You can go back to any step to make changes if needed.
          </>
        }
        previousHref="/dashboard/onboarding/teams"
        nextHref="/dashboard"
        canContinue={isConfigurationValid && !isSubmitting}
        currentStep={5}
        totalSteps={5}
        isLastStep={true}
        disabledTooltip="Please complete all configuration items to continue"
      />

      {/* {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )} */}

      <div className="max-w-6xl mx-auto">
        {/* Complete setup button */}
        <div className="flex justify-center pb-12 -mt-4">
          <Button
            size="xl"
            variant="primary"
            onClick={handleComplete}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Finalizing setup...
              </>
            ) : (
              "Complete Setup"
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {/* Configuration summaries */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
            <div className="space-y-4 h-full">
              <OrganizationSummary
                onEdit={() => router.push("/dashboard/onboarding/organisation")}
                variant="setup"
              />
              <OrgActionsSummary
                onEdit={() =>
                  router.push("/dashboard/onboarding/global-actions")
                }
                variant="setup"
              />
            </div>
            <div className="col-span-2 h-full">
              <TeamsSummary
                onEdit={() => router.push("/dashboard/onboarding/teams")}
                variant="setup"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
