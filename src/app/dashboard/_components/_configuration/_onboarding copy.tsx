import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Users, Target, Check } from "lucide-react";
import { Button } from "@/components/ui/core/Button";
import { Card, CardContent } from "@/components/ui/core/Card";
import { Badge } from "@/components/ui/core/Badge";
import { cn } from "@/lib/utils";
import { useTeams } from "@/store/team-store";
import { useSetupStore } from "@/store/setup-store";
import SetupDialog from "./_onboarding-dialog";

interface OnboardingProps {
  onCreateTeam: () => void;
}

export function Onboarding({ onCreateTeam }: OnboardingProps) {
  const router = useRouter();
  const { data: teams = [] } = useTeams();
  const [isSetupDialogOpen, setIsSetupDialogOpen] = useState(false);
  const { currentStep, steps, completeStep, completeSetup } = useSetupStore();

  const handleCompleteSetup = () => {
    completeStep("addActivities");
    completeStep("createTeam");
    completeStep("configureTeamActivities");
    completeSetup();
    setIsSetupDialogOpen(false);
  };

  const setupSteps = [
    {
      icon: Building2,
      activeTitle: "1. Configure your Org",
      completedTitle: "Org configured",
      description:
        "These are activities that are important and relevant to your organisation.",
      time: "Est. 1-5 min",
      activeAction: "Configure your Org",
      completedAction: "Org settings",
      onClick: () => setIsSetupDialogOpen(true),
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
        "Create your team and add team members to it. You can create more than one team.",
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
        "You might have more than one team with different activities because of different responsibilities.",
      time: "Est. 10 to 45 sec",
      activeAction: "Configure your team",
      completedAction: "Go to Team settings",
      onClick: () => setIsSetupDialogOpen(true),
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
            data-slot="card"
            key={step.activeTitle}
            className={cn(step.isActive && "ring-2 ring-primary shadow-lg")}
          >
            <CardContent data-slot="card-content">
              <div className="flex flex-col h-full gap-4 p-4">
                <div className="flex justify-between items-start gap-8">
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full",
                      step.isCompleted ? "bg-success" : "bg-primary/10"
                    )}
                  >
                    {step.isCompleted ? (
                      <Check className="size-5 text-success-foreground" />
                    ) : (
                      <step.icon className="size-5 text-primary" />
                    )}
                  </div>
                  <Badge
                    data-slot="badge"
                    variant="secondary"
                    className={step.isCompleted ? "opacity-50" : "opacity-100"}
                  >
                    {step.isCompleted ? "Completed" : step.time}
                  </Badge>
                </div>

                <div className="flex-1 text-left space-y-1.5">
                  <h3 className="heading-3">
                    {step.isCompleted ? step.completedTitle : step.activeTitle}
                  </h3>
                  <p className="body-sm">
                    {step.description}
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <Button
                    data-slot="button"
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

      <SetupDialog
        isOpen={isSetupDialogOpen}
        onClose={() => setIsSetupDialogOpen(false)}
        onCompleteSetup={handleCompleteSetup}
      />
    </>
  );
}