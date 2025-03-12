import React, { useState } from "react";
import { Building2, Users, Target, Check } from "lucide-react";
import { Button } from "@/components/ui/core/Button";
import { Card, CardContent } from "@/components/ui/core/Card";
import { Badge } from "@/components/ui/core/Badge";
import { Separator } from "@/components/ui/core/Separator";
import { cn } from "@/lib/utils";
import { useTeams } from "@/store/team-store";
import { useSetupStore } from "@/store/setup-store";
import SetupDialog from "./_onboarding-dialog";

interface OnboardingProps {
  onCreateTeam: () => void;
}

export function Onboarding({ onCreateTeam }: OnboardingProps) {
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
      activeTitle: "1. Configure your Organisation",
      completedTitle: "Org configured",
      description:
        "These are activities that are important and relevant to your organisation.",
      time: "Est. 1-5 min",
      isCompleted: steps.addActivities,
    },
    // {
    //   icon: Target,
    //   activeTitle: "2. Select your Org actions",
    //   completedTitle: "Team configured",
    //   description:
    //     "You might have more than one team with different activities because of different responsibilities.",
    //   time: "Est. 1-5 min",
    //   isCompleted: steps.configureTeamActivities,
    // },
    {
      icon: Users,
      activeTitle: "2. Setup your Team/s",
      completedTitle: "Team added",
      description:
        "Create your team and add team members to it. You can create more than one team.",
      time: "Max 15 sec per team",
      isCompleted: steps.createTeam,
    },
  ];

  return (
    <>
      <Card data-slot="card" className="max-w-4xl mx-auto">
        <CardContent data-slot="card-content">
          <div className="grid md:gap-4 md:grid-cols-2">
            {setupSteps.map((step, index) => (
              <div
                className="flex flex-col items-center h-full gap-4 p-4"
                key={step.activeTitle}
              >
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
                </div>

                <div className="flex-1 text-center space-y-1.5">
                  <h3 className="heading-3">
                    {step.isCompleted ? step.completedTitle : step.activeTitle}
                  </h3>
                  <p className="body-sm">{step.description}</p>
                  <div className="py-4">
                    <Badge
                      data-slot="badge"
                      variant="secondary"
                      className={
                        step.isCompleted ? "opacity-50" : "opacity-100"
                      }
                    >
                      {step.isCompleted ? "Completed" : step.time}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 pt-10 flex items-center justify-center">
            <Button
              data-slot="button"
              size="lg"
              variant="default"
              onClick={() => setIsSetupDialogOpen(true)}
              className=""
            >
              Configure Setup
            </Button>
          </div>
        </CardContent>
      </Card>

      <SetupDialog
        isOpen={isSetupDialogOpen}
        onClose={() => setIsSetupDialogOpen(false)}
        onCompleteSetup={handleCompleteSetup}
      />
    </>
  );
}
