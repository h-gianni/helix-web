"use client";

import { PageBreadcrumbs } from "@/components/ui/composite/App-header";
import { PageHeader } from "@/components/ui/composite/Page-header";
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
import { useRouter } from "next/navigation";
import { Plus, AlertCircle, RotateCcw, Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { TeamCard } from "@/components/ui/composite/Team-card";
import TeamCreateModal from "../_components/_teams/_team-create-modal";
import EmptyTeamsView from "../_components/_teams/_teams-empty-view";
import { useTeams, useCreateTeam, useTeamStore } from "@/store/team-store";
import type { TeamResponse, TeamMemberResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";

interface TeamContentProps {
  onCreateTeam: () => void;
}

const MAX_AVATARS = 3;

interface TeamMember {
  id: string;
  name: string;
  email: string;
  title?: string | null;
}

const TeamsGrid = ({ teams }: { teams: TeamResponse[] }) => {
  const router = useRouter();
  
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => (
        <TeamCard
          key={team.id}
          id={team.id}
          name={team.name}
          functions={team.teamFunction ? [team.teamFunction.name] : []}
          members={team.members}
          averagePerformance={team.averagePerformance}
          size="lg"
          onClick={() => router.push(`/dashboard/teams/${team.id}`)}
        />
      ))}
    </div>
  );
};

// Main content component
const TeamsContent = ({ onCreateTeam }: TeamContentProps) => {
  const { data: teams = [], isLoading, error, refetch } = useTeams();

  if (isLoading) {
    return <div className="loader"><Loader size="base" label="Loading..." /></div>;
  }

  if (error) {
    return (
      <div className="ui-loader-error">
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>
            {error instanceof Error ? error.message : "An error occurred"}
          </AlertDescription>
        </Alert>
        <Button variant="secondary" onClick={() => refetch()}>
          <RotateCcw /> Retry
        </Button>
      </div>
    );
  }

  if (teams.length === 0) {
    return <EmptyTeamsView onCreateTeam={onCreateTeam} />;
  }

  return <TeamsGrid teams={teams} />;
};

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
          teams.length > 0 ? (
            <Button onClick={() => toggleTeamModal()} variant="default">
              <Plus /> Create Team
            </Button>
          ) : null
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
