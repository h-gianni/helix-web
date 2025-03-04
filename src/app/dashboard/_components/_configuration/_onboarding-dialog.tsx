import React from "react";
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
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useConfigStore } from '@/store/config-store';
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
  const [currentStep, setCurrentStep] = React.useState(0);
  const [selectedCategory, setSelectedCategory] = React.useState("engineering");

  // Get the first category from action categories on initial load
  const { config } = useConfigStore();

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {

  // You can save the current category before moving to the next step
  if (steps[currentStep].id === "activities") {
    // You could potentially store the last selected category in the config store
    // for persistence if needed
  }


    if (isLastStep) {
      onCompleteSetup();
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
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
            <div className="space-y-4">
              <OrganizationSummary />
              <TeamsSummary onEdit={() => setCurrentStep(2)} variant="setup" />
              <OrgActionsSummary  />
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
              disabled={isFirstStep}
            >
              <ArrowLeft />
              Back
            </Button>
            <Button onClick={handleNext}>
              {isLastStep ? (
                "Complete Setup"
              ) : (
                <>
                  Next
                  <ArrowRight />
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