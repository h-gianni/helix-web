import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/core/Dialog";
import { Button } from "@/components/ui/core/Button";
import { Progress } from "@/components/ui/core/Progress";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { useConfigStore } from "@/store/config-store";
import { 
  useOnboardingStore,
  useCompleteOnboarding,
  useStepValidation
} from "@/store/onboarding-store";
import OrganizationConfig from "./_organization";
import ActionsConfig from "./_actions";
import TeamSetup from "./_teams";
import OrganizationSummary from "./_organization-summary";
import TeamsSummary from "./_teams-summary";
import OrgActionsSummary from "./_actions-summary";

interface SetupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteSetup: () => void;
}

const steps = [
  { id: "org", title: "Organisation Details" },
  { id: "actions", title: "Organisation Actions List" },
  { id: "team", title: "Create Team" },
  { id: "summary", title: "Summary" },
];

function SetupDialog({
  isOpen,
  onClose,
  onCompleteSetup,
}: SetupDialogProps) {

  const { validateStep } = useStepValidation();
  const config = useConfigStore((state) => state.config);

  const { 
    currentStep, 
    setCurrentStep,
    selectedCategory, 
    setSelectedCategory,
    isCompleting,
    error,
    syncTeamCategories
  } = useOnboardingStore();

  const completeOnboardingMutation = useCompleteOnboarding();

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  const currentStepId = steps[currentStep].id;
  const isStepValid = validateStep(currentStepId);

  // Sync categories when moving to "team" step
  useEffect(() => {
    if (currentStepId === "team") {
      syncTeamCategories();
    }
  }, [currentStepId, syncTeamCategories]);

  // Sync when selected categories change
  useEffect(() => {
    if (currentStepId === "team" && Object.keys(config.activities.selectedByCategory || {}).length > 0) {
      syncTeamCategories();
    }
  }, [config.activities.selectedByCategory, currentStepId, syncTeamCategories]);

  const handleNext = async () => {
    if (!validateStep(currentStepId)) {
      return;
    }

    // Sync categories before moving to the "team" step
    if (currentStepId === "actions" && steps[currentStep + 1]?.id === "team") {
      syncTeamCategories();
    }

    if (isLastStep) {
      try {
        await completeOnboardingMutation.mutateAsync();
        onCompleteSetup();
      } catch (err) {
        console.error("Onboarding completion failed:", err);
      }
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderStepContent = () => {
    switch (currentStepId) {
      case "org":
        return <OrganizationConfig />;
      case "actions":
        return (
          <ActionsConfig
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        );
      case "team":
        return <TeamSetup />;
      case "summary":
        return (
          <div className="space-y-6">
            <OrganizationSummary />
            <OrgActionsSummary />
            <TeamsSummary onEdit={() => setCurrentStep(2)} variant="setup" />
            {error && (
              <div className="p-4 border border-destructive/50 bg-destructive/10 rounded-md text-destructive">
                {error}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] overflow-y-auto">
        <DialogHeader className="p-6 border-b">
          <DialogTitle>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-baseline gap-2">
                <span className="heading-2">
                  Step {currentStep + 1} of {steps.length}:
                </span>
                <span className="heading-2">{steps[currentStep].title}</span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Dialog Content */}
        <div className="p-6 flex-1 overflow-auto">
          {renderStepContent()}
        </div>

        <DialogFooter className="p-6">
          <Progress
            value={((currentStep + 1) / steps.length) * 100}
            className="absolute top-0 left-0 w-full rounded-none h-[2px]"
          />
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isFirstStep || isCompleting}
            >
              <ArrowLeft className="mr-2" />
              Back
            </Button>
            <Button onClick={handleNext} disabled={isCompleting || !isStepValid}>
              {isCompleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isLastStep ? (
                "Complete Setup"
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2" />
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SetupDialog;
