"use client";

import { useEffect, useState } from "react";
import { PageBreadcrumbs } from "@/app/dashboard/_component/_appHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import type { TeamResponse } from "@/lib/types/api";
import TeamCreateModal from "./_teamCreateModal";
import EmptyTeamsView from "./_emptyTeamsView";
import { useTeams, useCreateTeam, useTeamStore } from '@/store/team-store';


const TeamsContent = ({ 
  teams, 
  onCreateTeam 
}: { 
  teams: TeamResponse[];
  onCreateTeam: () => void;
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Teams</h1>
        <Button
          variant="primary"
          onClick={onCreateTeam}
          className="gap-2"
        >
          <Plus className="size-4" />
          Create Team
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <Link key={team.id} href={`/dashboard/teams/${team.id}`}>
            <Card className="hover:bg-accent transition-colors">
              <CardContent className="p-4">
                <h3 className="font-medium">{team.name}</h3>
                <p className="text-sm text-primary-600">{team.name}</p>
                <p className="text-sm text-muted-foreground">
                  Created: {new Date(team.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default function TeamsPage() {

  const router = useRouter();
   // Get teams data from React Query
   const { data: teams = [], isLoading, error, refetch } = useTeams();
   
    // Get modal state from Zustand
  const { isTeamModalOpen, toggleTeamModal } = useTeamStore();

  // Get create team mutation
  const { mutateAsync: createTeam } = useCreateTeam();

 



  const handleCreateTeam = async (name: string, teamFunctionId: string) => {
    try {
      const newTeam = await createTeam({ name, teamFunctionId });
      toggleTeamModal(); // Close modal
      router.push(`/dashboard/teams/${newTeam.id}`);
    } catch (error) {
      console.error("Error creating team:", error);
      throw error;
    }
  };
  if (isLoading) {
    return (
      <>
        <PageBreadcrumbs items={[{ href: "/dashboard/teams", label: "Teams" }]} />
        <div className="text-muted-foreground p-4">Loading teams...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageBreadcrumbs items={[{ href: "/dashboard/teams", label: "Teams" }]} />
        <Alert variant="danger">
          <AlertCircle className="size-4" />
          <AlertDescription> {error instanceof Error ? error.message : 'An error occurred'}</AlertDescription>
        </Alert>
        <Button variant="neutral" onClick={() => refetch()}>
          Retry
        </Button>
      </>
    );
  }

  return (
    <>
      <PageBreadcrumbs items={[{ href: "/dashboard/teams", label: "Teams" }]} />

      {teams.length === 0 ? (
        <EmptyTeamsView onCreateTeam={() => toggleTeamModal()} />
      ) : (
        <TeamsContent 
          teams={teams} 
          onCreateTeam={() => toggleTeamModal()} 
        />
      )}

<TeamCreateModal
        isOpen={isTeamModalOpen}
        onClose={() => toggleTeamModal()}
        onCreateTeam={handleCreateTeam}
      />
    </>
  );
}