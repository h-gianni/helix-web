import React, { useEffect, useState } from 'react';
import { Switch } from "@/components/ui/core/Switch";
import { Square, SquareCheckBig } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrganizationCategories } from "./_actions-categories";
import { useConfigStore } from '@/store/config-store';
import { useActionModalStore, useActions, useActionsByCategory, useActionStore } from '@/store/action-store';
import { Action, ActionCategory } from '@/lib/types/api/action';

interface ActionsConfigProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  // Add a prop to determine if we should preselect items for a specific category
  preselectCategory?: string;
}

const ActionsConfig: React.FC<ActionsConfigProps> = ({
  selectedCategory,
  setSelectedCategory,
  preselectCategory, // Category ID to preselect items from
}) => {
  const selectedActivities = useConfigStore((state) => state.config.activities.selected);
  const selectedByCategory = useConfigStore((state) => state.config.activities.selectedByCategory);
  const updateActivities = useConfigStore((state) => state.updateActivities);
  const updateActivitiesByCategory = useConfigStore((state) => state.updateActivitiesByCategory);

  const { data: actionCategories, isLoading } = useActions();
  const { selectedCategoryId, setSelectedCategoryId } = useActionModalStore();
  const [filteredActions, setFilteredActions] = useState<ActionCategory[]>([]);
  
  // Track if initial selection has been done
  const [hasPreselected, setHasPreselected] = useState(false);

  const { data: selectedCategoryData, isLoading: isLoadingCategory } = useActionsByCategory(selectedCategoryId ?? '');
  const { data: preselectCategoryData, isLoading: isLoadingPreselectCategory } = 
    useActionsByCategory(preselectCategory ?? '');

  // Set the default category on load
  useEffect(() => {
    if (actionCategories && actionCategories.length > 0 && !selectedCategoryId) {
      // If preselectCategory is provided, use that as default
      const defaultCategory = preselectCategory || actionCategories[0].id;
      setSelectedCategoryId(defaultCategory);
      setSelectedCategory(defaultCategory);
    }
  }, [actionCategories, selectedCategoryId, setSelectedCategoryId, setSelectedCategory, preselectCategory]);

  // Update filtered actions when the selected category changes
  useEffect(() => {
    if (selectedCategoryData) {
      setFilteredActions(selectedCategoryData);
    }
  }, [selectedCategoryData]);

  // Handle preselection logic - only run once
  useEffect(() => {
    if (!hasPreselected && preselectCategory && preselectCategoryData && !isLoadingPreselectCategory) {
      // Extract all action IDs from the preselect category
      const actionsToPreselect = preselectCategoryData.flatMap(category => 
        category.actions.map(action => action.id)
      );
      
      // Update the selected activities and store by category
      if (actionsToPreselect.length > 0) {
        updateActivities(actionsToPreselect);
        updateActivitiesByCategory(preselectCategory, actionsToPreselect);
        setHasPreselected(true);
      }
    }
  }, [preselectCategory, preselectCategoryData, isLoadingPreselectCategory, hasPreselected, updateActivities, updateActivitiesByCategory]);

  const handleSelectActivity = (activityId: string) => {
    // First, update the global selected activities list
    const newActivities = selectedActivities.includes(activityId)
      ? selectedActivities.filter(a => a !== activityId)
      : [...selectedActivities, activityId];
    updateActivities(newActivities);
    
    // Then, update the category-specific list
    if (selectedCategoryId) {
      // Safely access the category activities or default to empty array
      const currentCategoryActivities = selectedByCategory && 
        selectedByCategory[selectedCategoryId] ? 
        [...selectedByCategory[selectedCategoryId]] : 
        [];
      
      // Check if activity is already in global selected list
      const isActivitySelected = selectedActivities.includes(activityId);
      
      // Create updated category activities
      let updatedCategoryActivities;
      if (isActivitySelected) {
        // If it was selected, remove it from category
        updatedCategoryActivities = currentCategoryActivities.filter(id => id !== activityId);
      } else {
        // If it wasn't selected, add it to category
        updatedCategoryActivities = [...currentCategoryActivities, activityId];
      }
      
      // Update the category-specific store
      updateActivitiesByCategory(selectedCategoryId, updatedCategoryActivities);
    }
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedCategory(categoryId);
  };

  // Check if all actions in the CURRENT category are selected
  const areAllCurrentCategoryActionsSelected = 
    filteredActions.length > 0 &&
    filteredActions.every((category) =>
      category.actions.every((action) => selectedActivities.includes(action.id))
    );

  // Toggle select all for ONLY the current category's actions
  const toggleSelectAllCurrentCategoryActions = (checked: boolean) => {
    // Get only the action IDs from the currently selected category
    const currentCategoryActionIds = filteredActions.flatMap((category) =>
      category.actions.map((action) => action.id)
    );

    if (checked) {
      // Select all actions in the current category
      const newActivities = [...new Set([...selectedActivities, ...currentCategoryActionIds])];
      updateActivities(newActivities);
      
      // Also update the category-specific store
      if (selectedCategoryId) {
        updateActivitiesByCategory(selectedCategoryId, currentCategoryActionIds);
      }
    } else {
      // Deselect all actions in the current category
      const newActivities = selectedActivities.filter(
        (activityId) => !currentCategoryActionIds.includes(activityId)
      );
      updateActivities(newActivities);
      
      // Also update the category-specific store
      if (selectedCategoryId) {
        updateActivitiesByCategory(selectedCategoryId, []);
      }
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-base text-foreground-weak">
        Select all important activities in your organization for team performance scoring.
      </p>
      <div className="flex items-start gap-12">
        <div className="min-w-56 space-y-4">
          <h4 className="heading-5">Categories</h4>
          <OrganizationCategories
            onSelect={handleSelectCategory}
            selectedActivities={actionCategories ?? []}
            selectedCategory={selectedCategory}
          />
        </div>

        <div className="w-full space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="heading-5">Actions</h4>
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground-muted">Select all</span>
              <Switch
                checked={areAllCurrentCategoryActionsSelected}
                onCheckedChange={toggleSelectAllCurrentCategoryActions}
              />
            </div>
          </div>
          <div className="w-full -space-y-px">
            {filteredActions.map((category) => (
              <div key={category.id}>
                {category.actions.map((action) => (
                  <div
                    key={action.id}
                    className={cn(
                      "flex items-center gap-4 bg-white text-foreground-weak border px-4 py-3 cursor-pointer hover:border-border-strong hover:bg-background",
                      selectedActivities.includes(action.id)
                        ? "bg-primary/10 text-foreground"
                        : "border-border"
                    )}
                    onClick={() => handleSelectActivity(action.id)}
                  >
                    <div className="size-4">
                      {selectedActivities.includes(action.id) ? (
                        <SquareCheckBig className="text-primary w-4 h-4" />
                      ) : (
                        <Square className="text-foreground/25 w-4 h-4" />
                      )}
                    </div>
                    <span className="text-base">{action.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionsConfig;