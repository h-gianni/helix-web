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
import { Input } from "@/components/ui/core/Input";
import { Label } from "@/components/ui/core/Label";
import { Switch } from "@/components/ui/core/Switch";
import { Progress } from "@/components/ui/core/Progress";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  SquareCheckBig,
  Square,
} from "lucide-react";
import { OrganizationCategories } from "./_organizationCategories";
import { activityData } from "@/data/org-activity-data";
import { cn } from "@/lib/utils";
import TeamSetup from "./_teamSetup";

interface SetupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedActivities: string[];
  setSelectedActivities: React.Dispatch<React.SetStateAction<string[]>>;
  onSelectActivity: (activity: string) => void;
  orgName: string;
  setOrgName: React.Dispatch<React.SetStateAction<string>>;
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
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
  selectedActivities,
  onSelectActivity,
  setSelectedActivities,
  orgName,
  setOrgName,
  selectedCategory,
  setSelectedCategory,
  onCompleteSetup,
}) => {
  const [currentStep, setCurrentStep] = React.useState(0);

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
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
        return (
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="org-name">Organisation name</Label>
              <Input
                type="text"
                id="org-name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Enter organisation name"
              />
            </div>
          </div>
        );

      case "activities":
        return (
          <div className="space-y-4">
            <p className="text-base text-foreground-weak">
              Select all important activities in your organization for team
              performance scoring.
            </p>
            <div className="flex items-start gap-12">
              <div className="min-w-56 space-y-4">
                <h4 className="heading-5">Categories</h4>
                <OrganizationCategories
                  onSelect={setSelectedCategory}
                  selectedActivities={selectedActivities}
                />
              </div>

              <div className="w-full space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="heading-5">Activities</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground-muted">
                      Select all
                    </span>
                    <Switch
                      checked={
                        activityData[selectedCategory]?.length > 0 &&
                        activityData[selectedCategory]?.every((activity) =>
                          selectedActivities.includes(activity)
                        )
                      }
                      onCheckedChange={(checked: boolean) => {
                        const activitiesForCategory =
                          activityData[selectedCategory] || [];

                        if (checked) {
                          const newActivities = [
                            ...selectedActivities,
                            ...activitiesForCategory.filter(
                              (activity: string) =>
                                !selectedActivities.includes(activity)
                            ),
                          ];
                          setSelectedActivities(newActivities);
                        } else {
                          const filteredActivities = selectedActivities.filter(
                            (activity: string) =>
                              !activitiesForCategory.includes(activity)
                          );
                          setSelectedActivities(filteredActivities);
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="w-full -space-y-px">
                  {activityData[selectedCategory]?.map((activity) => (
                    <div
                      key={activity}
                      className={cn(
                        "flex items-center gap-4 bg-white text-foreground-weak border px-4 py-3 cursor-pointer hover:border-border-strong hover:bg-background",
                        selectedActivities.includes(activity)
                          ? "bg-primary/10 text-foreground"
                          : "border-border"
                      )}
                      onClick={() => onSelectActivity(activity)}
                    >
                      <div className="size-4">
                        {selectedActivities.includes(activity) ? (
                          <SquareCheckBig className="text-primary w-4 h-4" />
                        ) : (
                          <Square className="text-foreground/25 w-4 h-4" />
                        )}
                      </div>
                      <span className="text-base">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "team":
        return <TeamSetup selectedActivities={selectedActivities} />;

      case "summary":
        return (
          <div className="space-y-6">
            <div className="rounded-lg border p-4">
              <h4 className="font-medium mb-2">Organisation Details</h4>
              <p>{orgName}</p>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="font-medium mb-2">Selected Activities</h4>
              <div className="space-y-2">
                {selectedActivities.map((activity) => (
                  <div key={activity} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    <span>{activity}</span>
                  </div>
                ))}
              </div>
            </div>
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
          <Progress
            value={((currentStep + 1) / steps.length) * 100}
            className="absolute top-0 -ml-8 w-full rounded-none h-[2px]" 
          />
          {renderStepContent()}
        </DialogBody>

        <DialogFooter className="p-6 border-t">
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isFirstStep}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleNext}>
              {isLastStep ? (
                "Complete Setup"
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
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