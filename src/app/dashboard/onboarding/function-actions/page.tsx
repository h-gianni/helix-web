// app/dashboard/onboarding/function-actions/page.tsx

"use client";

import React, { useEffect, useRef, useState } from "react";
import PageNavigator from "../components/PageNavigator";
import ActionsSelector from "../components/ActionsSelector";
import { useActionsSelection } from "@/hooks/useActionsSelection";
import { MANDATORY_CATEGORIES } from "@/store/action-store";
import { useConfigStore, useUpdateTeamActions, useGlobalFunctions } from "@/store/config-store";

export default function FunctionActionsPage() {
  const { mutate: updateTeamActions } = useUpdateTeamActions();
  const orgConfig = useConfigStore((state) => state.config.organization);
  const updateTeamActionsInStore = useConfigStore((state) => state.updateTeamActions);
  const teamActions = useConfigStore((state) => state.config.teamActions || []);
  const initialized = useRef(false);

  // Local state for selections
  const [localSelectedActivities, setLocalSelectedActivities] = useState<string[]>([]);
  const [localSelectedByCategory, setLocalSelectedByCategory] = useState<Record<string, string[]>>({});

  // Fetch existing actions using the hook

  // Use our custom hook for actions selection
  const {
    selectedActivities,
    selectedByCategory,
    updateActivities,
    updateActivitiesByCategory,
    filteredCategories: functionCategories,
    isLoading,
    isFavorite,
    toggleFavorite,
    hasInteracted,
    setHasInteracted,
    canContinue,
  } = useActionsSelection({
    categoryType: "core",
    minRequired: 0, // No minimum required for function actions
    autoSelect: false,
  });

  // Initialize selections from both localStorage and DB
  useEffect(() => {
    console.log('Effect triggered with:', {
    
      teamActions
    });

    console.log('Local Selected Activities:-------------', teamActions);
    setLocalSelectedActivities(teamActions.map(action => action.id));

   
  }, [ teamActions]);

  // Handle local selection updates
  const handleLocalUpdateActivities = (activities: string[]) => {
    console.log('Updating local activities:', activities);
    setLocalSelectedActivities(activities);
  };

  const handleLocalUpdateActivitiesByCategory = (categoryId: string, activities: string[]) => {
    console.log('Updating category activities:', { categoryId, activities });
    setLocalSelectedByCategory(prev => ({
      ...prev,
      [categoryId]: activities
    }));
  };

  const handleNext = () => {
    if (!orgConfig.id) {
      console.error("Organization ID is missing. Full org config:", orgConfig);
      return;
    }

    // Convert selected activities to team actions format
    const teamActions = localSelectedActivities.map(activity => ({
      id: activity,
      name: activity,
      description: "",
      isEnabled: true
    }));

    console.log('Saving team actions:', teamActions);

    // Update localStorage and DB
    updateTeamActionsInStore(teamActions);
    updateTeamActions({
      functions: teamActions,
      orgId: orgConfig.id
    });
  };

  return (
    <div>
      <PageNavigator
        title="Select Function Actions"
        description={
          <>
            Choose the actions that are specific to your function or department.
            <br />
            These actions will be evaluated within your function.
          </>
        }
        previousHref="/dashboard/onboarding/global-actions"
        nextHref="/dashboard/onboarding/members"
        canContinue={true} // Always allow continuing for function actions
        currentStep={3}
        totalSteps={6}
        onNext={handleNext}
        isLoading={teamActions.length === 0}
      />
      <div className="max-w-5xl mx-auto">
        <ActionsSelector
          categories={functionCategories}
          selectedActivities={localSelectedActivities}
          selectedByCategory={localSelectedByCategory}
          updateActivities={handleLocalUpdateActivities}
          updateActivitiesByCategory={handleLocalUpdateActivitiesByCategory}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          isLoading={isLoading}
          minRequiredActionsPerCategory={0} // No minimum required for function actions
          // mandatoryCategories={MANDATORY_CATEGORIES}
          categoriesTitle="Function Categories"
          categoriesDescription="Select actions for your function or department."
          hasInteracted={hasInteracted}
          setHasInteracted={setHasInteracted}
        />
      </div>
    </div>
  );
}