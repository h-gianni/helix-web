// src/components/SetupGuide.tsx
import { useSetupStore } from '@/store/setup-store';
import { Card, CardContent } from "@/components/ui/core/Card";
import { Button } from "@/components/ui/core/Button";
import { Badge } from "@/components/ui/core/Badge";
import { Building2, Users, Target } from "lucide-react";
import { ActivityModal } from "../settings/business-activities/_components/_activityModal";

interface SetupGuideProps {
  onCreateTeam: () => void;
}

export const SetupGuide = ({ onCreateTeam }: SetupGuideProps) => {
  const { 
    currentStep, 
    steps, 
    isActivityModalOpen, 
    toggleActivityModal,
    completeStep 
  } = useSetupStore();

  // Handler for temporary completion of Step 1
  const handleAddActivities = () => {
    toggleActivityModal();
  };

  // Handler for when the ActivityModal is closed
  const handleModalClose = () => {
    completeStep('addActivities'); // Mark Step 1 as complete when modal closes
    toggleActivityModal();
  };

  const setupSteps = [
    {
      icon: Building2,
      title: "1. Add Org activities",
      description: "These are activites that are important and relevant to your organisation.",
      time: "Est. 3-5 min avg",
      action: "Add org activities",
      onClick: handleAddActivities,
      isActive: currentStep === 1,
      isCompleted: steps.addActivities,
    },
    {
      icon: Users,
      title: "2. Create a Team",
      description: "Create your team and adding team members to it. You can create more than one team.",
      time: "Est. 1-2 min for a tema of 5",
      action: "Create a team",
      onClick: onCreateTeam,
      isActive: currentStep === 2,
      isCompleted: steps.createTeam,
    },
    {
      icon: Target,
      title: "3. Configure activities for each team you create",
      description: "You might have more than one team with different activites because of different responsabilities.",
      time: "Est. 10-30 sec per team",
      action: "Select activites for your team",
      onClick: () => {}, // We'll implement this later
      isActive: currentStep === 3,
      isCompleted: steps.configureTeamActivities,
    },
  ];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {setupSteps.map(({ icon: Icon, title, description, time, action, onClick, isActive, isCompleted }) => (
          <Card key={title} size="sm">
            <CardContent>
              <div className="flex flex-col items-center space-y-base p-base">
                <div className="size-8 rounded-pill ui-background-primary-weakest p-xs">
                  <Icon className="ui-text-primary" />
                </div>
                <div className="space-y-xxs">
                  <h3 className="ui-text-heading-4">{title}</h3>
                  <p className="ui-text-helper text-center">
                    {description}
                  </p>
                </div>
                <div className="flex-none space-y-base">
                  <div className="block">
                    <Badge variant={isCompleted ? "success" : "default"} volume="moderate">
                      {isCompleted ? "Completed" : time}
                    </Badge>
                  </div>
                  <Button
                    size="lg"
                    shape="rounded"
                    variant="primary"
                    onClick={onClick}
                    disabled={!isActive}
                  >
                    {action}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => toggleActivityModal()}
        activity={null}
        onUpdate={async () => {
          completeStep('addActivities');
          toggleActivityModal();
        }}
      />

    </>
  );
};