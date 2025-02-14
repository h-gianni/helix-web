"use client";

import { useState } from "react";
import { useTeams } from "@/store/team-store";
import { useRouter } from "next/navigation";
import { useSetupStore } from "@/store/setup-store";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/core/Card";
import { Button } from "@/components/ui/core/Button";
import { Badge } from "@/components/ui/core/Badge";
import { Building2, Users, Target, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/core/Dialog";
import TeamActivitiesConfig from "@/app/dashboard/settings/teams/_components/_teamActivitiesConfig";

interface SetupGuideProps {
  onCreateTeam: () => void;
}

export function SetupGuide({ onCreateTeam }: SetupGuideProps) {
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

  const setupSteps = [
    {
      icon: Building2,
      activeTitle: "1. Add Org activities",
      completedTitle: "Org activities added",
      description: "These are activites that are important and relevant to your organisation.",
      time: "Est. 3-5 min avg",
      activeAction: "Add org activities",
      completedAction: "Go to Activities settings",
      onClick: () => toggleActivityModal(),
      completedClick: () => router.push("/dashboard/settings/business-activities"),
      isActive: currentStep === 1,
      isCompleted: steps.addActivities,
    },
    {
      icon: Users,
      activeTitle: "2. Create a Team",
      completedTitle: "Team added",
      description: "Create your team and adding team members to it. You can create more than one team.",
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
      description: "You might have more than one team with different activites because of different responsabilities.",
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
        {setupSteps.map((step) => (
          <Card
            key={step.activeTitle}
            className={cn("p-0", step.isActive && "ring-2 ring-primary")}
          >
            <CardContent>
              <div className="flex flex-col items-center gap-4 p-6">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  step.isCompleted ? "bg-emerald-50" : "bg-primary/10"
                )}>
                  {step.isCompleted ? (
                    <Check className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <step.icon className="h-5 w-5 text-primary" />
                  )}
                </div>
                
                <div className="space-y-2 text-center">
                  <h3 className="font-semibold">
                    {step.isCompleted ? step.completedTitle : step.activeTitle}
                  </h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <Badge variant={step.isCompleted ? "default" : "secondary"}>
                    {step.isCompleted ? "Completed" : step.time}
                  </Badge>
                  
                  <Button
                    variant={step.isCompleted ? "outline" : "default"}
                    onClick={step.isCompleted ? step.completedClick : step.onClick}
                    disabled={!step.isActive && !step.isCompleted}
                    className="w-full"
                  >
                    {step.isCompleted ? step.completedAction : step.activeAction}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isActivityModalOpen} onOpenChange={toggleActivityModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add Organization Activities</DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              This is a temporary placeholder for adding organization activities.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={toggleActivityModal}>
              Cancel
            </Button>
            <Button onClick={() => {
              completeStep("addActivities");
              toggleActivityModal();
            }}>
              Done adding activities
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog 
        open={isTeamActivitiesModalOpen} 
        onOpenChange={setIsTeamActivitiesModalOpen}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Configure Team Activities</DialogTitle>
          </DialogHeader>

          <TeamActivitiesConfig
            teamId={teams[0]?.id}
            onUpdate={async () => {
              // Additional updates if needed
            }}
          />

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsTeamActivitiesModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                completeStep("configureTeamActivities");
                completeSetup();
                setIsTeamActivitiesModalOpen(false);
              }}
            >
              Update team settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}