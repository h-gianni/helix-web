"use client";

import React, { useEffect } from "react";
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
import { Loader } from "@/components/ui/core/Loader";
import TeamActivitiesConfig from "../../components/teams/TeamsActivitiesConfig";
import {
  useTeamSettingsStore,
  useTeamDetails,
} from "@/store/team-settings-store";

export default function TeamsSettingsPage() {
  const router = useRouter();
  const { teams, isLoading: isTeamsLoading } = useTeams();
  const { selectedTeamId, setSelectedTeamId } = useTeamSettingsStore();

  const {
    data: teamDetails,
    isLoading,
    error,
    refetch,
  } = useTeamDetails(selectedTeamId);

  // Determine page title based on number of teams
  const pageTitle = teams.length === 1 ? "Team Settings" : "Teams Settings";

  const breadcrumbItems = [
    { label: "Settings", href: "/dashboard/settings" },
    { label: teams.length === 1 ? "Team" : "Teams" },
  ];

  // Set first team as default when teams are loaded
  useEffect(() => {
    if (teams.length > 0 && !selectedTeamId) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams, selectedTeamId, setSelectedTeamId]);

  const handleTeamChange = (teamId: string) => {
    setSelectedTeamId(teamId);
  };

  if (isTeamsLoading) {
    return (
      <div className="loader">
        <Loader size="base" label="Loading..." data-slot="loader" />
      </div>
    );
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
          <Alert data-slot="alert" variant="destructive">
            {/* Replaced h-4 w-4 with size-4 */}
            <AlertCircle className="size-4" />
            <AlertDescription data-slot="alert-description">
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
        caption="Select the activities relevant to your team so you can rate the team members' performance on what counts for you and the organization."
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
              data-slot="select"
              value={selectedTeamId || ""}
              onValueChange={handleTeamChange}
            >
              <SelectTrigger data-slot="select-trigger" id="teamSelect" className="w-full">
                <SelectValue data-slot="select-value" placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent data-slot="select-content">
                {teams.map((team) => (
                  <SelectItem data-slot="select-item" key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert data-slot="alert" variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription data-slot="alert-description">
              {error instanceof Error ? error.message : "An error occurred"}
            </AlertDescription>
          </Alert>
        )}

        {/* Team Settings Sections */}
        {selectedTeamId && !error && (
          <div>
            {/* Loading State */}
            {isLoading ? (
              <div className="loader">
                <Loader size="base" label="Loading..." data-slot="loader" />
              </div>
            ) : (
              <>
                {/* Team Activities Config */}
                <TeamActivitiesConfig teamId={selectedTeamId} onUpdate={refetch} />
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
