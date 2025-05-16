// app/dashboard/onboarding/function-actions/page.tsx

"use client";

import React from "react";
import PageNavigator from "../components/PageNavigator";
import ActionsSelector from "../components/ActionsSelector";
import { useActionsSelection } from "@/hooks/useActionsSelection";
import { MANDATORY_CATEGORIES } from "@/store/action-store";
import { useConfigStore, useUpdateTeamActions } from "@/store/config-store";

export default function FunctionActionsPage() {
  const MIN_REQUIRED_ACTIONS_PER_CATEGORY = 5;
  const { mutate: updateTeamActions } = useUpdateTeamActions();
  const orgConfig = useConfigStore((state) => state.config.organization);

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

    // Convert selected activities to team actions format
    const teamActions = selectedActivities.map(activity => ({
      id: activity,
      name: activity,
      description: "",
      isEnabled: true
    }));
    
    // Call the mutation to update team actions
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
        canContinue={canContinue()}
        currentStep={3}
        totalSteps={6}
        disabledTooltip={`Please select at least ${MIN_REQUIRED_ACTIONS_PER_CATEGORY} actions from each category to continue`}
        onNext={handleNext}
      />
      <div className="max-w-5xl mx-auto">
        <ActionsSelector
          categories={functionCategories}
          selectedActivities={selectedActivities}
          selectedByCategory={selectedByCategory}
          updateActivities={updateActivities}
          updateActivitiesByCategory={updateActivitiesByCategory}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          isLoading={isLoading}
          minRequiredActionsPerCategory={MIN_REQUIRED_ACTIONS_PER_CATEGORY}
          mandatoryCategories={MANDATORY_CATEGORIES}
          categoriesTitle="Function Categories"
          categoriesDescription={`Select at least ${MIN_REQUIRED_ACTIONS_PER_CATEGORY} actions from each category.`}
          hasInteracted={hasInteracted}
          setHasInteracted={setHasInteracted}
        />
      </div>
    </div>
  );
}