"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { Button } from "@/components/ui/core/Button";
import { Loader } from "@/components/ui/core/Loader";
import { AlertCircle, RotateCcw } from "lucide-react";
import TeamCreateModal from "./_components/_teams/_team-create-modal";
import DashboardLayout from "./_components/dashboard/DashboardLayout";
import EmptyDashboardView from "./_components/_empty-dashboard-view";
import { useTeams, useCreateTeam } from "@/store/team-store";
import { useSetupStore } from '@/store/setup-store';
import { useSetupProgress } from '@/hooks/useSetupProgress';
import { usePerformers } from "@/store/performers-store";

export default function DashboardPage() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { completeStep } = useSetupStore();
  const { showMainDashboard } = useSetupProgress();

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
    return <div className="loader"><Loader size="base" label="Loading..." /></div>;
  }

  if (error) {
    return (
      <div className="ui-loader-error">
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
          <RotateCcw className="size-4" /> Retry
        </Button>
      </div>
    );
  }

  return showMainDashboard ? (
    <DashboardLayout performers={performers} teams={teams} router={router} />
  ) : (
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