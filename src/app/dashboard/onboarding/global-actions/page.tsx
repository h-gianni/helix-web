// app/dashboard/onboarding/global-actions/page.tsx

"use client";

import React, { useEffect } from "react";
import PageNavigator from "../components/PageNavigator";
import ActionsSelector from "../components/ActionsSelector";
import { useActionsSelection } from "@/hooks/useActionsSelection";
import { MANDATORY_CATEGORIES } from "@/store/action-store";
import { useConfigStore, useUpdateGlobalFunctions, useGlobalFunctions } from "@/store/config-store";

export default function GlobalActionsPage() {
  const MIN_REQUIRED_ACTIONS_PER_CATEGORY = 5;
  const { mutate: updateGlobalFunctions } = useUpdateGlobalFunctions();
  const orgConfig = useConfigStore((state) => state.config.organization);
  const updateGlobalFunctionsInStore = useConfigStore((state) => state.updateGlobalFunctions);

  // Fetch existing global functions
  const { data: existingGlobalFunctions, isLoading: isLoadingGlobalFunctions } = useGlobalFunctions(orgConfig.id || "");

  // Use our custom hook for actions selection
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
    categoryType: "general",
    minRequired: MIN_REQUIRED_ACTIONS_PER_CATEGORY,
    autoSelect: false, // We'll handle selection manually
  });

  // Handle initial selection based on existing global functions
  useEffect(() => {
    if (!isLoadingGlobalFunctions && generalCategories.length > 0) {
      if (existingGlobalFunctions && existingGlobalFunctions.length > 0) {
        // If we have existing global functions, use those
        const existingActions = existingGlobalFunctions.map(func => ({
          id: func.actionId,
          name: func.action.name,
          description: "",
          isEnabled: true
        }));
        updateGlobalFunctionsInStore(existingActions);
        updateActivities(existingActions.map(a => a.id));
      } else {
        // If no existing functions, select first 5 from each category
        const initialSelections: string[] = [];
        generalCategories.forEach(category => {
          const categoryActions = category.actions.slice(0, MIN_REQUIRED_ACTIONS_PER_CATEGORY);
          initialSelections.push(...categoryActions.map(a => a.id));
          updateActivitiesByCategory(category.id, categoryActions.map(a => a.id));
        });
        updateActivities(initialSelections);
      }
    }
  }, [isLoadingGlobalFunctions, existingGlobalFunctions, generalCategories]);

  const handleNext = () => {
    console.log('Full config store state in handleNext:', useConfigStore.getState());
    console.log('orgConfig in handleNext:', orgConfig);
    
    if (!orgConfig.id) {
      console.error("Organization ID is missing. Full org config:", orgConfig);
      return;
    }

    // Convert selected activities to global functions format
    const globalFunctions = selectedActivities.map(activity => ({
      id: activity,
      name: activity,
      description: "",
      isEnabled: true
    }));
    
    // Call the mutation to update global functions
    updateGlobalFunctions({
      functions: globalFunctions,
      orgId: orgConfig.id
    });
  };

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
        isLoading={isLoadingGlobalFunctions}
      />
      <div className="max-w-5xl mx-auto">
        <ActionsSelector
          categories={generalCategories}
          selectedActivities={selectedActivities}
          selectedByCategory={selectedByCategory}
          updateActivities={updateActivities}
          updateActivitiesByCategory={updateActivitiesByCategory}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          isLoading={isLoading || isLoadingGlobalFunctions}
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