import React, { useState, useEffect } from "react";
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
import { PenSquare, Loader, Users, Pen } from "lucide-react";
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

interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  jobTitle?: string;
}

const MAX_DISPLAY_MEMBERS = 3;

const TeamsSummary: React.FC<TeamsSummaryProps> = ({
  onEdit,
  variant = "settings",
}) => {
  // Use React Query for data fetching
  const { data: teamsData, isLoading } = useUserTeams();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [teamMembers, setTeamMembers] = useState<Record<string, string[]>>({});

  // Get config store data for setup mode
  const configStore = useConfigStore();
  const configTeams = configStore.config.teams;

  // Load members and team assignments from localStorage
  useEffect(() => {
    if (variant === "setup") {
      try {
        // Load members
        const savedMembers = localStorage.getItem("onboarding_members");
        if (savedMembers) {
          setMembers(JSON.parse(savedMembers));
        }

        // Load team members assignments
        const savedTeamMembers = localStorage.getItem("onboarding_team_members");
        if (savedTeamMembers) {
          const teamMembersData = JSON.parse(savedTeamMembers);
          const teamMembersMap: Record<string, string[]> = {};
          
          teamMembersData.forEach((item: { teamId: string; memberIds: string[] }) => {
            teamMembersMap[item.teamId] = item.memberIds || [];
          });
          
          setTeamMembers(teamMembersMap);
        }
      } catch (error) {
        console.error("Error loading members or team assignments:", error);
      }
    }
  }, [variant]);

  // Determine which data source to use based on variant
  const useConfigData = variant === "setup";

  // Get the right teams data based on mode
  const teams = useConfigData
    ? configTeams
    : teamsData
    ? [...(teamsData.owned || []), ...(teamsData.member || [])]
    : [];

  // Get member names for a team
  const getMemberNamesForTeam = (teamId: string): string[] => {
    const teamMemberIds = teamMembers[teamId] || [];
    return teamMemberIds.map(memberId => {
      const member = members.find(m => m.id === memberId);
      return member ? member.fullName : 'Unknown Member';
    });
  };

  // Render member names for a team
  const renderMemberNames = (teamId: string) => {
    const memberNames = useConfigData ? getMemberNamesForTeam(teamId) : [];
    const memberCount = memberNames.length;
    
    if (memberCount === 0) {
      return <span className="text-foreground-weak">No members</span>;
    }
    
    return (
      <div className="flex flex-col space-y-1">
        {memberNames.slice(0, MAX_DISPLAY_MEMBERS).map((name, index) => (
          <div key={`${teamId}-member-${index}`} className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-2xs">{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{name}</span>
          </div>
        ))}
        {memberCount > MAX_DISPLAY_MEMBERS && (
          <div className="text-xs text-foreground-weak ml-7">
            +{memberCount - MAX_DISPLAY_MEMBERS} more {memberCount - MAX_DISPLAY_MEMBERS === 1 ? 'member' : 'members'}
          </div>
        )}
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
    <Card data-slot="card" className="h-full">
      <CardHeader
        data-slot="card-header"
        className="flex flex-row items-start justify-between"
      >
        <CardTitle data-slot="card-title">
          <div className="flex-shrink-0 mb-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-neutral-lightest">
              <Users className="size-5 text-primary" />
            </div>
          </div>
          My Teams
        </CardTitle>
        <Button data-slot="button" variant="ghost" onClick={onEdit}>
          <Pen />
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
                <TableHead data-slot="table-head">Members</TableHead>
                <TableHead data-slot="table-head">Function</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody data-slot="table-body">
              {teams.map((team) => {
                // Handle different team object structures between modes
                const teamId = team.id;
                const teamName = team.name;
                const teamFunction = useConfigData
                  ? "functions" in team
                    ? team.functions?.join(", ") || "No function"
                    : "No function"
                  : (team as MemberTeam).teamFunction?.name || "No function";

                return (
                  <TableRow data-slot="table-row" key={teamId}>
                    <TableCell data-slot="table-cell" className="font-semibold">
                      {teamName || "Unnamed Team"}
                    </TableCell>
                    <TableCell data-slot="table-cell">
                      {useConfigData ? (
                        renderMemberNames(teamId)
                      ) : (
                        <span className="text-foreground-weak">
                          {(team as any)?.memberCount || 0} members
                        </span>
                      )}
                    </TableCell>
                    <TableCell data-slot="table-cell">
                      <div className="flex flex-wrap gap-2">
                        <div className="flex flex-wrap gap-1">
                          {useConfigData &&
                          "functions" in team &&
                          Array.isArray(team.functions) ? (
                            team.functions.map((func: string) => (
                              <Badge key={func} variant="info-light">
                                {func}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="info-light">{teamFunction}</Badge>
                          )}
                        </div>
                      </div>
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