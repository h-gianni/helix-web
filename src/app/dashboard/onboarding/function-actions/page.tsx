// app/dashboard/onboarding/function-actions/page.tsx

"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useConfigStore, useStoreTeamActions, useActionsSelection } from "@/store/config-store";
import { useOrganizationData } from "@/store/config-store";
import { useQuery } from "@tanstack/react-query";
import PageNavigator from "../components/PageNavigator";
import ActionsSelector from "../components/ActionsSelector";
import { apiClient } from "@/lib/api/api-client";
import type { ApiResponse } from "@/lib/types/api";

interface TeamAction {
  id: string;
  actionId: string;
  status: string;
  action?: {
    id: string;
    name: string;
  };
}

interface ConfigTeamAction {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  isEnabled: boolean;
}

export default function FunctionActionsPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const orgConfig = useConfigStore((state) => state.config.organization);
  const teamActions = useConfigStore((state) => state.config.teamActions || []) as ConfigTeamAction[];
  const { mutate: storeTeamActions } = useStoreTeamActions();
  
  // Use refs to track initialization state
  const initialized = useRef(false);

  // Local state for selections - initialized once
  const [localSelectedActivities, setLocalSelectedActivities] = useState<string[]>([]);
  const [localSelectedByCategory, setLocalSelectedByCategory] = useState<Record<string, string[]>>({});

  // Fetch team actions from database
  const { data: dbTeamActions, isLoading: isLoadingDbActions } = useQuery({
    queryKey: ['function-actions', orgConfig.id],
    queryFn: async () => {
      if (!orgConfig.id) return null;
      
      try {
        const response = await apiClient.get<ApiResponse<{ actions: TeamAction[] }>>(`/org/functionactions?orgId=${orgConfig.id}`);
        if (!response.data.success || !response.data.data) {
          console.error('Failed to fetch function actions:', response.data.error);
          return null;
        }
        return response.data.data.actions;
      } catch (error) {
        console.error('Error fetching function actions:', error);
        return null;
      }
    },
    enabled: !!orgConfig.id,
    gcTime: 60000, // Keep data in garbage collection for 1 minute
    staleTime: 30000 // Consider data fresh for 30 seconds
  });

  // Use the action selection functionality from config store
  const actionsSelection = useActionsSelection({
    minRequired: 0,
    autoSelect: false,
    showMandatoryOnly: false,
    filterGlobal: true  // Add this to filter out global categories
  });

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
  } = actionsSelection;

  // Use our custom hooks
  const teamMembers = useConfigStore((state) => state.config.teamMembers || []);
  const updateTeamMembers = useConfigStore((state) => state.updateTeamMembers);

  // Initialize selections from store and database - ONCE only
  useEffect(() => {
    if (!functionCategories.length || isLoadingDbActions) {
      return;
    }

    // If we already have selections and we're not in initial load, preserve them
    if (localSelectedActivities.length > 0 && initialized.current) {
      console.log('Preserving existing selections:', localSelectedActivities);
      return;
    }

    

    // Get team actions from Zustand store
    const storedTeamActions = teamActions;
    
    // If we have stored actions in Zustand, use those
    if (storedTeamActions && storedTeamActions.length > 0) {
      const storedActionIds = storedTeamActions.map(action => action.id);
      console.log('Setting selections from Zustand store:', storedActionIds);
      setLocalSelectedActivities(storedActionIds);

      // Organize by category and update store
      const byCategory: Record<string, string[]> = {};
      functionCategories.forEach(category => {
        console.log('Category:', category);
        const categoryActions = storedActionIds.filter(actionId =>
          category.actions.some(action => action.id === actionId)
        );
        console.log('Category actions:', categoryActions);
        if (categoryActions.length > 0) {
          byCategory[category.id] = categoryActions;
          // Update store for this category
          updateActivitiesByCategory(category.id, categoryActions);
        }
      });

      setLocalSelectedByCategory(byCategory);
      setHasInteracted(true);
    } 
    // If no store data, check DB data
    else if (dbTeamActions && dbTeamActions.length > 0) {
      const dbActions = dbTeamActions.map(action => action.actionId);
      console.log('Setting selections from DB:', dbActions);
      setLocalSelectedActivities(dbActions);

      // Organize by category and update store
      const byCategory: Record<string, string[]> = {};
      functionCategories.forEach(category => {
        const categoryActions = dbActions.filter(actionId =>
          category.actions.some(action => action.id === actionId)
        );
        if (categoryActions.length > 0) {
          byCategory[category.id] = categoryActions;
          // Update store for this category
          updateActivitiesByCategory(category.id, categoryActions);
        }
      });

      // Update global activities in store
      updateActivities(dbActions);
      setLocalSelectedByCategory(byCategory);
      setHasInteracted(true);
    } 
    // If no data found anywhere, initialize with empty selections
    else {
      console.log('No stored actions found, initializing with empty selections');
      setLocalSelectedActivities([]);
      setLocalSelectedByCategory({});
      setHasInteracted(false);
    }

    initialized.current = true;
  }, [teamActions, dbTeamActions, functionCategories, isLoadingDbActions, setHasInteracted, updateActivities, updateActivitiesByCategory]);

  // Handle local selection updates - with memoized callbacks
  const handleLocalUpdateActivities = useCallback((activities: string[]) => {
    console.log('Updating local activities:', activities);
    setLocalSelectedActivities(activities);
    
    // Also update the local by-category state to keep it in sync
    const byCategory: Record<string, string[]> = {};
    functionCategories.forEach(category => {
      const categoryActions = activities.filter(activityId => 
        category.actions.some(action => action.id === activityId)
      );
      if (categoryActions.length > 0) {
        byCategory[category.id] = categoryActions;
      }
    });
    setLocalSelectedByCategory(byCategory);
  }, [functionCategories]);

  const handleLocalUpdateActivitiesByCategory = useCallback((categoryId: string, activities: string[]) => {
    console.log('Updating category activities:', { categoryId, activities });
    
    // Update the category-specific selections
    setLocalSelectedByCategory(prev => ({
      ...prev,
      [categoryId]: activities
    }));

    // Update the global selections list
    setLocalSelectedActivities(prev => {
      // Remove all activities from this category
      const withoutCategory = prev.filter(activityId => 
        !functionCategories
          .find(cat => cat.id === categoryId)?.actions
          .some(action => action.id === activityId)
      );
      
      // Add the new selections for this category
      return [...withoutCategory, ...activities];
    });
  }, [functionCategories]);

  // Memoize handleNext to prevent recreating on every render
  const handleNext = useCallback(async () => {
    if (isSaving) return; // Prevent multiple clicks

    if (!orgConfig.id) {
      console.error("Organization ID is missing. Full org config:", orgConfig);
      return;
    }

    try {
      setIsSaving(true);

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

      // Store in database and wait for completion
      await new Promise((resolve, reject) => {
        storeTeamActions(teamActionsList, {
          onSuccess: () => {
            console.log('Successfully stored team actions');
            resolve(true);
          },
          onError: (error) => {
            console.error('Failed to store team actions:', error);
            reject(error);
          }
        });
      });

      // Navigate to next step after successful storage
      router.push("/dashboard/onboarding/members");

    } catch (err) {
      console.error("Error saving team actions:", err);
      // You might want to show an error message to the user here
    } finally {
      setIsSaving(false);
    }
  }, [
    isSaving,
    orgConfig.id,
    localSelectedActivities,
    functionCategories,
    storeTeamActions,
    router
  ]);

  const isPageLoading = isLoading || !initialized.current || isSaving;

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
        nextHref="#" // Prevent default navigation
        canContinue={true && !isSaving} // Always allow continuing for function actions
        currentStep={3}
        totalSteps={6}
        disabledTooltip={isSaving ? "Saving team actions..." : undefined}
        onNext={handleNext}
        isLoading={isPageLoading}
      />
      <div className="max-w-5xl mx-auto">
        <ActionsSelector
          key={`function-actions-${initialized.current}-${initialized.current}`}
          categories={functionCategories}
          selectedActivities={localSelectedActivities}
          selectedByCategory={localSelectedByCategory}
          updateActivities={handleLocalUpdateActivities}
          updateActivitiesByCategory={handleLocalUpdateActivitiesByCategory}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          isLoading={isPageLoading}
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