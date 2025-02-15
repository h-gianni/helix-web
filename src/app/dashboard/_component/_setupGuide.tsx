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
  const [isTeamActivitiesModalOpen, setIsTeamActivitiesModalOpen] =
    useState(false);
  const {
    currentStep,
    steps,
    isActivityModalOpen,
    toggleActivityModal,
    completeStep,
    completeSetup,
  } = useSetupStore();

  const setupSteps = [
    {
      icon: Building2,
      activeTitle: "1. Configure your Org",
      completedTitle: "Org configured",
      description:
        "These are activites that are important and relevant to your organisation.",
      time: "Est. 1-5 min",
      activeAction: "Configure your Org",
      completedAction: "Org settings",
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
      time: "Est. 15 sec",
      activeAction: "Create a team",
      completedAction: "Go to Teams",
      onClick: onCreateTeam,
      completedClick: () => router.push("/dashboard/teams"),
      isActive: currentStep === 2,
      isCompleted: steps.createTeam,
    },
    {
      icon: Target,
      activeTitle: "3. Configure your team",
      completedTitle: "Team configured",
      description:
        "You might have more than one team with different activites because of different responsabilities.",
      time: "Est. 10 to 45 sec",
      activeAction: "Configure your team",
      completedAction: "Go to Team settings",
      onClick: () => setIsTeamActivitiesModalOpen(true),
      completedClick: () => router.push("/dashboard/settings/teams"),
      isActive: currentStep === 3,
      isCompleted: steps.configureTeamActivities,
    },
  ];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {setupSteps.map((step) => (
          <Card
            key={step.activeTitle}
            className={cn(step.isActive && "ring-2 ring-primary shadow-lg")}
          >
            <CardContent>
              <div className="flex flex-col h-full gap-4 p-4">
                <div className="flex justify-between items-start gap-8">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      step.isCompleted ? "bg-success" : "bg-primary/10",
                    )}
                  >
                    {step.isCompleted ? (
                      <Check className="h-5 w-5 text-success-foreground" />
                    ) : (
                      <step.icon className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <Badge variant="secondary" className={step.isCompleted ? "opacity-50" : "opacity-100"}>
                    {step.isCompleted ? "Completed" : step.time}
                  </Badge>
                </div>

                <div className="flex-1 text-left space-y-1.5">
                  <h3 className="heading-3">
                    {step.isCompleted ? step.completedTitle : step.activeTitle}
                  </h3>
                  <p className="body-sm text-foreground-weak">{step.description}</p>
                </div>

                <div className="flex flex-col gap-4">
                  <Button
                    variant={step.isCompleted ? "outline" : "default"}
                    onClick={
                      step.isCompleted ? step.completedClick : step.onClick
                    }
                    disabled={!step.isActive && !step.isCompleted}
                    className="w-full"
                  >
                    {step.isCompleted
                      ? step.completedAction
                      : step.activeAction}
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
            <p className="text-foreground-muted">
              This is a temporary placeholder for adding organization
              activities.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={toggleActivityModal}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                completeStep("addActivities");
                toggleActivityModal();
              }}
            >
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
