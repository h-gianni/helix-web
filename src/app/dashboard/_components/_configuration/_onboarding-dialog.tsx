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
  // const { toast } = useToast();
  const { validateStep } = useStepValidation();
  const config = useConfigStore((state) => state.config);
  
  // Onboarding store state
  const { 
    currentStep, 
    setCurrentStep,
    selectedCategory, 
    setSelectedCategory,
    isCompleting,
    error,
    syncTeamCategories
  } = useOnboardingStore();
  
  // Mutation for completing onboarding
  const completeOnboardingMutation = useCompleteOnboarding();

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  
  // Get current step info
  const currentStepId = steps[currentStep].id;
  const isStepValid = validateStep(currentStepId);

  // Sync categories to teams whenever moving between steps
  useEffect(() => {
    if (currentStepId === "team") {
      console.log("Syncing categories to teams in useEffect");
      syncTeamCategories();
    }
  }, [currentStepId, syncTeamCategories]);

  // Additional sync when selected categories change
  useEffect(() => {
    if (currentStepId === "team" && 
        Object.keys(config.activities.selectedByCategory || {}).length > 0) {
      console.log("Categories changed, syncing to teams");
      syncTeamCategories();
    }
  }, [config.activities.selectedByCategory, currentStepId, syncTeamCategories]);

  const handleNext = async () => {
    // Double-check validation before proceeding
    const isCurrentlyValid = validateStep(currentStepId);
    console.log(`Step ${currentStepId} is ${isCurrentlyValid ? 'valid' : 'invalid'}`);
    
    if (!isCurrentlyValid) {
      switch (currentStepId) {
        case "org":
          // toast({
          //   title: "Organization name required",
          //   description: "Please enter your organization name",
          //   variant: "destructive"
          // });
          break;
        case "activities":
          // toast({
          //   title: "Activities required",
          //   description: "Please select at least one activity",
          //   variant: "destructive"
          // });
          break;
        case "team":
          // toast({
          //   title: "Team setup incomplete",
          //   description: "Each team must have a name and at least one function",
          //   variant: "destructive"
          // });
          
          // Additional debug info in console
          console.error("Team validation failed:", {
            teams: config.teams,
            teamsWithNames: config.teams.filter(t => !!t.name?.trim()).length,
            teamsWithFunctions: config.teams.filter(t => 
              t.functions && t.functions.length > 0
            ).length,
            teamsWithCategories: config.teams.filter(t => 
              t.categories && t.categories.length > 0
            ).length
          });
          break;
      }
      return;
    }

    // If moving to team step, ensure categories are synced
    if (currentStepId === "activities" && steps[currentStep + 1].id === "team") {
      // Sync categories before moving to the next step
      syncTeamCategories();
    }

    if (isLastStep) {
      try {
        const result = await completeOnboardingMutation.mutateAsync();
        
        // toast({
        //   title: "Onboarding Completed!",
        //   description: `Created ${result.teams.length} teams with ${result.activitiesCount} activities`,
        //   variant: "success",
        // });
        
        onCompleteSetup();
      } catch (err) {
        // Error handling is done in the mutation
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