"use client";

import { PageBreadcrumbs } from "@/components/ui/composite/AppHeader";
import { PageHeader } from "@/components/ui/composite/PageHeader";
import { Button } from "@/components/ui/core/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/core/Card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, AlertCircle, RotateCcw, Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import TeamCreateModal from "./_teamCreateModal";
import EmptyTeamsView from "./_emptyTeamsView";
import { useTeams, useCreateTeam, useTeamStore } from "@/store/team-store";

interface TeamContentProps {
  onCreateTeam: () => void;
}

// Separate component for the teams grid to improve readability
const TeamsGrid = ({ teams }: { teams: Array<any> }) => (
  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {teams.map((team) => (
      <Link key={team.id} href={`/dashboard/teams/${team.id}`}>
        <Card 
          clickable 
          data-size="lg" 
          shadow="base"
          className="transition-all hover:shadow-md"
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle data-size="lg">{team.name}</CardTitle>
                <CardDescription data-variant="helper">
                  {team.totalMembers || 0} members | {team.function?.name || 'No function'} | 
                  Created: {new Date(team.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
              <Users className="text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent data-variant="base">
            <div className="text-sm text-muted-foreground">
              Average team performance: {team.averagePerformance?.toFixed(1) || 'Not rated'}
            </div>
          </CardContent>
        </Card>
      </Link>
    ))}
  </div>
);

// Main content component
const TeamsContent = ({ onCreateTeam }: TeamContentProps) => {
  const { data: teams = [], isLoading, error, refetch } = useTeams();

  if (isLoading) {
    return <div className="ui-loader">Loading teams...</div>;
  }

  if (error) {
    return (
      <div className="ui-loader-error">
        <Alert variant="danger">
          <AlertCircle />
          <AlertDescription>
            {error instanceof Error ? error.message : "An error occurred"}
          </AlertDescription>
        </Alert>
        <Button
          variant="neutral"
          onClick={() => refetch()}
          leadingIcon={<RotateCcw />}
        >
          Retry
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
            <Button
              onClick={() => toggleTeamModal()}
              leadingIcon={<Plus />}
              size="base"
              variant="primary"
            >
              Create Team
            </Button>
          ) : null
        }
      />

      <main className="ui-layout-page-main">
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