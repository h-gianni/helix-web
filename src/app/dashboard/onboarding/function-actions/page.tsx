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
  const { data: existingActions, isLoading: isLoadingActions } = useGlobalFunctions(orgConfig.id || "");

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
      isLoadingActions,
      existingActions,
      teamActions
    });

    if (!isLoadingActions && existingActions) {
      // First check localStorage (teamActions from Zustand store)
      const storedActionIds = teamActions.map(action => action.id);
      console.log('Stored action IDs from localStorage:', storedActionIds);
      
      // Then check DB for any additional actions
      const dbTeamActions = existingActions.filter(action => 
        action.action && action.action.category && !action.action.category.isGlobal
      );
      console.log('DB team actions:', dbTeamActions);
      
      const dbActionIds = dbTeamActions.map(action => action.actionId);
      console.log('DB action IDs:', dbActionIds);
      
      // Combine both sets of IDs, removing duplicates
      const allSelectedIds = [...new Set([...storedActionIds, ...dbActionIds])];
      console.log('Combined selected IDs:', allSelectedIds);
      
      // Set the combined selections
      setLocalSelectedActivities(allSelectedIds);
      
      // Group by category
      const byCategory: Record<string, string[]> = {};
      
      // Add DB actions to categories
      dbTeamActions.forEach(action => {
        const categoryId = action.action?.category?.id;
        console.log('Category ID:--------', categoryId);
        if (categoryId) {
          byCategory[categoryId] = [...(byCategory[categoryId] || []), action.actionId];
        }
      });

      console.log('By category:-------', byCategory);
      
      // Add localStorage actions to categories
      teamActions.forEach(action => {
        const dbAction = dbTeamActions.find(db => db.actionId === action.id);
        if (dbAction?.action?.category?.id) {
          const categoryId = dbAction.action.category.id;
          byCategory[categoryId] = [...(byCategory[categoryId] || []), action.id];
        }
      });
      
      console.log('Final category grouping:', byCategory);
      setLocalSelectedByCategory(byCategory);
    }
  }, [isLoadingActions, existingActions, teamActions]);

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
        nextHref="/dashboard/onboarding/teams"
        canContinue={true} // Always allow continuing for function actions
        currentStep={3}
        totalSteps={6}
        onNext={handleNext}
        isLoading={isLoadingActions}
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
          isLoading={isLoading || isLoadingActions}
          minRequiredActionsPerCategory={0} // No minimum required for function actions
          mandatoryCategories={MANDATORY_CATEGORIES}
          categoriesTitle="Function Categories"
          categoriesDescription="Select actions for your function or department."
          hasInteracted={hasInteracted}
          setHasInteracted={setHasInteracted}
        />
      </div>
    </div>
  );
}