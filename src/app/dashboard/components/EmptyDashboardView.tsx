// app/dashboard/components/EmptyDashboardView.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Users, Plus } from "lucide-react";
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

  // Handler for starting onboarding
  const handleStartOnboarding = () => {
    router.push("/dashboard/onboarding/intro");
  };

  return (
    <div className="text-center space-y-4 p-2 lg:p-8">
      <div className="space-y-0">
        <div className="flex items-center mx-auto justify-center size-20 rounded-full p-4">
            <div className="mx-auto">
              <Image src={LogoImage} alt="JustScore" className="size-16" />
            </div>
        </div>

        {!showSuccessMessage ? (
          <div className="space-y-6">
            <h1 className="display-1">JustScore</h1>
            <div className="space-y-2">
            <p className="body-lg max-w-xl mx-auto">
              Get started by configuring the app in four easy steps:
            </p>
            <Badge data-slot="badge" variant="secondary">Est. 1-3 min</Badge>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <h1 className="display-1">You have successfully set up UpScore</h1>
            <p className="body-lg max-w-xl mx-auto">
              Now you can create more teams and add your members to the relevant
              team. Enjoy.
            </p>
            <div className="flex gap-2 justify-center py-4">
              <Button
                data-slot="button"
                variant="secondary"
                onClick={() => router.push("/dashboard/teams")}
              >
                Go to teams
              </Button>
              <Button
                data-slot="button"
                variant="default"
                onClick={() => router.push(`/dashboard/teams/${firstTeam?.id}`)}
              >
                Add members to {firstTeam?.name || "team"}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-[1200px] mx-auto py-4 space-y-4">
        {/* Replace the Onboarding component with a button that redirects */}
        <Card data-slot="card" className="max-w-6xl mx-auto">
          <CardContent data-slot="card-content" className="p-8">
            <div className="space-y-6 text-center">
              <h2 className="heading-2">Ready to get started?</h2>
              <p className="body-lg max-w-xl mx-auto">
                Configure your organization, set up actions, and create teams to start measuring performance.
              </p>
              
              <div className="pt-4">
                <Button 
                  data-slot="button"
                  size="xl" 
                  variant="primary"
                  onClick={handleStartOnboarding}
                >
                  Start Configuration
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default EmptyDashboardView;