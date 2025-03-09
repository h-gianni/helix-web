"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/core/Button";
import { Card, CardContent } from "@/components/ui/core/Card"; // Seems unused, but retained if needed
import { Onboarding } from "./_configuration/_onboarding";
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

  return (
    <div className="text-center space-y-4 p-2 lg:p-8">
      <div className="space-y-4">
        {/* Replaced h-16 w-16 with size-16 */}
        <div className="flex items-center mx-auto justify-center size-16 rounded-full bg-primary/10 p-2">
          {/* Replaced h-8 w-8 with size-8 */}
          <Users className="size-8 text-primary" />
        </div>

        {!showSuccessMessage ? (
          <div className="space-y-2">
            <h1 className="display-1">Welcome to UpScore</h1>
            <p className="body-lg max-w-xl mx-auto">
              Get started by following these steps:
            </p>
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
        <Onboarding onCreateTeam={() => onCreateTeam()} />
      </div>
    </div>
  );
}

export default EmptyDashboardView;
