"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageBreadcrumbs } from "@/components/ui/composite/AppHeader";
import { useTeams } from "@/lib/context/teams-context";
import { PageHeader } from "@/components/ui/composite/PageHeader";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/core/Select";
import { Card, CardContent } from "@/components/ui/core/Card";
import TeamActivitiesConfig from "./_components/_teamActivitiesConfig";
import type { TeamDetailsResponse } from "@/lib/types/api";

export default function TeamsSettingsPage() {
  const { teams, isLoading: isTeamsLoading } = useTeams();
  const router = useRouter();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [teamDetails, setTeamDetails] = useState<TeamDetailsResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determine page title based on number of teams
  const pageTitle = useMemo(() => {
    if (teams.length === 1) {
      return "Team Settings";
    }
    return "Teams Settings";
  }, [teams.length]);

  const breadcrumbItems = [
    { label: "Settings", href: "/dashboard/settings" },
    { label: teams.length === 1 ? "Team" : "Teams" },
  ];

  // Set first team as default when teams are loaded
  useEffect(() => {
    if (teams.length > 0 && !selectedTeamId) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams, selectedTeamId]);

  const fetchTeamDetails = useCallback(async (teamId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/teams/${teamId}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch team settings");
      }

      setTeamDetails(data.data);
    } catch (err) {
      console.error("Error fetching team details:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch team details when team selection changes
  useEffect(() => {
    if (selectedTeamId) {
      fetchTeamDetails(selectedTeamId);
    }
  }, [selectedTeamId, fetchTeamDetails]);

  const handleTeamChange = (teamId: string) => {
    setSelectedTeamId(teamId);
  };

  if (isTeamsLoading) {
    return <div className="ui-loader">Loading teams...</div>;
  }

  if (teams.length === 0) {
    return (
      <>
        <PageBreadcrumbs items={breadcrumbItems} />
        <PageHeader
          title={pageTitle}
          backButton={{
            onClick: () => router.push("/dashboard/settings/"),
          }}
        />
        <main className="layout-page-main">
          <Alert variant="destructive">
            <AlertCircle />
            <AlertDescription>
              No teams available. Please create a team first.
            </AlertDescription>
          </Alert>
        </main>
      </>
    );
  }

  return (
    <>
      <PageBreadcrumbs items={breadcrumbItems} />
      <PageHeader
        title={pageTitle}
        backButton={{
          onClick: () => router.push("/dashboard/settings/"),
        }}
      />
      <main className="layout-page-main space-y-6">
        {/* Team Selection - Only show if multiple teams exist */}
        {teams.length > 1 && (
          <div className="flex flex-col gap-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="teamSelect"
            >
              Select Team
            </label>
            <Select
              value={selectedTeamId || ""}
              onValueChange={handleTeamChange}
            >
              <SelectTrigger id="teamSelect" className="w-full">
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Team Settings Sections */}
        {selectedTeamId && !error && (
          <div>
            {/* Loading State */}
            {isLoading ? (
              <div className="ui-loader">Loading team settings...</div>
            ) : (
              <>
                {/* Team Activities Config */}
                <TeamActivitiesConfig
                  teamId={selectedTeamId}
                  onUpdate={() => fetchTeamDetails(selectedTeamId)}
                />
                {/* Future team settings components will go here */}
                {/* <TeamGeneralSettings teamId={selectedTeamId} /> */}
                {/* <TeamMembersConfig teamId={selectedTeamId} /> */}
                {/* <TeamPermissionsConfig teamId={selectedTeamId} /> */}
              </>
            )}
          </div>
        )}
      </main>
    </>
  );
}
