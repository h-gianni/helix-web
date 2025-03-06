import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/core/Button";
import TeamCard from "@/components/ui/composite/Team-card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/core/Table";
import { Badge } from "@/components/ui/core/Badge";
import { Avatar, AvatarFallback } from "@/components/ui/core/Avatar";
import { PenSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/core/Card";
import { useProfileStore } from '@/store/user-store';
import { useActions } from '@/store/action-store';
import TeamActionsDialog from './_team-actions-dialog';
import TeamsEditDialog from './_teams-edit-dialog';

interface TeamsSummaryProps {
  onEdit: () => void;
  variant?: 'setup' | 'settings';
}

// Type definitions from schema
interface Team {
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

const TeamsSummary: React.FC<TeamsSummaryProps> = ({ onEdit, variant = 'settings' }) => {
  // Get profile data from store only
  const { profile } = useProfileStore();
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [teamMembers, setTeamMembers] = useState<Record<string, TeamMember[]>>({});
  
  const { data: actionCategories, isLoading: isActionsLoading } = useActions();

  // Process teams data when profile is loaded from store
  useEffect(() => {
    if (profile) {
      // Use profile from store
      const processedTeams = processTeamsData(profile.teams || []);
      setTeams(processedTeams);
      
      // Process team members
      const membersByTeam: Record<string, TeamMember[]> = {};
      if (profile.teamMembers) {
        profile.teamMembers.forEach(member => {
          if (!membersByTeam[member.teamId]) {
            membersByTeam[member.teamId] = [];
          }
          membersByTeam[member.teamId].push(member);
        });
      }
      setTeamMembers(membersByTeam);
      setIsProfileLoading(false);
    }
  }, [profile]);

  // Helper to process teams data for UI
  const processTeamsData = (teamsData: any[]): Team[] => {
    return teamsData.map(team => {
      // Extract custom fields if available
      const customFields = team.customFields || {};
      
      return {
        ...team,
        functions: customFields.functions || getTeamFunctions(team),
        categories: customFields.categories || []
      };
    });
  };

  // Get team functions based on teamFunctionId
  const getTeamFunctions = (team: any): string[] => {
    // This would ideally come from your API or be derived from other data
    // For now, we'll return a placeholder if no functions are defined
    return team.teamFunction ? [team.teamFunction.name] : ['General'];
  };

  const handleRefineActions = (team: Team) => {
    setSelectedTeam(team);
  };

  // Get action names for display
  const getActionNameById = (actionId: string) => {
    if (!actionCategories) return 'Unknown Action';
    
    for (const category of actionCategories || []) {
      for (const action of category.actions) {
        if (action.id === actionId) {
          return action.name;
        }
      }
    }
    return 'Unknown Action';
  };

  // Get category name for display
  const getCategoryNameById = (categoryId: string) => {
    if (!actionCategories) return 'Loading...';
    
    const category = actionCategories?.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
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
                  {member.firstName?.charAt(0).toUpperCase() || member.lastName?.charAt(0).toUpperCase() || '?'}
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
          {members.length} {members.length === 1 ? 'member' : 'members'}
        </p>
      </div>
    );
  };

  // Get all selected categories from teams
  const getAllSelectedCategories = () => {
    const allCategories: Record<string, string[]> = {};
    
    teams.forEach(team => {
      if (team.categories) {
        team.categories.forEach(categoryId => {
          if (!allCategories[categoryId]) {
            allCategories[categoryId] = [];
          }
        });
      }
    });
    
    // Populate actions if they exist in the action categories
    if (actionCategories) {
      actionCategories.forEach(category => {
        if (allCategories[category.id]) {
          allCategories[category.id] = category.actions.map(action => action.id);
        }
      });
    }
    
    return allCategories;
  };

  const selectedByCategory = getAllSelectedCategories();
  const categoryIds = Object.keys(selectedByCategory);
  
  // Get total selected activities count
  const getTotalSelectedActivitiesCount = () => {
    return Object.values(selectedByCategory).reduce((total, actions) => total + actions.length, 0);
  };

  const isLoading = isActionsLoading;

  return (
    <>
      {/* Organization Activities Section */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Organisation's Activities</CardTitle>
          <Button 
            variant="ghost" 
            onClick={onEdit}
          >
            <PenSquare className="mr-2" /> Edit
          </Button>
        </CardHeader>
        <CardContent>
          {!profile ? (
            <div className="text-center py-4 text-foreground-muted">
              Loading profile data...
            </div>
          ) : isLoading ? (
            <div className="text-center py-4 text-foreground-muted">
              Loading activities...
            </div>
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
                        <Badge variant="outline" className="ml-2">
                          {actions.length} actions
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>
                    
                    {isExpanded && (
                      <div className="p-3 pt-0 border-t">
                        <div className="flex flex-wrap gap-2 pt-3">
                          {actions.map((actionId) => (
                            <Badge key={actionId} variant="secondary">
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
              <p className="text-foreground-muted">No activities have been selected yet.</p>
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium">
              Total Selected: {getTotalSelectedActivitiesCount()} actions across {categoryIds.length} categories
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Teams Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Teams</CardTitle>
          <Button 
            variant="ghost" 
            onClick={variant === 'settings' ? () => setIsEditDialogOpen(true) : onEdit}
          >
            <PenSquare className="mr-2" /> Edit
          </Button>
        </CardHeader>
        <CardContent>
          {!profile ? (
            <div className="text-center py-4 text-foreground-muted">
              Loading profile data...
            </div>
          ) : isActionsLoading ? (
            <div className="text-center py-4 text-foreground-muted">
              Loading teams...
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-foreground-muted">No teams have been created yet.</p>
            </div>
          ) : teams.length <= 3 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {teams.map((team) => (
                <TeamCard
                  key={team.id}
                  id={team.id}
                  name={team.name}
                  functions={team.functions || []}
                  // categories={team.categories}
                  size={variant === 'setup' ? 'sm' : 'base'}
                  onEdit={variant === 'settings' ? () => setIsEditDialogOpen(true) : onEdit}
                />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team name</TableHead>
                  <TableHead>Functions</TableHead>
                  <TableHead>Categories</TableHead>
                  {variant === 'settings' && (
                    <>
                      <TableHead>Members</TableHead>
                      <TableHead className="w-[200px]">Actions</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell>{team.name || 'Unnamed Team'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {(team.functions || []).map((func) => (
                          <Badge key={func} variant="secondary">
                            {func}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {(team.categories || []).map((categoryId) => (
                          <Badge key={categoryId} variant="outline">
                            {getCategoryNameById(categoryId)}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    {variant === 'settings' && (
                      <>
                        <TableCell>
                          {renderAvatarGroup(team.id)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRefineActions(team)}
                            >
                              Refine actions
                            </Button>
                            <Button 
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
};

export default TeamsSummary;