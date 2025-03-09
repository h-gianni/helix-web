import React, { useState } from "react";
import { Button } from "@/components/ui/core/Button";
import TeamCard from "@/components/ui/composite/Team-card";
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
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/core/Card";
import { useConfigStore } from "@/store/config-store";
import { useActions } from "@/store/action-store";
import TeamActionsDialog from "./_team-actions-dialog";
import TeamsEditDialog from "./_teams-edit-dialog";

interface Team {
  id: string;
  name: string;
  functions: string[];
  categories?: string[];
}

interface TeamMember {
  id: string;
  name: string;
}

interface TeamsSummaryProps {
  onEdit: () => void;
  variant?: "setup" | "settings";
}

const MAX_AVATARS = 3;

function TeamsSummary({ onEdit, variant = "settings" }: TeamsSummaryProps) {
  const teams = useConfigStore((state) => state.config.teams);
  const selectedActivities = useConfigStore((state) => state.config.activities.selected);
  const selectedByCategory = useConfigStore(
    (state) => state.config.activities.selectedByCategory || {}
  );

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const { data: actionCategories, isLoading } = useActions();

  const handleRefineActions = (team: Team) => {
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

  const renderAvatarGroup = (members: TeamMember[] = []) => (
    <div className="flex items-center gap-2">
      {members.length > 0 && (
        <div className="flex -space-x-2">
          {members.slice(0, MAX_AVATARS).map((member) => (
            <Avatar
              key={member.id}
              data-slot="avatar"
              className="size-6 border-2 border-background"
            >
              <AvatarFallback data-slot="avatar-fallback" className="text-xs">
                {member.name?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
          ))}
          {members.length > MAX_AVATARS && (
            <div className="flex size-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
              +{members.length - MAX_AVATARS}
            </div>
          )}
        </div>
      )}
      <p className="body-sm">
        {members.length} {members.length === 1 ? "member" : "members"}
      </p>
    </div>
  );

  const categoryIds = Object.keys(selectedByCategory);

  return (
    <>
      {/* Organization Activities Section */}
      <Card data-slot="card" className="mb-6">
        <CardHeader data-slot="card-header" className="flex flex-row items-center justify-between">
          <CardTitle data-slot="card-title">Organisation's Activities</CardTitle>
          <Button
            data-slot="button"
            variant="ghost"
            onClick={onEdit}
          >
            <PenSquare className="size-4 mr-2" /> Edit
          </Button>
        </CardHeader>
        <CardContent data-slot="card-content">
          {isLoading ? (
            <div className="text-center py-4">Loading activities...</div>
          ) : categoryIds.length > 0 ? (
            <div className="space-y-4">
              {categoryIds.map((categoryId) => {
                const isExpanded = expandedCategories[categoryId];
                const actions = selectedByCategory[categoryId] || [];

                return (
                  <div key={categoryId} className="border rounded-md">
                    <div
                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/20"
                      onClick={() => toggleCategory(categoryId)}
                    >
                      <div className="font-medium flex items-center">
                        {getCategoryNameById(categoryId)}
                        <Badge
                          data-slot="badge"
                          variant="outline"
                          className="ml-2"
                        >
                          {actions.length} actions
                        </Badge>
                      </div>
                      <Button
                        data-slot="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        {isExpanded ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
                        )}
                      </Button>
                    </div>
                    {isExpanded && (
                      <div className="p-3 pt-0 border-t">
                        <div className="flex flex-wrap gap-2 pt-3">
                          {actions.map((actionId) => (
                            <Badge key={actionId} data-slot="badge" variant="secondary">
                              {getActionNameById(actionId)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <p>No activities have been selected yet.</p>
            </div>
          )}

          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium">
              Total Selected: {selectedActivities.length} actions across {categoryIds.length}{" "}
              categories
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Teams Section */}
      <Card data-slot="card">
        <CardHeader data-slot="card-header" className="flex flex-row items-center justify-between">
          <CardTitle data-slot="card-title">My Teams</CardTitle>
          <Button
            data-slot="button"
            variant="ghost"
            onClick={variant === "settings" ? () => setIsEditDialogOpen(true) : onEdit}
          >
            <PenSquare className="size-4 mr-2" /> Edit
          </Button>
        </CardHeader>
        <CardContent data-slot="card-content">
          {teams.length <= 3 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {teams.map((team) => (
                <TeamCard
                  key={team.id}
                  id={team.id}
                  name={team.name}
                  functions={team.functions}
                  categories={team.categories}
                  size={variant === "setup" ? "sm" : "base"}
                  onEdit={variant === "settings" ? () => setIsEditDialogOpen(true) : onEdit}
                />
              ))}
            </div>
          ) : (
            <Table data-slot="table">
              <TableHeader data-slot="table-header">
                <TableRow data-slot="table-row">
                  <TableHead data-slot="table-head">Team name</TableHead>
                  <TableHead data-slot="table-head">Functions</TableHead>
                  <TableHead data-slot="table-head">Categories</TableHead>
                  {variant === "settings" && (
                    <>
                      <TableHead data-slot="table-head">Members</TableHead>
                      <TableHead data-slot="table-head" className="w-[200px]">
                        Actions
                      </TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody data-slot="table-body">
                {teams.map((team) => (
                  <TableRow data-slot="table-row" key={team.id}>
                    <TableCell data-slot="table-cell">
                      {team.name || "Unnamed Team"}
                    </TableCell>
                    <TableCell data-slot="table-cell">
                      <div className="flex flex-wrap gap-2">
                        {team.functions.map((func) => (
                          <Badge key={func} data-slot="badge" variant="secondary">
                            {func}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell data-slot="table-cell">
                      <div className="flex flex-wrap gap-2">
                        {(team.categories || []).map((categoryId) => (
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
                    {variant === "settings" && (
                      <>
                        <TableCell data-slot="table-cell">
                          {renderAvatarGroup([])}
                        </TableCell>
                        <TableCell data-slot="table-cell">
                          <div className="flex gap-2">
                            <Button
                              data-slot="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRefineActions(team)}
                            >
                              Refine actions
                            </Button>
                            <Button
                              data-slot="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsEditDialogOpen(true)}
                            >
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium">Total Teams: {teams.length}</p>
          </div>
        </CardContent>

        {selectedTeam && (
          <TeamActionsDialog
            isOpen={!!selectedTeam}
            onClose={() => setSelectedTeam(null)}
            team={selectedTeam}
          />
        )}

        <TeamsEditDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
        />
      </Card>
    </>
  );
}

export default TeamsSummary;
