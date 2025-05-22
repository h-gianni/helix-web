// app/dashboard/onboarding/function-actions/page.tsx

"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import PageNavigator from "../components/PageNavigator";
import ActionsSelector from "../components/ActionsSelector";
import { useActionsSelection } from "@/hooks/_useActionsSelection";
import { useConfigStore, useUpdateTeamActions } from "@/store/config-store";

export default function FunctionActionsPage() {
   const { mutate: updateTeamActions } = useUpdateTeamActions();
   const orgConfig = useConfigStore((state) => state.config.organization);
   const updateTeamActionsInStore = useConfigStore((state) => state.updateTeamActions);
   const teamActions = useConfigStore((state) => state.config.teamActions || []);
  
  // Use refs to track initialization state
  const initialized = useRef(false);
  const actionsInitialized = useRef(false);

  // Local state for selections - initialized once
  const [localSelectedActivities, setLocalSelectedActivities] = useState<string[]>([]);
  const [localSelectedByCategory, setLocalSelectedByCategory] = useState<Record<string, string[]>>({});

  // Use our custom hook for actions selection
  const actionsSelection = useActionsSelection({
    categoryType: "core",
    minRequired: 0, // No minimum required for function actions
    autoSelect: false,
  });

  const {
    filteredCategories: functionCategories,
    isLoading,
    isFavorite,
    toggleFavorite,
    hasInteracted,
    setHasInteracted,
  } = actionsSelection;

  // Initialize selections from store - ONCE only
  useEffect(() => {
    // if (initialized.current || teamActions.length === 0) {
    //   return;
    // }
    
    console.log('Initializing selections from teamActions:', teamActions);
    setLocalSelectedActivities(teamActions.map(action => action.id));
    
    // Mark as initialized to prevent loop
    initialized.current = true;
  }, [teamActions]);

  // Only organize by category when categories are loaded - ONCE only
  useEffect(() => {
    // if (actionsInitialized.current || functionCategories.length === 0 || !initialized.current) {
    //   return;
    // }
    
    // console.log('Organizing selections by category:', functionCategories);
    
    // Organize selections by category
    const byCategory: Record<string, string[]> = {};
    
    functionCategories.forEach(category => {
      // Find actions for this category
      const categoryActions = category.actions
        .filter(action => localSelectedActivities.includes(action.id))
        .map(action => action.id);
        
      if (categoryActions.length > 0) {
        byCategory[category.id] = categoryActions;
      }
    });
    
    console.log('Selections by category:', byCategory, localSelectedActivities);
    setLocalSelectedByCategory(byCategory);
    
    // Mark as initialized to prevent loop
    // actionsInitialized.current = true;
    setHasInteracted(true);
  }, [functionCategories, localSelectedActivities, setHasInteracted]);

  // Handle local selection updates - with memoized callbacks
  const handleLocalUpdateActivities = useCallback((activities: string[]) => {
    console.log('Updating local activities:', activities);
    setLocalSelectedActivities(activities);
  }, []);

  const handleLocalUpdateActivitiesByCategory = useCallback((categoryId: string, activities: string[]) => {
    console.log('Updating category activities:', { categoryId, activities });
    setLocalSelectedByCategory(prev => ({
      ...prev,
      [categoryId]: activities
    }));
  }, []);

  //Memoize handleNext to prevent recreating on every render
  const handleNext = useCallback(() => {
    if (!orgConfig.id) {
      console.error("Organization ID is missing. Full org config:", orgConfig);
      return;
    }

   
  

    try {
      // Convert selected activities to team actions format
      const teamActionsList = localSelectedActivities.map(activityId => {
        // Find the action and its category in categories
        const action = functionCategories
          .flatMap(cat => cat.actions.map(a => ({ ...a, categoryId: cat.id })))
          .find(a => a.id === activityId);
        
        return {
          id: activityId,
          name: action?.name || activityId,
          description: "",
          isEnabled: true,
          categoryId: action?.categoryId || ""
        };
      });

      

      console.log('Saving team actions:', teamActionsList);

     

      // Use setTimeout to defer the state update to next tick - prevents update cycles
      setTimeout(() => {
        // Update localStorage
        updateTeamActionsInStore(teamActionsList);
        
        // Update DB asynchronously
        updateTeamActions({
          functions: teamActionsList,
          orgId: orgConfig.id || ""
        });
      }, 0);
    } catch (err) {
      console.error("Error saving team actions:", err);
    }
  }, [orgConfig.id, localSelectedActivities, updateTeamActions]);

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
        isLoading={isLoading || !initialized.current}
      />
      <div className="max-w-5xl mx-auto">
        <ActionsSelector
          key={`function-actions-${initialized.current}-${actionsInitialized.current}`}
          categories={functionCategories}
          selectedActivities={localSelectedActivities}
          selectedByCategory={localSelectedByCategory}
          updateActivities={handleLocalUpdateActivities}
          updateActivitiesByCategory={handleLocalUpdateActivitiesByCategory}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          isLoading={isLoading || !initialized.current}
          minRequiredActionsPerCategory={0} // No minimum required for function actions
          categoriesTitle="Function Categories"
          categoriesDescription="Select actions for your function or department."
          hasInteracted={hasInteracted}
          setHasInteracted={setHasInteracted}
        />
      </div>
    </div>
  );
}