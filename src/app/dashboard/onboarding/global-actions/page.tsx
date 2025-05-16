// app/dashboard/onboarding/global-actions/page.tsx

"use client";

import React from "react";
import PageNavigator from "../components/PageNavigator";
import ActionsSelector from "../components/ActionsSelector";
import { useActionsSelection } from "@/hooks/useActionsSelection";
import { MANDATORY_CATEGORIES } from "@/store/action-store";
import { useConfigStore, useUpdateGlobalFunctions } from "@/store/config-store";

export default function GlobalActionsPage() {
  const MIN_REQUIRED_ACTIONS_PER_CATEGORY = 5;
  const { mutate: updateGlobalFunctions } = useUpdateGlobalFunctions();
  const orgConfig = useConfigStore((state) => state.config.organization);

  console.log('Full config store state:', useConfigStore.getState());
  console.log('orgConfig in global actions page:', orgConfig);

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
    autoSelect: true,
  });

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
          isLoading={isLoading}
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