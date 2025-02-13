// src/components/SetupGuide.tsx
import { useSetupStore } from "@/store/setup-store";
import { useState } from "react";
import { useTeams } from "@/store/team-store";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/core/Card";
import { Button } from "@/components/ui/core/Button";
import { Badge } from "@/components/ui/core/Badge";
import { Building2, Users, Target, Check } from "lucide-react";
import { DialogWithConfig } from "@/components/ui/core/Dialog";
import TeamActivitiesConfig from "@/app/dashboard/settings/teams/_components/_teamActivitiesConfig";

interface SetupGuideProps {
  onCreateTeam: () => void;
}

export const SetupGuide = ({ onCreateTeam }: SetupGuideProps) => {
    const router = useRouter();
    const { data: teams = [] } = useTeams();
    const [isTeamActivitiesModalOpen, setIsTeamActivitiesModalOpen] = useState(false);
    const { 
      currentStep, 
      steps, 
      isActivityModalOpen, 
      toggleActivityModal,
      completeStep,
      completeSetup 
    } = useSetupStore();

  const handleDoneAddingActivities = () => {
    completeStep("addActivities");
    toggleActivityModal();
  };

  const handleTeamActivitiesComplete = async () => {
    completeStep("configureTeamActivities");
    completeSetup(); // This will trigger showing new content
    setIsTeamActivitiesModalOpen(false);
  };

  const setupSteps = [
    {
      icon: Building2,
      activeTitle: "1. Add Org activities",
      completedTitle: "Org activities added",
      description:
        "These are activites that are important and relevant to your organisation.",
      time: "Est. 3-5 min avg",
      activeAction: "Add org activities",
      completedAction: "Go to Activities settings",
      onClick: () => toggleActivityModal(),
      completedClick: () =>
        router.push("/dashboard/settings/business-activities"),
      isActive: currentStep === 1,
      isCompleted: steps.addActivities,
    },
    {
      icon: Users,
      activeTitle: "2. Create a Team",
      completedTitle: "Team added",
      description:
        "Create your team and adding team members to it. You can create more than one team.",
      time: "Est. 1-2 min for a tema of 5",
      activeAction: "Create a team",
      completedAction: "Go to Teams",
      onClick: onCreateTeam,
      completedClick: () => router.push("/dashboard/teams"),
      isActive: currentStep === 2,
      isCompleted: steps.createTeam,
    },
    {
      icon: Target,
      activeTitle: "3. Configure activities for each team you create",
      completedTitle: "Activities per team configured",
      description:
        "You might have more than one team with different activites because of different responsabilities.",
      time: "Est. 10-30 sec per team",
      activeAction: "Select activites for your team",
      completedAction: "Go to Team settings",
      onClick: () => setIsTeamActivitiesModalOpen(true),
      completedClick: () => router.push("/dashboard/settings/teams"),
      isActive: currentStep === 3,
      isCompleted: steps.configureTeamActivities,
    },
  ];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {setupSteps.map(
          ({
            icon: Icon,
            activeTitle,
            completedTitle,
            description,
            time,
            activeAction,
            completedAction,
            onClick,
            completedClick,
            isActive,
            isCompleted,
          }) => (
            <Card
              key={activeTitle}
              size="sm"
              className={isActive ? "shadow-lg" : ""}
            >
              <CardContent>
                <div className="flex flex-col items-center space-y-base p-base">
                  <div
                    className={cn(
                      "size-8 rounded-pill p-xs",
                      isCompleted
                        ? "ui-background-success-weakest"
                        : "ui-background-primary-weakest"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="ui-text-success" />
                    ) : (
                      <Icon className="ui-text-primary" />
                    )}
                  </div>
                  <div className="space-y-xxs">
                    <h3 className="ui-text-heading-4">
                      {isCompleted ? completedTitle : activeTitle}
                    </h3>
                    <p className="ui-text-helper text-center">{description}</p>
                  </div>
                  <div className="flex-none space-y-base">
                    <div className="block">
                      <Badge
                        variant={isCompleted ? "success" : "default"}
                        volume="moderate"
                      >
                        {isCompleted ? "Completed" : time}
                      </Badge>
                    </div>
                    <Button
                      variant={isCompleted ? "neutral" : "primary"}
                      volume={isCompleted ? "moderate" : "loud"}
                    //   size={isCompleted ? "base" : "lg"}
                    //   shape={isCompleted ? "beveled" : "rounded"}
                      onClick={isCompleted ? completedClick : onClick}
                      disabled={!isActive && !isCompleted}
                    >
                      {isCompleted ? completedAction : activeAction}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>

      <DialogWithConfig
        title="Add Organization Activities"
        size="xl"
        footer="two-actions"
        fullHeight
        open={isActivityModalOpen}
        onOpenChange={toggleActivityModal}
        footerConfig={{
          primaryAction: {
            label: "Done adding activities",
            onClick: handleDoneAddingActivities,
          },
          secondaryAction: {
            label: "Cancel",
            onClick: toggleActivityModal,
          },
          textAction: undefined,
        }}
      >
        <div className="text-center py-6">
          <p className="text-base mb-6">
            This is a temporary placeholder for adding organization activities.
          </p>
        </div>
      </DialogWithConfig>

      {/* Add TeamActivitiesConfig Dialog */}
      <DialogWithConfig
        title="Configure Team Activities"
        size="xl"
        footer="two-actions"
        fullHeight
        open={isTeamActivitiesModalOpen}
        onOpenChange={setIsTeamActivitiesModalOpen}
        footerConfig={{
          primaryAction: {
            label: "Update team settings",
            onClick: handleTeamActivitiesComplete,
          },
          secondaryAction: {
            label: "Cancel",
            onClick: () => setIsTeamActivitiesModalOpen(false),
          },
        }}
      >
        <TeamActivitiesConfig
          teamId={teams[0]?.id} // Use the first team since this is initial setup
          onUpdate={async () => {
            // Any additional updates needed
          }}
        />
      </DialogWithConfig>
    </>
  );
};
