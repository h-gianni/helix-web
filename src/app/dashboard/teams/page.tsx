"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PageBreadcrumbs } from "@/components/ui/composite/AppHeader";
import { PageHeader } from "@/components/ui/composite/PageHeader";
import { Badge } from "@/components/ui/core/Badge";
import { Button } from "@/components/ui/core/Button";
import { Loader } from "@/components/ui/core/Loader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/core/Card";
import { Avatar, AvatarFallback } from "@/components/ui/core/Avatar";
import Link from "next/link";
import { Plus, AlertCircle, RotateCcw, Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { TeamCard } from "@/components/ui/composite/TeamCard";
import TeamCreateModal from "../components/teams/TeamsCreateModal";
import EmptyTeamsView from "../components/teams/TeamsEmptyView";
import { useTeams, useCreateTeam, useTeamStore } from "@/store/team-store";
import type { TeamResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";

// A small grid for displaying teams
function TeamsGrid({ teams }: { teams: TeamResponse[] }) {
  const router = useRouter();



  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => {
          console.log('teams in card----------', team)
        return (
          <TeamCard
            key={team.id}
            id={team.id}
            name={team.name}
            functions={team.teamFunction ? [team.teamFunction.name] : []}
            members={Array.isArray(team.members) 
              ? team.members.map((member) => ({
                  ...member,
                  name: member.name ?? "Unknown",
                }))
              : []
            }
            averagePerformance={team.averagePerformance}
            size="lg"
            onClick={() => router.push(`/dashboard/teams/${team.id}`)}
          />
        )
      })}
    </div>
  );
}

// Fetches teams and displays either a loader, error state, or the TeamsGrid
function TeamsContent({ onCreateTeam }: { onCreateTeam: () => void }) {
  const { data: teams = [], isLoading, error, refetch } = useTeams();

  if (isLoading) {
    return (
      <div className="loader">
        <Loader size="base" label="Loading..." data-slot="loader" />
      </div>
    );
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
          onClick={() => refetch()}
          className="mt-4"
        >
          <RotateCcw className="size-4" /> Retry
        </Button>
      </div>
    );
  }

  if (teams.length === 0) {
    return <EmptyTeamsView onCreateTeam={onCreateTeam} />;
  }

  return <TeamsGrid teams={teams} />;
}

// The main Teams page
export default function TeamsPage() {
  const router = useRouter();
  const { isTeamModalOpen, toggleTeamModal } = useTeamStore();
  const { mutateAsync: createTeam } = useCreateTeam();
  const { data: teams = [] } = useTeams();

  const handleCreateTeam = async (name: string, teamFunctionId: string) => {
    try {
      const newTeam = await createTeam({ name, teamFunctionId });
      toggleTeamModal();
      router.push(`/dashboard/teams/${newTeam.id}`);
    } catch (error) {
      console.error("Error creating team:", error);
      throw error;
    }
  };

  return (
    <>
      <PageBreadcrumbs items={[{ href: "/dashboard/teams", label: "Teams" }]} />

      <PageHeader
        title="Teams"
        actions={
          teams.length > 0 && (
            <Button
              data-slot="button"
              onClick={() => toggleTeamModal()}
              variant="default"
            >
              <Plus className="size-4" /> Create Team
            </Button>
          )
        }
      />

      <main className="layout-page-main">
        <TeamsContent onCreateTeam={() => toggleTeamModal()} />
      </main>

      <TeamCreateModal
        isOpen={isTeamModalOpen}
        onClose={() => toggleTeamModal()}
        onCreateTeam={handleCreateTeam}
      />
    </>
  );
}