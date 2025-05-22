// app/dashboard/onboarding/global-actions/page.tsx

"use client";

import React, { useEffect, useState, useCallback } from "react";
import PageNavigator from "../components/PageNavigator";
import ActionsSelector from "../components/ActionsSelector";
import { MANDATORY_CATEGORIES } from "@/store/action-store";
import { 
  useConfigStore, 
  useUpdateGlobalFunctions, 
  useGlobalFunctions,
  useActionsSelection 
} from "@/store/config-store";

export default function GlobalActionsPage() {
  const MIN_REQUIRED_ACTIONS_PER_CATEGORY = 5;
  const orgConfig = useConfigStore((state) => state.config.organization);
  const updateGlobalFunctionsInStore = useConfigStore((state) => state.updateGlobalFunctions);
  const [initialSelectionDone, setInitialSelectionDone] = useState(false);

  // Fetch existing global functions only once at component mount
  const { data: existingGlobalFunctions, isLoading: isLoadingGlobalFunctions } = useGlobalFunctions(
    orgConfig.id || ""
  );

  // Use the action selection functionality from config store
  const {
    selectedActivities,
    selectedByCategory,
    updateActivities,
    updateActivitiesByCategory,
    filteredCategories: generalCategories,
    isLoading,
    isFavorite,
    toggleFavorite,
    hasInteracted,
    setHasInteracted,
    canContinue,
  } = useActionsSelection({
    minRequired: MIN_REQUIRED_ACTIONS_PER_CATEGORY,
    autoSelect: false,
    showMandatoryOnly: true
  });

  // Handle initial selection based on existing global functions
  useEffect(() => {
    if (initialSelectionDone || isLoadingGlobalFunctions || generalCategories.length === 0) {
      return;
    }

    console.log('Setting up initial selections...');
    console.log('Existing Global Functions:', existingGlobalFunctions);
    console.log('General Categories:', generalCategories);

    // Create a map to track selections by category
    const selectionsByCategory: Record<string, string[]> = {};
    let allSelections: string[] = [];
    
    if (existingGlobalFunctions && existingGlobalFunctions.length > 0) {
      // If we have existing global functions, use those
      const existingActions = existingGlobalFunctions
        .filter(func => func.status === "ACTIVE")
        .map(func => ({
          id: func.actionId,
          name: func.action.name,
          description: "",
          isEnabled: true
        }));
      
      console.log('Mapped Existing Actions:', existingActions);
      
      // Update the store with existing functions
      updateGlobalFunctionsInStore(existingActions);
      
      // Collect all action IDs
      allSelections = existingActions.map(a => a.id);
      
      // Organize by category
      generalCategories.forEach(category => {
        // Find actions that belong to this category
        const categoryActions = existingActions
          .filter(action => {
            // Find the action in the category's actions
            return category.actions.some(a => a.id === action.id);
          })
          .map(a => a.id);
        
        if (categoryActions.length > 0) {
          selectionsByCategory[category.id] = categoryActions;
        }
      });
    } else {
      // If no existing functions, select first 5 from each category
      generalCategories.forEach(category => {
        if (category.actions && category.actions.length > 0) {
          const minActionsCount = Math.min(category.actions.length, MIN_REQUIRED_ACTIONS_PER_CATEGORY);
          const categoryActions = category.actions.slice(0, minActionsCount);
          const categoryActionIds = categoryActions.map(a => a.id);
          
          selectionsByCategory[category.id] = categoryActionIds;
          allSelections = [...allSelections, ...categoryActionIds];
        }
      });
    }
    
    console.log('Initial selections by category:', selectionsByCategory);
    console.log('All initial selections:', allSelections);
    
    // Update state with our selections in a batch to prevent excessive rerenders
    const batchUpdate = () => {
      Object.entries(selectionsByCategory).forEach(([categoryId, actions]) => {
        updateActivitiesByCategory(categoryId, actions);
      });
      updateActivities(allSelections);
      
      // Mark initialization as complete
      setInitialSelectionDone(true);
      setHasInteracted(true);
    };
    
    batchUpdate();
  }, [
    isLoadingGlobalFunctions, 
    existingGlobalFunctions, 
    generalCategories, 
    initialSelectionDone,
    updateGlobalFunctionsInStore,
    updateActivities,
    updateActivitiesByCategory,
    setHasInteracted
  ]);

  // Memoize the handleNext function to prevent recreation on each render
  const handleNext = useCallback(() => {
    console.log('Selected activities:', selectedActivities);
    if (!orgConfig.id) {
      console.error("Organization ID is missing. Full org config:", orgConfig);
      return;
    }

    try {
      // Get action names for the selected activity IDs
      const actionMap = new Map();
      // generalCategories.forEach(category => {
      //   category.actions.forEach(action => {
      //     actionMap.set(action.id, action.name);
      //   });
      // });

      // Convert selected activities to global functions format
      const globalFunctions = selectedActivities.map(activityId => ({
        id: activityId,
        name: actionMap.get(activityId) || activityId,
        description: "",
        isEnabled: true
      }));

      console.log('Selected activities:', selectedActivities);
      
      console.log('Saving global functions:', globalFunctions);
      
      // Update the store with the new global functions
      updateGlobalFunctionsInStore(globalFunctions);
    } catch (err) {
      console.error("Error in handleNext:", err);
    }
  }, [orgConfig.id, generalCategories, selectedActivities, updateGlobalFunctionsInStore]);

  const isPageLoading = isLoading || isLoadingGlobalFunctions || !initialSelectionDone;

  return (
    <div>
      <PageNavigator
        title="Select Global Actions"
        description={
          <>
            Choose the foundational actions that reflect your organization&apos;s
            core values and culture.
            <br />
            These actions will be evaluated across all teams.
          </>
        }
        previousHref="/dashboard/onboarding/organisation"
        nextHref="/dashboard/onboarding/function-actions"
        canContinue={canContinue()}
        currentStep={2}
        totalSteps={6}
        disabledTooltip={`Please select at least ${MIN_REQUIRED_ACTIONS_PER_CATEGORY} actions from each category to continue`}
        onNext={handleNext}
        isLoading={isPageLoading}
      />
      <div className="max-w-5xl mx-auto">
        <ActionsSelector
          key={`actions-selector-${initialSelectionDone}`} // Force re-render after initial selection
          categories={generalCategories}
          selectedActivities={selectedActivities}
          selectedByCategory={selectedByCategory}
          updateActivities={updateActivities}
          updateActivitiesByCategory={updateActivitiesByCategory}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          isLoading={isPageLoading}
          minRequiredActionsPerCategory={MIN_REQUIRED_ACTIONS_PER_CATEGORY}
          mandatoryCategories={MANDATORY_CATEGORIES}
          categoriesTitle="Global Categories"
          categoriesDescription={`Select at least ${MIN_REQUIRED_ACTIONS_PER_CATEGORY} actions from each category.`}
          hasInteracted={hasInteracted}
          setHasInteracted={setHasInteracted}
        />
      </div>
    </div>
  );
}