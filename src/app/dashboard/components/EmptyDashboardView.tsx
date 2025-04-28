// app/dashboard/components/EmptyDashboardView.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/core/Button";
import { Card, CardContent } from "@/components/ui/core/Card";
import { Badge } from "@/components/ui/core/Badge";
import Image from "next/image";
import LogoImage from "@/assets/shared/logo.svg";
import { useTeams } from "@/store/team-store";
import { useSetupStore } from "@/store/setup-store";

interface EmptyDashboardViewProps {
  onCreateTeam: () => void;
}

function EmptyDashboardView({ onCreateTeam }: EmptyDashboardViewProps) {
  const { steps } = useSetupStore();
  const { data: teams = [] } = useTeams();
  const router = useRouter();
  const showSuccessMessage = steps.configureTeamActivities;
  const firstTeam = teams[0];

  // Handler for going to onboarding or setup
  const handleContinueSetup = () => {
    // router.push("/dashboard/onboarding/intro");
  };

  return (
    <div className="text-center space-y-4 p-2 lg:p-8">
      <div className="space-y-0">
        <div className="flex items-center mx-auto justify-center size-20 rounded-full p-4">
          <div className="mx-auto">
            <Image src={LogoImage} alt="JustScore" className="size-16" priority />
          </div>
        </div>

        {!showSuccessMessage ? (
          <div className="space-y-6">
            <h1 className="display-1">Welcome to JustScore</h1>
            <div className="space-y-2">
              <p className="body-lg max-w-xl mx-auto">
                To get started, you need to complete the configuration process.
              </p>
              <Badge data-slot="badge" variant="secondary">Est. 1-3 min</Badge>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <h1 className="display-1">Setup complete!</h1>
            <p className="body-lg max-w-xl mx-auto">
              You have successfully set up JustScore. Now you can create more teams and add members.
            </p>
            <div className="flex flex-wrap gap-2 justify-center py-4">
              <Button
                data-slot="button"
                variant="secondary"
                onClick={() => router.push("/dashboard/teams")}
              >
                Go to teams
              </Button>
              {firstTeam && (
                <Button
                  data-slot="button"
                  variant="default"
                  onClick={() => router.push(`/dashboard/teams/${firstTeam.id}`)}
                >
                  Add members to {firstTeam.name}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {!showSuccessMessage && (
        <div className="max-w-[1200px] mx-auto py-4 space-y-4">
          <Card data-slot="card" className="max-w-6xl mx-auto">
            <CardContent data-slot="card-content" className="p-8">
              <div className="space-y-6 text-center">
                <h2 className="heading-2">Complete your configuration</h2>
                <p className="body-lg max-w-xl mx-auto">
                  Set up your organization, actions, and teams to get the most out of JustScore.
                </p>
                
                <div className="pt-4">
                  <Button 
                    data-slot="button"
                    size="xl" 
                    variant="primary"
                    onClick={handleContinueSetup}
                  >
                    Complete Setup
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default EmptyDashboardView;