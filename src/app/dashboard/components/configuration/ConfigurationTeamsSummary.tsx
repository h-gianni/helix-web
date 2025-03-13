import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/core/Button";
import TeamCard from "@/components/ui/composite/TeamCard";
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
import { PenSquare, ChevronDown, ChevronUp } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/core/Card";
import { useProfileStore } from "@/store/user-store";
import { useActions, MANDATORY_CATEGORIES } from "@/store/action-store";
import { useConfigStore } from "@/store/config-store";
import TeamActionsDialog from "./ConfigurationTeamActionsDialog";
import TeamsEditDialog from "./ConfigurationTeamsEditDialog";

interface TeamsSummaryProps {
  onEdit: () => void;
  variant?: "setup" | "settings";
}

// Type definitions from schema
interface MainTeam {
  id: string;
  name: string;
  description?: string;
  teamFunctionId: string;
  ownerId: string;
  customFields?: any;
  // Derived properties for UI
  functions?: string[];
  categories?: string[];
}

interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  photoUrl?: string;
  isAdmin: boolean;
  status: string;
}

const MAX_AVATARS = 3;

interface TeamsSummaryProps {
  onEdit: () => void;
  variant?: "setup" | "settings";
}

const TeamsSummary: React.FC<TeamsSummaryProps> = ({
  onEdit,
  variant = "settings",
}) => {
  // Get data directly from config store when in setup mode (step 4)
  const config = useConfigStore((state) => state.config);

  // State for profile-based data when in settings mode
  const { profile } = useProfileStore();
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [teams, setTeams] = useState<MainTeam[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<MainTeam | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [teamMembers, setTeamMembers] = useState<Record<string, TeamMember[]>>(
    {}
  );

  const { data: actionCategories, isLoading: isActionsLoading } = useActions();

  // Determine if we should use config store data directly (setup variant)
  const useConfigData = variant === "setup";

  // Process teams data when profile is loaded from store
  useEffect(() => {
    if (!useConfigData && profile) {
      // Use profile from store when in settings mode
      const processedTeams = processTeamsData(profile.teams || []);
      setTeams(processedTeams);

      // Process team members
      const membersByTeam: Record<string, TeamMember[]> = {};
      if (profile.teamMembers) {
        profile.teamMembers.forEach((member) => {
          if (!membersByTeam[member.teamId]) {
            membersByTeam[member.teamId] = [];
          }
          membersByTeam[member.teamId].push(member);
        });
      }
      setTeamMembers(membersByTeam);
      setIsProfileLoading(false);
    }
  }, [profile, useConfigData]);

  // Helper to process teams data for UI
  const processTeamsData = (teamsData: any[]): MainTeam[] => {
    return teamsData.map((team) => {
      // Extract custom fields if available
      const customFields = team.customFields || {};

      return {
        ...team,
        functions: customFields.functions || getTeamFunctions(team),
        categories: customFields.categories || [],
      };
    });
  };

  // Get team functions based on teamFunctionId
  const getTeamFunctions = (team: any): string[] => {
    // This would ideally come from your API or be derived from other data
    // For now, we'll return a placeholder if no functions are defined
    return team.teamFunction ? [team.teamFunction.name] : ["General"];
  };

  const handleRefineActions = (team: MainTeam) => {
    setSelectedTeam(team);
  };

  // Get action names for display
  const getActionNameById = (actionId: string) => {
    if (!actionCategories) return "Unknown Action";
    for (const category of actionCategories) {
      for (const action of category.actions) {
        if (action.id === actionId) {
          return action.name;
        }
      }
    }
    return "Unknown Action";
  };

  // Get category name for display
  const getCategoryNameById = (categoryId: string) => {
    if (!actionCategories) return "Loading...";
    const category = actionCategories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const renderAvatarGroup = (teamId: string) => {
    const members = teamMembers[teamId] || [];

    return (
      <div className="flex items-center gap-2">
        {members.length > 0 && (
          <div className="flex -space-x-2">
            {members.slice(0, MAX_AVATARS).map((member) => (
              <Avatar
                key={member.id}
                className="h-6 w-6 border-2 border-background"
              >
                <AvatarFallback className="text-xs">
                  {member.firstName?.charAt(0).toUpperCase() ||
                    member.lastName?.charAt(0).toUpperCase() ||
                    "?"}
                </AvatarFallback>
              </Avatar>
            ))}
            {members.length > MAX_AVATARS && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                +{members.length - MAX_AVATARS}
              </div>
            )}
          </div>
        )}
        <p className="body-sm text-foreground-weak">
          {members.length} {members.length === 1 ? "member" : "members"}
        </p>
      </div>
    );
  };

  // Get all selected categories from teams
  const getAllSelectedCategories = () => {
    const allCategories: Record<string, string[]> = {};

    teams.forEach((team) => {
      if (team.categories) {
        team.categories.forEach((categoryId) => {
          if (!allCategories[categoryId]) {
            allCategories[categoryId] = [];
          }
        });
      }
    });

    // Populate actions if they exist in the action categories
    if (actionCategories) {
      actionCategories.forEach((category) => {
        if (allCategories[category.id]) {
          allCategories[category.id] = category.actions.map(
            (action) => action.id
          );
        }
      });
    }

    return allCategories;
  };

  // Choose the right data source based on variant
  const teamsToDisplay = useConfigData ? config.teams : teams;
  const selectedByCategory = useConfigData
    ? config.activities.selectedByCategory
    : getAllSelectedCategories();
  const categoryIds = Object.keys(selectedByCategory);

  // Get total selected activities count
  const getTotalSelectedActivitiesCount = () => {
    return Object.values(selectedByCategory).reduce(
      (total, actions) => total + actions.length,
      0
    );
  };

  const isLoading = isActionsLoading || (!useConfigData && isProfileLoading);

  // For setup mode, we only need the Organization Activities, not both cards
  if (variant === "setup") {
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
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4 text-foreground-muted">
              Loading teams...
            </div>
          ) : teamsToDisplay.length === 0 ? (
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
                </TableRow>
              </TableHeader>
              <TableBody data-slot="table-body">
                {teamsToDisplay.map((team) => (
                  <TableRow data-slot="table-row" key={team.id}>
                    <TableCell data-slot="table-cell">
                      {team.name || "Unnamed Team"}
                    </TableCell>
                    <TableCell data-slot="table-cell">
                      <div className="flex flex-wrap gap-2">
                        {(team.categories || [])
                          .filter((categoryId) => {
                            const categoryName =
                              getCategoryNameById(categoryId);
                            // Only show functional categories, not general responsibilities
                            return !MANDATORY_CATEGORIES.includes(categoryName);
                          })
                          .map((categoryId) => (
                            <Badge
                              key={categoryId}
                              data-slot="badge"
                              variant="outline"
                            >
                              {getCategoryNameById(categoryId)}
                            </Badge>
                          ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    );
  }

  if (variant === "settings") {
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
          {isLoading ? (
            <div className="text-center py-4 text-foreground-muted">
              Loading teams...
            </div>
          ) : teamsToDisplay.length === 0 ? (
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
                {teamsToDisplay.map((team) => (
                  <TableRow data-slot="table-row" key={team.id}>
                    <TableCell data-slot="table-cell">
                      {team.name || "Unnamed Team"}
                    </TableCell>
                    <TableCell data-slot="table-cell">
  <div className="flex flex-wrap gap-2">
    {/* Use both categories and functions to show badges */}
    {team.functions?.map((func, index) => (
      <Badge
        key={index}
        data-slot="badge"
        variant="outline"
      >
        {func}
      </Badge>
    ))}
    {/* You might need to convert category IDs to names */}
    {team.categories?.map((categoryId) => {
      const categoryName = getCategoryNameById(categoryId);
      // Only show if not already showing as a function
      return !team.functions?.includes(categoryName) ? (
        <Badge
          key={categoryId}
          data-slot="badge"
          variant="outline"
        >
          {categoryName}
        </Badge>
      ) : null;
    })}
  </div>
</TableCell>
                    <TableCell data-slot="table-cell">
                      {renderAvatarGroup(team.id)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    );
  }
};

export default TeamsSummary;
