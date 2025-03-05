import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@/components/ui/core/Dialog";
import { Button } from "@/components/ui/core/Button";
import { Progress } from "@/components/ui/core/Progress";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
// import { useToast } from '@/components/ui/core/Toast';
import { useConfigStore } from '@/store/config-store';
import { 
  useOnboardingStore,
  useCompleteOnboarding,
  useStepValidation
} from '@/store/onboarding-store';
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
  { id: "activities", title: "Activities List" },
  { id: "team", title: "Create Team" },
  { id: "summary", title: "Summary" },
];

const SetupDialog: React.FC<SetupDialogProps> = ({
  isOpen,
  onClose,
  onCompleteSetup,
}) => {
  //const { toast } = useToast();
  const { validateStep } = useStepValidation();
  const config = useConfigStore((state) => state.config);
  
  // Onboarding store state
  const { 
    currentStep, 
    setCurrentStep,
    selectedCategory, 
    setSelectedCategory,
    isCompleting,
    error 
  } = useOnboardingStore();
  
  // Mutation for completing onboarding
  const completeOnboardingMutation = useCompleteOnboarding();

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  
  // Get current step info
  const currentStepId = steps[currentStep].id;
  const isStepValid = validateStep(currentStepId);

  // Debug log whenever important state changes
  useEffect(() => {
    if (currentStepId === "team") {
      console.log("Teams validation:", {
        teams: config.teams,
        isValid: isStepValid,
        teamCount: config.teams.length,
        teamsWithNames: config.teams.filter(t => !!t.name?.trim()).length,
        teamsWithFunctions: config.teams.filter(t => t.functions?.length > 0).length
      });
    }
  }, [currentStepId, config.teams, isStepValid]);

  const handleNext = async () => {
    console.log("Next clicked:", { 
      currentStepId, 
      isStepValid,
      teams: currentStepId === "team" ? config.teams : 'not-team-step'
    });
    
    // If step isn't valid, don't proceed, but show why
    if (!isStepValid) {
      switch (currentStepId) {
        case "org":
          // toast({
          //   title: "Organization name required",
          //   description: "Please enter your organization name",
          //   variant: "destructive"
          // });
          console.log("Organization name required")
          break;
        case "activities":
          // toast({
          //   title: "Activities required",
          //   description: "Please select at least one activity",
          //   variant: "destructive"
          // });
          console.log("Activities required")
          break; 
        case "team":
          // toast({
          //   title: "Team setup incomplete",
          //   description: "Each team must have a name and at least one function",
          //   variant: "destructive"
          // });
          console.log("Team setup incomplete")
          break;
      }
      return;
    }

    if (isLastStep) {
      try {
        // Complete onboarding by saving to the database
        const result = await completeOnboardingMutation.mutateAsync();
        
        // Show success toast
        // toast({
        //   title: "Onboarding Completed!",
        //   description: `Created ${result.teams.length} teams with ${result.activitiesCount} activities`,
        //   variant: "success",
        // });
        console.log("Onboarding completed!");
        
        // Call the completion callback
        onCompleteSetup();
      } catch (err) {
        // Toast is handled by the mutation
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

      case "activities":
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
            <OrganizationSummary  />
            <OrgActionsSummary 
              // onEdit={() => setCurrentStep(1)} 
              // selectedCategory={selectedCategory}
            />
            <TeamsSummary 
              onEdit={() => setCurrentStep(2)} 
              variant="setup" 
            />
            
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
      <DialogContent className="max-w-6xl h-[90vh]" scrollable>
        <DialogHeader className="p-6 border-b">
          <DialogTitle>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-baseline gap-2">
                <span className="heading-2 text-foreground-muted">
                  Step {currentStep + 1} of {steps.length}:
                </span>
                <span className="heading-2">{steps[currentStep].title}</span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          {renderStepContent()}
        </DialogBody>

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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SetupDialog;