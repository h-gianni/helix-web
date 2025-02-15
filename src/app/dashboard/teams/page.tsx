"use client";

import { PageBreadcrumbs } from "@/components/ui/composite/AppHeader";
import { PageHeader } from "@/components/ui/composite/PageHeader";
import { Badge } from "@/components/ui/core/Badge";
import { Button } from "@/components/ui/core/Button";
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
import TeamCreateModal from "./_teamCreateModal";
import EmptyTeamsView from "./_emptyTeamsView";
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

// Separate component for the teams grid to improve readability
const TeamsGrid = ({ teams }: { teams: TeamResponse[] }) => (
  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {teams.map((team) => {
      const memberCount = team.members?.length ?? 0;
      
      return (
        <Link key={team.id} href={`/dashboard/teams/${team.id}`}>
          <Card className="hover:border-input hover:shadow transition-all">
            <CardHeader className="p-4 pb-0">
              <div className="flex justify-between items-start gap-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                  <Users className="h-5 w-5" />
                </div>
                {team.teamFunction?.name && (
                  <Badge variant="secondary" className="capitalize">
                    {team.teamFunction.name}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 p-4 pt-0">
              <div className="flex-1 text-left space-y-1.5">
                <h3 className="heading-2">{team.name}</h3>
                <div className="flex items-center gap-2">
                  {memberCount > 0 && (
                    <div className="flex -space-x-2">
                      {team.members.slice(0, MAX_AVATARS).map((member: TeamMember) => (
                        <Avatar 
                          key={member.id} 
                          className="h-6 w-6 border-2 border-background"
                        >
                          <AvatarFallback className="text-xs">
                            {member.name?.charAt(0).toUpperCase() || '?'}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {memberCount > MAX_AVATARS && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                          +{memberCount - MAX_AVATARS}
                        </div>
                      )}
                    </div>
                  )}
                  <p className="body-sm text-foreground-weak">
                    {memberCount} {memberCount === 1 ? 'member' : 'members'}
                  </p>
                </div>
              </div>
              <div className="text-sm text-foreground-muted">
                Average team performance:{" "}
                {team.averagePerformance?.toFixed(1) || "Not rated"}
              </div>
            </CardContent>
          </Card>
        </Link>
      );
    })}
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
