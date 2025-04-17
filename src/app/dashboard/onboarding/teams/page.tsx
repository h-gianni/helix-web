// app/dashboard/onboarding/teams/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { AlertCircle, Users } from "lucide-react";
import PageNavigator from "../components/PageNavigator";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import TeamList from "../components/TeamList";
import TeamForm from "../components/TeamForm";
import { Card } from "@/components/ui/core/Card";
import { Badge } from "@/components/ui/core/Badge";
import { useTeamsManagement } from "@/hooks/useTeamsManagement";
import { useActions, MANDATORY_CATEGORIES } from "@/store/action-store";
import { useConfigStore } from "@/store/config-store";

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
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // Get action categories to map IDs to names
  const { data: actionCategories, isLoading: isLoadingActions } = useActions();

  // Get the selected actions from config store
  const selectedByCategory = useConfigStore(
    (state) => state.config.activities.selectedByCategory || {}
  );

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

  // Helper function to get category name by ID
  const getCategoryNameById = (categoryId: string): string | undefined => {
    if (!actionCategories) return categoryId;

    const category = actionCategories.find((cat) => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  // Filter categories to only include those with selected actions and not mandatory categories
  const filteredDisplayCategories = Object.keys(selectedByCategory).filter(
    (categoryId) => {
      // Only include categories with selected actions
      if (!selectedByCategory[categoryId]?.length) return false;

      // Get the category name
      const categoryName = getCategoryNameById(categoryId);

      // Exclude mandatory categories
      return !MANDATORY_CATEGORIES.includes(categoryName || "");
    }
  );

  // Helper function to get action count
  const getActionCountForCategory = (categoryId: string): number => {
    return selectedByCategory[categoryId]?.length || 0;
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
        <span className="text-xs">{team.memberIds?.length || 0} members</span>
      </div>
    ),
    icon: "users" as const,
    // Keep original data
    functions: team.functions,
    categories: team.categories,
    members: team.memberIds,
  }));

  // Handle selecting a team from the list
  const handleSelectTeam = (team: TeamListItem) => {
    selectTeam(team.id);
    setShowValidationErrors(false); // Reset validation errors when selecting a team
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
      createTeam(getCategoryNameById);
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
      updateTeam(getCategoryNameById);
      setShowValidationErrors(false);
    }
  };

  // Handle validation attempt
  const handleValidationAttempt = () => {
    setShowValidationErrors(true);
  };

  // Log available categories for debugging
  useEffect(() => {
    if (actionCategories) {
      console.log(
        "Available categories:",
        actionCategories.map((c) => ({ id: c.id, name: c.name }))
      );
      console.log("Selected actions by category:", selectedByCategory);
      console.log("Filtered display categories:", filteredDisplayCategories);
    }
  }, [actionCategories, selectedByCategory, filteredDisplayCategories]);

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
        canContinue={isValid()}
        currentStep={5}
        totalSteps={6}
        disabledTooltip="Please create at least one team with a name, function, and members"
        onValidationAttempt={handleValidationAttempt}
      />

      <div className="max-w-5xl mx-auto">
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
              members={members}
              displayCategories={filteredDisplayCategories}
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
                onRemoveItem={removeTeam}
                showRemoveButton={true}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center border-l border-neutral-lighter">
                <div className="text-center p-8 max-w-md">
                  <div className="bg-neutral-lightest rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Users className="text-primary size-8" />
                  </div>
                  <h3 className="heading-4 mb-2">No Teams Created</h3>
                  <p className="text-foreground-weak mb-6">
                    Create your first team using the form.
                  </p>
                  <div className="text-sm text-foreground-weak">
                    <p>
                      Required fields marked with{" "}
                      <span className="text-destructive">*</span>
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
