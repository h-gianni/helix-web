import React, { useState } from "react";
import { Button } from "@/components/ui/core/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/core/Table";
import { Badge } from "@/components/ui/core/Badge";
import { Avatar, AvatarFallback } from "@/components/ui/core/Avatar";
import { PenSquare, Loader } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/core/Card";
import { useUserTeams } from "@/store/user-store";
import { useConfigStore } from "@/store/config-store";

interface TeamsSummaryProps {
  onEdit: () => void;
  variant?: "setup" | "settings";
}

interface MemberTeam {
  teamFunction?: {
    name: string;
  };
  memberCount?: number;
}

const MAX_AVATARS = 3;

const TeamsSummary: React.FC<TeamsSummaryProps> = ({
  onEdit,
  variant = "settings",
}) => {
  // Use React Query for data fetching
  const { data: teamsData, isLoading } = useUserTeams();

  // Get config store data for setup mode
  const configStore = useConfigStore();
  const configTeams = configStore.config.teams;

  // Determine which data source to use based on variant
  const useConfigData = variant === "setup";
  // Get the right teams data based on mode
  const teams = useConfigData
    ? configTeams
    : teamsData
    ? [...(teamsData.owned || []), ...(teamsData.member || [])]
    : [];

  // Render avatar group for team members
  const renderAvatarGroup = (memberCount: number) => {
    return (
      <div className="flex items-center gap-2">
        {memberCount > 0 && (
          <div className="flex items-center">
            {/* Just a placeholder avatar since we don't have actual member data */}
            <Avatar className="h-6 w-6 border-2 border-background">
              <AvatarFallback className="text-xs">M</AvatarFallback>
            </Avatar>

            {memberCount > MAX_AVATARS && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                +{memberCount - 1}
              </div>
            )}
          </div>
        )}
        <p className="body-sm text-foreground-weak">
          {memberCount} {memberCount === 1 ? "member" : "members"}
        </p>
      </div>
    );
  };

  if (isLoading && !useConfigData) {
    return (
      <Card data-slot="card">
        <CardHeader
          data-slot="card-header"
          className="flex flex-row items-center justify-between"
        >
          <CardTitle data-slot="card-title">My Teams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-foreground-muted flex items-center justify-center">
            <Loader className="size-4 mr-2 animate-spin" />
            Loading teams...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-slot="card">
      <CardHeader
        data-slot="card-header"
        className="flex flex-row items-center justify-between"
      >
        <CardTitle data-slot="card-title">My Teams</CardTitle>
        <Button data-slot="button" variant="ghost" onClick={onEdit}>
          <PenSquare className="size-4 mr-2" /> Edit
        </Button>
      </CardHeader>
      <CardContent data-slot="card-content">
        {!teams || teams.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-foreground-muted">
              No teams have been created yet.
            </p>
          </div>
        ) : (
          <Table data-slot="table">
            <TableHeader data-slot="table-header">
              <TableRow data-slot="table-row">
                <TableHead data-slot="table-head">Team name</TableHead>
                <TableHead data-slot="table-head">Function</TableHead>
                <TableHead data-slot="table-head">Members</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody data-slot="table-body">
              {teams.map((team) => {
                console.log(team);
                // Handle different team object structures between modes
                const teamId = team.id;
                const teamName = team.name;
                const teamFunction = useConfigData
                  ? "functions" in team
                    ? team.functions?.join(", ") || "No function"
                    : "No function"
                  : (team as MemberTeam).teamFunction?.name || "No function";
                const memberCount = useConfigData
                  ? 0 // No member info in config mode
                  : "memberCount" in team
                  ? team.memberCount
                  : 0;

                return (
                  <TableRow data-slot="table-row" key={teamId}>
                    <TableCell data-slot="table-cell">
                      {teamName || "Unnamed Team"}
                    </TableCell>
                    <TableCell data-slot="table-cell">
                      <div className="flex flex-wrap gap-2">
                        <Badge data-slot="badge" variant="outline">
                          {teamFunction}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell data-slot="table-cell">
                      {useConfigData ? (
                        <span className="text-foreground-muted">Unknown</span>
                      ) : (
                        renderAvatarGroup(memberCount)
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamsSummary;
