"use client";

import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { Button } from "@/components/ui/core/Button";
import { Loader } from "@/components/ui/core/Loader";
import { AlertCircle, RotateCcw } from "lucide-react";
import TeamCreateModal from "./components/teams/TeamsCreateModal";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import EmptyDashboardView from "./components/EmptyDashboardView";
import { useTeams, useCreateTeam } from "@/store/team-store";
import { useSetupStore } from "@/store/setup-store";
import { useOrgStore } from "@/store/org-store";
import { useOrgSetupForSetup } from "@/store/setup-store";
import { usePerformers } from "@/store/performers-store";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { completeStep, isSetupComplete, steps } = useSetupStore();
  const [shouldShowDashboard, setShouldShowDashboard] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Use the hook that automatically syncs organization data to setup steps
  const { isLoading, error } = useOrgSetupForSetup();

  // Use the org store
  const organizations = useOrgStore((state) => state.organizations);

  const { mutateAsync: createTeam } = useCreateTeam();

  const handleCreateTeam = async (name: string, teamFunctionId: string) => {
    try {
      const newTeam = await createTeam({ name, teamFunctionId });
      setIsCreateModalOpen(false);
      completeStep("createTeam");
    } catch (error) {
      console.error("Error creating team:", error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader size="base" label="Loading..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
        <Alert data-slot="alert" variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription data-slot="alert-description">
            {error instanceof Error ? error.message : "An error occurred"}
          </AlertDescription>
        </Alert>
        <Button
          data-slot="button"
          variant="secondary"
          onClick={() => {
            // refetchOrg();
          }}
        >
          <RotateCcw className="size-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  // If user has completed onboarding, show the dashboard layout with org data
  if (steps.teams) {
    // Get teams from the first organization
    const teams = organizations.length > 0 ? organizations[0].teams : [];

    return (
      <>
        <DashboardLayout performers={[]} teams={teams} router={router} />
      </>
    );
  }

  return (
    <>
      <EmptyDashboardView onCreateTeam={() => setIsCreateModalOpen(true)} />
      <TeamCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTeam={handleCreateTeam}
      />
    </>
  );
}
