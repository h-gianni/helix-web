// app/dashboard/teams/page.tsx
"use client";

import { useEffect, useState } from "react";
import { PageBreadcrumbs } from "@/app/dashboard/_component/_appHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import type { ApiResponse, TeamResponse } from "@/lib/types/api";
import TeamCreateModal from "./_teamCreateModal";
import EmptyTeamsView from "./_emptyTeamsView";
import { useTeams } from "@/lib/context/teams-context";

export default function TeamsPage() {
  const router = useRouter();
  const { teams, fetchTeams, isLoading } = useTeams() as { 
    teams: TeamResponse[]; 
    fetchTeams: () => Promise<void>; 
    isLoading: boolean; 
  };
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleCreateTeam = async (name: string, disciplineId: string) => {
    console.log("Creating team with name:", name);
    console.log("Creating team with disciplineId:", disciplineId);
   // return;
    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name,
          businessFunctionId: disciplineId  // Add disciplineId to the request
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsCreateModalOpen(false);
        router.push(`/dashboard/teams/${data.data.id}`);
      } else {
        throw new Error(data.error || "Failed to create team");
      }
    } catch (error) {
      console.error("Error creating team:", error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <>
        <PageBreadcrumbs
          items={[{ href: "/dashboard/teams", label: "Teams" }]}
        />
        <div className="text-muted-foreground">Loading teams...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageBreadcrumbs
          items={[{ href: "/dashboard/teams", label: "Teams" }]}
        />
        <Alert variant="danger">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button variant="primary" onClick={() => fetchTeams()}>
          Retry
        </Button>
      </>
    );
  }

  return (
    <>
      <PageBreadcrumbs items={[{ href: "/dashboard/teams", label: "Teams" }]} />

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-display-1">Teams</h1>
        </div>
        <Button
          variant="neutral"
          onClick={() => setIsCreateModalOpen(true)}
          leadingIcon={<Plus className="size-4" />}
        >
          Create Team
        </Button>
      </div>

      {teams.length === 0 ? (
        <EmptyTeamsView onCreateTeam={() => setIsCreateModalOpen(true)} />
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Link key={team.id} href={`/dashboard/teams/${team.id}`}>
              <Card
                size="default"
                background={true}
                border={true}
                interactive={true}
                shadow="sm"
              >
                <CardContent className="p-4">
                  <h3 className="text-heading-4">{team.name}</h3>
                  <p className="text-p-small text-primary-600">
                    {team.businessFunction?.name}
                  </p>
                  <p className="text-p-small text-muted">
                    Created: {new Date(team.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <TeamCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTeam={handleCreateTeam}
      />
    </>
  );
}