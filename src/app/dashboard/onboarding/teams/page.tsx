// app/dashboard/onboarding/teams/page.tsx

"use client";

import React, { useEffect, useState, useMemo } from "react";
import { AlertCircle, Users } from "lucide-react";
import PageNavigator from "../components/PageNavigator";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import TeamList from "../components/TeamList";
import TeamForm from "../components/TeamForm";
import { Card } from "@/components/ui/core/Card";
import { Badge } from "@/components/ui/core/Badge";
import { useTeamsManagement } from "@/hooks/useTeamsManagement";
import { useActions, MANDATORY_CATEGORIES } from "@/store/action-store";
import type { ActionCategory } from "@/lib/types/api/action";
import { useConfigStore, useStoreTeams, useStoreTeamsWithMapping } from "@/store/config-store";
import { HeroBadge } from "@/components/ui/core/HeroBadge";
import { useRouter } from "next/navigation";

// Interface for TeamList compatible item
interface TeamListItem {
  id: string;
  name: string;
  subtitle: React.ReactNode;
  icon: "users";
  functions: string[];
  categories: string[];
  members: string[];
}

export default function TeamsPage() {
  const router = useRouter();
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [noMembersAvailable, setNoMembersAvailable] = useState(false);
  const [isStoring, setIsStoring] = useState(false);
  const [storeError, setStoreError] = useState<string | null>(null);

  // Get all hooks at the top level
  const { data: actionCategories, isLoading: isLoadingActions } = useActions();
  const teamMembers = useConfigStore((state) => state.config.teamMembers || []);
  const isHydrated = useConfigStore((state) => state.isHydrated);
  const selectedByCategory = useConfigStore((state) => state.config.selectedActionCategory || []);
  const linkedTeamActions = useConfigStore((state) => state.config.teamActions || []);
  const storeTeams = useStoreTeams();
  const storeTeamsWithMapping = useStoreTeamsWithMapping();

  // Transform teamMembers to ensure they have unique IDs
  const processedMembers = useMemo(() => {
    return teamMembers.map((member) => ({
      ...member,
      // Preserve the existing ID (including temp IDs) instead of creating a new one
      id: member.id,
      name: member.fullName,
      subtitle: member.email
    }));
  }, [teamMembers]);

  const {
    teams,
    members,
    displayCategories,
    currentTeam,
    formErrors,
    assignedMemberIds,
    allMembersAssigned,
    isValid,
    showAlert,
    error,
    setTeamName,
    handleFunctionToggle,
    handleMemberToggle,
    createTeam,
    updateTeam,
    selectTeam,
    removeTeam,
    cancelEdit,
  } = useTeamsManagement();

  // Combine all effects into one
  useEffect(() => {
    // Check for members data once store is hydrated
    if (isHydrated) {
      setNoMembersAvailable(!teamMembers || teamMembers.length === 0);
    }

    // Debug logging for team data in localStorage
    if (actionCategories && teams.length > 0) {
      console.log('Teams loaded from localStorage:', teams);
      teams.forEach((team, index) => {
        console.log(`Team ${index + 1}: "${team.name}" with ${team.memberIds?.length || 0} members`);
        if (team.memberIds && Array.isArray(team.memberIds)) {
          team.memberIds.forEach((member: any, memberIndex: number) => {
            if (typeof member === 'object' && member !== null) {
              console.log(`  Member ${memberIndex + 1}:`, {
                id: member.id,
                fullName: member.fullName,
                email: member.email,
                jobTitle: member.jobTitle
              });
            } else {
              console.warn(`  Member ${memberIndex + 1}: Only ID stored (${member}) - missing full data`);
            }
          });
        }
      });
    }

    // Debug logging
    if (actionCategories) {
      console.log('Available categories:', actionCategories.map((c) => ({ id: c.id, name: c.name })));
      console.log('Selected actions by category:', selectedByCategory);
      console.log('Linked team actions:', linkedTeamActions);
      console.log('Processed members:', processedMembers);
      console.log('Filtered display categories:', displayCategories);
    }
  }, [isHydrated, teamMembers, actionCategories, selectedByCategory, linkedTeamActions, processedMembers, displayCategories, teams]);

  // Render loading state
  if (!isHydrated) {
    return <LoadingState />;
  }

  // Render no members state
  if (noMembersAvailable) {
    return <NoMembersState />;
  }

  // Helper function to get category name by ID
  const getCategoryNameById = (categoryId: string): string | undefined => {
    if (!actionCategories) return categoryId;

    const category = actionCategories.find((cat) => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  // Helper function to get action count
  const getActionCountForCategory = (categoryId: string): number => {
    // Count the number of enabled actions in this category
    return linkedTeamActions.filter(action => 
      action.categoryId === categoryId && action.isEnabled
    ).length;
  };

  // Transform teams for TeamList component
  const teamListItems: TeamListItem[] = teams.map((team) => ({
    id: team.id,
    name: team.name,
    subtitle: (
      <div className="flex flex-col gap-1.5 mt-1.5">
        <div className="flex flex-wrap gap-1">
          {team.functions.map((functionName, index) => (
            <Badge
              key={index}
              variant="info-light"
              className="font-normal text-xs"
            >
              {functionName}
            </Badge>
          ))}
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium">{team.memberIds?.length || 0} members</span>
          {team.memberIds && team.memberIds.length > 0 && (
            <div className="text-xs text-foreground-weak">
              {team.memberIds.slice(0, 2).map((member: any, index: number) => (
                <div key={index}>
                  {typeof member === 'object' ? member.fullName || member.name : member}
                </div>
              ))}
              {team.memberIds.length > 2 && (
                <div>+{team.memberIds.length - 2} more</div>
              )}
            </div>
          )}
        </div>
      </div>
    ),
    icon: "users" as const,
    // Keep original data
    functions: team.functions,
    categories: team.categories,
    members: team.memberIds?.map((member: any) => 
      typeof member === 'object' ? member.id : member
    ) || [],
  }));

  // Handle selecting a team from the list
  const handleSelectTeam = (team: TeamListItem) => {
    selectTeam(team.id);
    setShowValidationErrors(false); // Reset validation errors when selecting a team
  };

  // Handle team removal
  const handleRemoveTeam = (teamId: string) => {
    // Remove the team
    removeTeam(teamId);
    
    // Update teams in config store
    const updatedTeams = teams.filter(team => team.id !== teamId);
    useConfigStore.getState().updateTeams(updatedTeams);
  };

  // Handle create team with validation
  const handleCreateTeam = () => {
    // Show validation errors if there are any issues
    setShowValidationErrors(true);

    // Check if the current team data is valid
    const hasName = currentTeam.name.trim() !== "";
    const hasFunctions = currentTeam.functions.length > 0;
    const hasMembers = currentTeam.members.length > 0;

    // Only create if all required fields are filled
    if (hasName && hasFunctions && hasMembers) {
      // Create the team
      createTeam(getCategoryNameById);
      
      // Store complete member data (not just IDs) in localStorage
      const fullMemberData = currentTeam.members.map(memberId => {
        const member = processedMembers.find(m => m.id === memberId);
        if (member) {
          return {
            id: member.id,                    // Temporary ID from members page
            fullName: member.fullName,        // Complete name
            email: member.email,              // Email address
            jobTitle: member.jobTitle || "",  // Job title with fallback
            name: member.name,                // Display name for compatibility
            subtitle: member.subtitle         // Email for display
          };
        } else {
          console.warn(`Member with ID ${memberId} not found in processedMembers`);
          return {
            id: memberId,
            fullName: "",
            email: "",
            jobTitle: "",
            name: "",
            subtitle: ""
          };
        }
      });

      // Update teams in config store with complete member data
      const newTeam = {
        id: currentTeam.id || `team-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: currentTeam.name,
        functions: currentTeam.functions,
        categories: currentTeam.functions.map(func => {
          const categoryId = linkedTeamActions.find(action => action.name === func)?.categoryId;
          return categoryId || func;
        }),
        memberIds: fullMemberData // Store complete member objects
      };

      console.log(`Creating team "${newTeam.name}" with complete member data:`, fullMemberData);
      
      const updatedTeams = [...teams, newTeam];
      useConfigStore.getState().updateTeams(updatedTeams);
      
      setShowValidationErrors(false);
    }
  };

  // Handle update team with validation
  const handleUpdateTeam = () => {
    // Show validation errors if there are any issues
    setShowValidationErrors(true);

    // Check if the current team data is valid
    const hasName = currentTeam.name.trim() !== "";
    const hasFunctions = currentTeam.functions.length > 0;
    const hasMembers = currentTeam.members.length > 0;

    // Only update if all required fields are filled
    if (hasName && hasFunctions && hasMembers) {
      // Update the team
      updateTeam(getCategoryNameById);
      
      // Store complete member data (not just IDs) in localStorage
      const fullMemberData = currentTeam.members.map(memberId => {
        const member = processedMembers.find(m => m.id === memberId);
        if (member) {
          return {
            id: member.id,                    // Temporary ID from members page
            fullName: member.fullName,        // Complete name
            email: member.email,              // Email address
            jobTitle: member.jobTitle || "",  // Job title with fallback
            name: member.name,                // Display name for compatibility
            subtitle: member.subtitle         // Email for display
          };
        } else {
          console.warn(`Member with ID ${memberId} not found in processedMembers`);
          return {
            id: memberId,
            fullName: "",
            email: "",
            jobTitle: "",
            name: "",
            subtitle: ""
          };
        }
      });

      // Update teams in config store with complete member data
      const updatedTeam = {
        id: currentTeam.id!,
        name: currentTeam.name,
        functions: currentTeam.functions,
        categories: currentTeam.functions.map(func => {
          const categoryId = linkedTeamActions.find(action => action.name === func)?.categoryId;
          return categoryId || func;
        }),
        memberIds: fullMemberData // Store complete member objects
      };

      console.log(`Updating team "${updatedTeam.name}" with complete member data:`, fullMemberData);
      
      const updatedTeams = teams.map(team => 
        team.id === currentTeam.id ? updatedTeam : team
      );
      useConfigStore.getState().updateTeams(updatedTeams);
      
      setShowValidationErrors(false);
    }
  };

  // Handle validation attempt
  const handleValidationAttempt = () => {
    setShowValidationErrors(true);
  };

  // Handle next step
  const handleNext = async () => {
    try {
      setIsStoring(true);
      setStoreError(null);
      

      // Store teams in database
      await storeTeamsWithMapping.mutateAsync();

      // Navigate to next step
      router.push("/dashboard/onboarding/summary");
    } catch (error) {
      console.error("Failed to store teams:", error);
      setStoreError("Failed to save teams. Please try again.");
    } finally {
      setIsStoring(false);
    }
  };

  return (
    <div>
      <PageNavigator
        title="Create Teams"
        description={
          <>
            Create one or more teams and assign functions and members to each
            team. <br />
            Teams will be evaluated based on their assigned functions.
          </>
        }
        previousHref="/dashboard/onboarding/members"
        nextHref="/dashboard/onboarding/summary"
        canContinue={isValid() && !isStoring}
        currentStep={5}
        totalSteps={6}
        disabledTooltip={
          isStoring 
            ? "Saving teams..." 
            : "Please create at least one team with a name, function, and members"
        }
        onValidationAttempt={handleValidationAttempt}
        onNext={handleNext}
        isLoading={isStoring}
      />

      <div className="max-w-5xl mx-auto">
        {storeError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="size-4" />
            <AlertDescription>{storeError}</AlertDescription>
          </Alert>
        )}

        {/* {(showAlert || showValidationErrors) && !isValid() && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="size-4" />
            <AlertDescription>
              {error || "Please create at least one team to continue"}
            </AlertDescription>
          </Alert>
        )} */}

        <Card className="w-full">
          <div className="grid grid-cols-2">
            {/* Team Form Component */}
            <TeamForm
              teamName={currentTeam.name}
              selectedFunctions={currentTeam.functions}
              selectedMembers={currentTeam.members}
              formError={formErrors.general || ""}
              formErrors={
                showValidationErrors
                  ? {
                      teamName: !currentTeam.name.trim()
                        ? "Team name is required"
                        : undefined,
                      functions:
                        currentTeam.functions.length === 0
                          ? "Please select at least one function"
                          : undefined,
                      members:
                        currentTeam.members.length === 0
                          ? "Please select at least one team member"
                          : undefined,
                    }
                  : {}
              }
              isEditing={currentTeam.id !== null}
              members={processedMembers}
              displayCategories={selectedByCategory}
              onTeamNameChange={setTeamName}
              onFunctionToggle={handleFunctionToggle}
              onMemberToggle={handleMemberToggle}
              onCreateTeam={handleCreateTeam}
              onUpdateTeam={handleUpdateTeam}
              onCancelEdit={cancelEdit}
              getCategoryNameById={getCategoryNameById}
              getActionCountForCategory={getActionCountForCategory}
              assignedMemberIds={assignedMemberIds}
              allMembersAssigned={allMembersAssigned}
            />
            {/* TeamList or Empty State */}
            {teams.length > 0 ? (
              <TeamList
                items={teamListItems}
                selectedItemId={currentTeam.id}
                title={`Created ${teams.length} Teams`}
                onSelectItem={handleSelectTeam}
                onRemoveItem={handleRemoveTeam}
                showRemoveButton={true}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center border-l border-border-weak">
                <div className="flex flex-col items-center text-center p-8 max-w-md">
                  <HeroBadge variant="primary" size="lg" icon={Users} />
                  <h3 className="heading-4 mt-4">No Teams Created</h3>
                  <p className="text-foreground-weak mb-4">
                    Create your first team using the form.
                  </p>
                  <div className="caption text-foreground-weak">
                    <p>
                      Required fields marked with{" "}
                      <span className="text-primary">*</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

// Separate components for different states
function LoadingState() {
  return (
    <div>
      <PageNavigator
        title="Create Teams"
        description={
          <>
            Create one or more teams and assign functions and members to each
            team. <br />
            Teams will be evaluated based on their assigned functions.
          </>
        }
        previousHref="/dashboard/onboarding/members"
        nextHref="/dashboard/onboarding/summary"
        canContinue={false}
        currentStep={5}
        totalSteps={6}
      />
      <div className="max-w-5xl mx-auto">
        <Card className="w-full p-4">
          Loading...
        </Card>
      </div>
    </div>
  );
}

function NoMembersState() {
  return (
    <div>
      <PageNavigator
        title="Create Teams"
        description={
          <>
            Create one or more teams and assign functions and members to each
            team. <br />
            Teams will be evaluated based on their assigned functions.
          </>
        }
        previousHref="/dashboard/onboarding/members"
        nextHref="/dashboard/onboarding/summary"
        canContinue={false}
        currentStep={5}
        totalSteps={6}
      />
      <div className="max-w-5xl mx-auto">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="size-4" />
          <AlertDescription>
            No team members available. Please go back and add team members first.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
