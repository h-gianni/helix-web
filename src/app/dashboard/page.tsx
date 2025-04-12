// app/dashboard/page.tsx
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
import { useSetupStore } from '@/store/setup-store';
import { usePerformers } from "@/store/performers-store";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { completeStep, steps } = useSetupStore();
  const [shouldShowDashboard, setShouldShowDashboard] = useState(true);

  const { 
    data: teams = [], 
    isLoading: isTeamsLoading, 
    error: teamsError,
    refetch: refetchTeams 
  } = useTeams();

  const {
    data: performers = [],
    isLoading: isPerformersLoading,
    error: isPerformersError,
    refetch: refetchPerformers
  } = usePerformers();

  const { mutateAsync: createTeam } = useCreateTeam();

  const isLoading = isTeamsLoading || isPerformersLoading;
  const error = teamsError || isPerformersError;

  // Check if the user has completed setup to determine what to display
  useEffect(() => {
    // If the setup state and teams are loaded, we can make a decision
    if (!isLoading && !error) {
      // Assume the user should see the dashboard if:
      // 1. They have at least one team, OR
      // 2. They have completed any of the setup steps
      const hasAnySetupProgress = Object.values(steps).some(step => step);
      const hasTeams = teams.length > 0;
      
      setShouldShowDashboard(hasTeams || hasAnySetupProgress);
    }
  }, [teams, steps, isLoading, error]);

  const handleCreateTeam = async (name: string, teamFunctionId: string) => {
    try {
      const newTeam = await createTeam({ name, teamFunctionId });
      setIsCreateModalOpen(false);
      completeStep('createTeam');
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
            refetchTeams();
            refetchPerformers();
          }}
        >
          <RotateCcw className="size-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  // If user has teams, show the dashboard layout
  if (teams.length > 0) {
    return <DashboardLayout performers={performers} teams={teams} router={router} />;
  }

  // If user should see dashboard based on other criteria (e.g., setup progress),
  // show the empty dashboard view - they can navigate to onboarding from there if needed
  if (shouldShowDashboard) {
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

  // Otherwise, redirect to onboarding - this should rarely happen since middleware should handle this
  useEffect(() => {
    router.push('/dashboard/onboarding/intro');
  }, [router]);

  return null; // Will redirect
}