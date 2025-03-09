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
  preselectCategory?: string;
}

function ActionsConfig({
  selectedCategory,
  setSelectedCategory,
  preselectCategory,
}: ActionsConfigProps) {
  const selectedActivities = useConfigStore((state) => state.config.activities.selected);
  const selectedByCategory = useConfigStore((state) => state.config.activities.selectedByCategory);
  const updateActivities = useConfigStore((state) => state.updateActivities);
  const updateActivitiesByCategory = useConfigStore((state) => state.updateActivitiesByCategory);

  const { data: actionCategories, isLoading } = useActions();
  const { selectedCategoryId, setSelectedCategoryId } = useActionModalStore();
  const [filteredActions, setFilteredActions] = useState<ActionCategory[]>([]);
  const [hasPreselected, setHasPreselected] = useState(false);

  const { data: selectedCategoryData, isLoading: isLoadingCategory } = useActionsByCategory(selectedCategoryId ?? '');
  const { data: preselectCategoryData, isLoading: isLoadingPreselectCategory } = 
    useActionsByCategory(preselectCategory ?? '');

  useEffect(() => {
    if (actionCategories && actionCategories.length > 0 && !selectedCategoryId) {
      const defaultCategory = preselectCategory || actionCategories[0].id;
      setSelectedCategoryId(defaultCategory);
      setSelectedCategory(defaultCategory);
    }
  }, [actionCategories, selectedCategoryId, setSelectedCategoryId, setSelectedCategory, preselectCategory]);

  useEffect(() => {
    if (selectedCategoryData) {
      setFilteredActions(selectedCategoryData);
    }
  }, [selectedCategoryData]);

  useEffect(() => {
    if (!hasPreselected && preselectCategory && preselectCategoryData && !isLoadingPreselectCategory) {
      const actionsToPreselect = preselectCategoryData.flatMap(category => 
        category.actions.map(action => action.id)
      );
      
      if (actionsToPreselect.length > 0) {
        updateActivities(actionsToPreselect);
        updateActivitiesByCategory(preselectCategory, actionsToPreselect);
        setHasPreselected(true);
      }
    }
  }, [preselectCategory, preselectCategoryData, isLoadingPreselectCategory, hasPreselected, updateActivities, updateActivitiesByCategory]);

  const handleSelectActivity = (activityId: string) => {
    const newActivities = selectedActivities.includes(activityId)
      ? selectedActivities.filter(a => a !== activityId)
      : [...selectedActivities, activityId];
    updateActivities(newActivities);
    
    if (selectedCategoryId) {
      const currentCategoryActivities = selectedByCategory && 
        selectedByCategory[selectedCategoryId] ? 
        [...selectedByCategory[selectedCategoryId]] : 
        [];
      
      const isActivitySelected = selectedActivities.includes(activityId);
      
      let updatedCategoryActivities;
      if (isActivitySelected) {
        updatedCategoryActivities = currentCategoryActivities.filter(id => id !== activityId);
      } else {
        updatedCategoryActivities = [...currentCategoryActivities, activityId];
      }
      
      updateActivitiesByCategory(selectedCategoryId, updatedCategoryActivities);
    }
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedCategory(categoryId);
  };

  const areAllCurrentCategoryActionsSelected = 
    filteredActions.length > 0 &&
    filteredActions.every((category) =>
      category.actions.every((action) => selectedActivities.includes(action.id))
    );

  const toggleSelectAllCurrentCategoryActions = (checked: boolean) => {
    const currentCategoryActionIds = filteredActions.flatMap((category) =>
      category.actions.map((action) => action.id)
    );

    if (checked) {
      const newActivities = [...new Set([...selectedActivities, ...currentCategoryActionIds])];
      updateActivities(newActivities);
      
      if (selectedCategoryId) {
        updateActivitiesByCategory(selectedCategoryId, currentCategoryActionIds);
      }
    } else {
      const newActivities = selectedActivities.filter(
        (activityId) => !currentCategoryActionIds.includes(activityId)
      );
      updateActivities(newActivities);
      
      if (selectedCategoryId) {
        updateActivitiesByCategory(selectedCategoryId, []);
      }
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-base">
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
              <span className="text-sm">Select all</span>
              <Switch
                data-slot="switch"
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
                      "flex items-center gap-4 bg-white border px-4 py-3 cursor-pointer hover:border-border-strong hover:bg-background",
                      selectedActivities.includes(action.id)
                        ? "bg-primary/10 text-foreground"
                        : "border-border"
                    )}
                    onClick={() => handleSelectActivity(action.id)}
                  >
                    <div className="size-4">
                      {selectedActivities.includes(action.id) ? (
                        <SquareCheckBig className="text-primary size-4" />
                      ) : (
                        <Square className="text-foreground/25 size-4" />
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
}

export default ActionsConfig;