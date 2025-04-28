// app/dashboard/onboarding/function-actions/page.tsx

"use client";

import React from "react";
import PageNavigator from "../components/PageNavigator";
import ActionsSelector from "../components/ActionsSelector";
import { useActionsSelection } from "@/hooks/useActionsSelection";

export default function FunctionActionsPage() {
  // Use our custom hook for actions selection
  const {
    selectedActivities,
    selectedByCategory,
    updateActivities,
    updateActivitiesByCategory,
    filteredCategories: coreCategories,
    isLoading,
    isFavorite,
    toggleFavorite,
    hasInteracted,
    setHasInteracted,
    countSelectedActionsByType,
    canContinue,
  } = useActionsSelection({
    categoryType: "core",
    minRequired: 1,
    autoSelect: false,
  });

  // Count of function categories with selected actions
  const selectedFunctionsCount = countSelectedActionsByType();

  return (
    <div>
      <PageNavigator
        title="Select Function Actions"
        description={
          <>
            Choose specific actions related to different functions in your
            organization.
            <br />
            These will help evaluate performance based on role-specific
            responsibilities.
          </>
        }
        previousHref="/dashboard/onboarding/global-actions"
        nextHref="/dashboard/onboarding/members"
        canContinue={canContinue()}
        currentStep={3}
        totalSteps={6}
        disabledTooltip={`Please select at least one action from at least one function category to continue (${selectedFunctionsCount}/1 functions selected)`}
      />
      <div className="max-w-5xl mx-auto">
        <ActionsSelector
          categories={coreCategories}
          selectedActivities={selectedActivities}
          selectedByCategory={selectedByCategory}
          updateActivities={updateActivities}
          updateActivitiesByCategory={updateActivitiesByCategory}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          isLoading={isLoading}
          categoriesTitle="Function Categories"
          categoriesDescription="Select actions from functions relevant to your organization."
          selectedLabelPrefix="selected"
          hasInteracted={hasInteracted}
          setHasInteracted={setHasInteracted}
        />
      </div>
    </div>
  );
}