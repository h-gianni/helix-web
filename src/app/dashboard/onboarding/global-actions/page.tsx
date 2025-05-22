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
  useActionsSelection,
  useStoreGlobalActions 
} from "@/store/config-store";

export default function GlobalActionsPage() {
  const MIN_REQUIRED_ACTIONS_PER_CATEGORY = 5;
  const orgConfig = useConfigStore((state) => state.config.organization);
  const updateGlobalFunctionsInStore = useConfigStore((state) => state.updateGlobalFunctions);
  const [initialSelectionDone, setInitialSelectionDone] = useState(false);
  const { mutate: storeGlobalActions } = useStoreGlobalActions();

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

  // Handle initial selection based on localStorage or existing global functions
  useEffect(() => {
    if (initialSelectionDone || isLoadingGlobalFunctions || generalCategories.length === 0) {
      return;
    }

    console.log('Setting up initial selections...');
    
    // Check localStorage first
    const storedConfig = localStorage.getItem('app-configuration');
    const parsedConfig = storedConfig ? JSON.parse(storedConfig) : null;
    const storedSelections = parsedConfig?.state?.config?.activities?.selected || [];
    const storedByCategory = parsedConfig?.state?.config?.activities?.selectedByCategory || {};

    if (storedSelections.length > 0) {
      console.log('Found stored selections in localStorage:', storedSelections);
      updateActivities(storedSelections);
      Object.entries(storedByCategory).forEach(([categoryId, actions]) => {
        updateActivitiesByCategory(categoryId, actions as string[]);
      });
      setInitialSelectionDone(true);
      setHasInteracted(true);
      return;
    }

    // If no localStorage data, check database
    if (existingGlobalFunctions && existingGlobalFunctions.length > 0) {
      console.log('Using existing global functions from database:', existingGlobalFunctions);
      const existingActions = existingGlobalFunctions
        .filter(func => func.status === "ACTIVE")
        .map(func => ({
          id: func.actionId,
          name: func.action.name,
          description: "",
          isEnabled: true
        }));
      
      // Update the store with existing functions
      updateGlobalFunctionsInStore(existingActions);
      
      // Create selections map
      const selectionsByCategory: Record<string, string[]> = {};
      const allSelections = existingActions.map(a => a.id);
      
      // Organize by category
      generalCategories.forEach(category => {
        const categoryActions = existingActions
          .filter(action => category.actions.some(a => a.id === action.id))
          .map(a => a.id);
        
        if (categoryActions.length > 0) {
          selectionsByCategory[category.id] = categoryActions;
        }
      });

      // Update state
      Object.entries(selectionsByCategory).forEach(([categoryId, actions]) => {
        updateActivitiesByCategory(categoryId, actions);
      });
      updateActivities(allSelections);
    } else {
      // If no existing data anywhere, select first 5 from each category
      const selectionsByCategory: Record<string, string[]> = {};
      let allSelections: string[] = [];
      
      generalCategories.forEach(category => {
        if (category.actions && category.actions.length > 0) {
          const minActionsCount = Math.min(category.actions.length, MIN_REQUIRED_ACTIONS_PER_CATEGORY);
          const categoryActions = category.actions.slice(0, minActionsCount);
          const categoryActionIds = categoryActions.map(a => a.id);
          
          selectionsByCategory[category.id] = categoryActionIds;
          allSelections = [...allSelections, ...categoryActionIds];
        }
      });

      // Update state
      Object.entries(selectionsByCategory).forEach(([categoryId, actions]) => {
        updateActivitiesByCategory(categoryId, actions);
      });
      updateActivities(allSelections);
    }
    
    setInitialSelectionDone(true);
    setHasInteracted(true);
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

    // Check if each mandatory category has minimum required actions
    const hasMinimumActions = MANDATORY_CATEGORIES.every(categoryName => {
      const category = generalCategories.find(cat => cat.name === categoryName);
      if (!category) return false;
      
      const selectedCount = selectedByCategory[category.id]?.length || 0;
      if (selectedCount < MIN_REQUIRED_ACTIONS_PER_CATEGORY) {
        console.error(`Category ${categoryName} has only ${selectedCount} actions selected. Minimum required: ${MIN_REQUIRED_ACTIONS_PER_CATEGORY}`);
        return false;
      }
      return true;
    });

    if (!hasMinimumActions) {
      console.error("Not all mandatory categories have minimum required actions");
      return;
    }

    try {
      // Convert selected activities to global functions format
      const globalFunctions = selectedActivities.map(activityId => ({
        id: activityId,
        name: activityId,
        description: "",
        isEnabled: true
      }));

      console.log('Saving global functions:', globalFunctions);
      
      // Update both localStorage and database
      updateGlobalFunctionsInStore(globalFunctions);
      
      // Store in database
      storeGlobalActions();
      
    } catch (err) {
      console.error("Error in handleNext:", err);
    }
  }, [
    orgConfig.id,
    selectedActivities,
    selectedByCategory,
    generalCategories,
    updateGlobalFunctionsInStore,
    storeGlobalActions
  ]);

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
        disabledTooltip={`Please select at least ${MIN_REQUIRED_ACTIONS_PER_CATEGORY} actions from each mandatory category (Cultural Behaviours & Values, Customer Centricity, and Teamwork) to continue`}
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