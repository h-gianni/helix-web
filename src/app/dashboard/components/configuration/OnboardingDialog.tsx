import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/core/Dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/core/Tooltip";
import { Button } from "@/components/ui/core/Button";
import { Separator } from "@/components/ui/core/Separator";
import { Progress } from "@/components/ui/core/Progress";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { useConfigStore } from "@/store/config-store";
import {
  useOnboardingStore,
  useCompleteOnboarding,
  useStepValidation,
} from "@/store/onboarding-store";
import OrganizationConfig from "./ConfigurationOrganization";
import ActionsConfig from "./ConfigurationActions";
import TeamSetup from "./ConfigurationTeams";
import OrganizationSummary from "./ConfigurationOrganizationSummary";
import TeamsSummary from "./ConfigurationTeamsSummary";
import OrgActionsSummary from "./ConfigurationActionsSummary";

interface SetupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteSetup: () => void;
}

const steps = [
  { id: "organization", title: "Organisation & Actions" },
  { id: "team", title: "Create Team" },
  { id: "summary", title: "Summary" },
];

function SetupDialog({ isOpen, onClose, onCompleteSetup }: SetupDialogProps) {
  const { validateStep } = useStepValidation();
  const config = useConfigStore((state) => state.config);

  const {
    currentStep,
    setCurrentStep,
    selectedCategory,
    setSelectedCategory,
    isCompleting,
    syncTeamCategories,
    setIsCompleting,
    setError, 
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
    if (
      currentStepId === "team" &&
      Object.keys(config.activities.selectedByCategory || {}).length > 0
    ) {
      syncTeamCategories();
    }
  }, [config.activities.selectedByCategory, currentStepId, syncTeamCategories]);

  const handleNext = async () => {
    console.log("handleNext called, step:", currentStepId);
    
    if (!validateStep(currentStepId)) {
      return;
    }
  
    if (isLastStep) {
      try {
        setIsCompleting(true);
        console.log("Attempting mutation...");
        await completeOnboardingMutation.mutateAsync();
        console.log("Mutation successful, closing dialog");
        onCompleteSetup();
        onClose(); // Force dialog close
      } catch (err) {
        console.error("Onboarding completion failed:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsCompleting(false);
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
      case "organization":
        return (
          <div className="space-y-8">
            <OrganizationConfig />
            <Separator />
            <ActionsConfig
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              setSelectedActions={() => {}}
            />
          </div>
        );
      case "team":
        return <TeamSetup />;
      case "summary":
        return (
          <div className="grid grid-cols-2 gap-4">
            <OrgActionsSummary onEdit={() => setCurrentStep(0)} />
            <TeamsSummary onEdit={() => setCurrentStep(1)} variant="setup" />
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* 
        Make DialogContent full screen with a flex column layout
        Removed max-w-6xl in favor of full screen
        Removed h-[90vh] in favor of h-screen 
      */}
      <DialogContent className="w-[96%] h-[96%] max-w-7xl p-0 m-auto rounded-md flex flex-col overflow-hidden">
        <DialogHeader className="p-6 border-b shrink-0">
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

        {/* Scrollable content area that takes available height */}
        <div className="flex-1 px-6 pt-2 pb-6 overflow-y-auto">{renderStepContent()}</div>

        {/* Fixed footer */}
        <DialogFooter className="relative p-6 border-t shrink-0">
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isFirstStep || isCompleting}
            >
              <ArrowLeft className="mr-2" />
              Back
            </Button>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      onClick={handleNext}
                      disabled={isCompleting || !isStepValid}
                    >
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
                </TooltipTrigger>
                {!isStepValid && currentStepId === "team" && (
                  <TooltipContent className="max-w-xs">
                    Please give a name to the team and have at least one action
                    category checked.
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
          {/* Fixed header with Progress bar positioned on top */}
          <Progress
            value={((currentStep + 1) / steps.length) * 100}
            className="absolute top-0 left-0 w-full rounded-none h-[2px] z-10"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SetupDialog;
