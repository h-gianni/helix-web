// app/dashboard/onboarding/components/ActionsSelector.tsx

"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Heart, SquareCheck, Square, CheckSquare, Check } from "lucide-react";
import { Badge } from "@/components/ui/core/Badge";
import { Button } from "@/components/ui/core/Button";
import { Switch } from "@/components/ui/core/Switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/core/Tooltip";
import { cn } from "@/lib/utils";
import { ActionCategory } from "@/lib/types/api/action";
import { Card } from "@/components/ui/core/Card";

interface ActionsSelectorProps {
  categories: ActionCategory[];
  selectedActivities: string[];
  selectedByCategory: Record<string, string[]>;
  updateActivities: (activities: string[]) => void;
  updateActivitiesByCategory: (
    categoryId: string,
    activities: string[]
  ) => void;
  isFavorite: (actionId: string, categoryId: string) => boolean;
  toggleFavorite: {
    mutateAsync: (params: {
      actionId: string;
      categoryId: string;
      isFavorite: boolean;
    }) => Promise<any>;
  };
  isLoading: boolean;
  minRequiredActionsPerCategory?: number;
  mandatoryCategories?: string[];
  categoriesTitle: string;
  categoriesDescription: string;
  selectedLabelPrefix?: string;
  hasInteracted?: boolean;
  setHasInteracted?: (value: boolean) => void;
  introContent?: React.ReactNode;
}

const ActionsSelector = React.memo(function ActionsSelector({
  categories,
  selectedActivities,
  selectedByCategory,
  updateActivities,
  updateActivitiesByCategory,
  isFavorite,
  toggleFavorite,
  isLoading,
  minRequiredActionsPerCategory = 0,
  mandatoryCategories = [],
  categoriesTitle,
  categoriesDescription,
  selectedLabelPrefix = "",
  hasInteracted = true,
  setHasInteracted,
  introContent,
}: ActionsSelectorProps) {
  // State for the selected category
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  // Memoize the filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => cat.actions.length > 0);
  }, [categories]);

  // Memoize the selected activities map for faster lookups
  const selectedActivitiesMap = useMemo(() => {
    return new Set(selectedActivities);
  }, [selectedActivities]);

  // Handle category selection
  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      setSelectedCategoryId(categoryId);
      // Mark as having interacted once the user selects a category
      if (setHasInteracted && !hasInteracted) {
        setHasInteracted(true);
      }
    },
    [hasInteracted, setHasInteracted]
  );

  // Get selected count for a category
  const getSelectedCount = useCallback(
    (categoryId: string): number => {
      return selectedByCategory && selectedByCategory[categoryId]
        ? selectedByCategory[categoryId].length
        : 0;
    },
    [selectedByCategory]
  );

      // Handle action selection
  const handleSelectActivity = useCallback(
    async (activityId: string, activityName: string, categoryId: string) => {
      // Check if this action is in a mandatory category
      const isMandatoryCategory = mandatoryCategories.includes(
        categories?.find((cat) => cat.id === categoryId)?.name || ""
      );

      const isCurrentlySelected = selectedActivitiesMap.has(activityId);
      const currentSelectedCount = getSelectedCount(categoryId);
      
      // Calculate if deselecting would put us below the minimum
      const wouldViolateMinimum = 
        isMandatoryCategory &&
        isCurrentlySelected && 
        currentSelectedCount <= minRequiredActionsPerCategory;

      console.log('handleSelectActivity Debugsd:', {
        activityId,
        categoryId,
        isMandatoryCategory,
        currentSelectedCount,
        activityName,
        minRequired: minRequiredActionsPerCategory,
        currentSelected: selectedByCategory[categoryId] || [],
        isCurrentlySelected,
        wouldViolateMinimum
      });

      // If it's in a mandatory category and deselecting would put us below minimum, prevent it
      if (wouldViolateMinimum) {
        console.log(
          `Cannot deselect: Only ${currentSelectedCount} selected, minimum required is ${minRequiredActionsPerCategory}`
        );
        return;
      }

      // If we're deselecting and it's favorited, remove from favorites too
      if (isCurrentlySelected && isFavorite(activityId, categoryId)) {
        try {
          // Unfavorite the action when it's deselected
          await toggleFavorite.mutateAsync({
            actionId: activityId,
            categoryId,
            isFavorite: false,
          });
        } catch (err) {
          console.error("Failed to remove favorite status:", err);
        }
      }

      // Proceed with selection/deselection
      const newActivities = isCurrentlySelected
        ? selectedActivities.filter((a) => a !== activityId)
        : [...selectedActivities, activityId];
      updateActivities(newActivities);

      if (categoryId) {
        const currentCategoryActivities =
          selectedByCategory && selectedByCategory[categoryId]
            ? [...selectedByCategory[categoryId]]
            : [];

        let updatedCategoryActivities;
        if (isCurrentlySelected) {
          updatedCategoryActivities = currentCategoryActivities.filter(
            (id) => id !== activityId
          );
        } else {
          updatedCategoryActivities = [
            ...currentCategoryActivities,
            activityId,
          ];
        }

        updateActivitiesByCategory(categoryId, updatedCategoryActivities);
      }
    },
    [
      mandatoryCategories,
      categories,
      selectedActivities,
      selectedActivitiesMap,
      selectedByCategory,
      minRequiredActionsPerCategory,
      updateActivities,
      updateActivitiesByCategory,
      isFavorite,
      toggleFavorite,
      getSelectedCount,
    ]
  );

  // Handle favorites toggle
  const handleToggleFavorite = useCallback(
    async (actionId: string, categoryId: string, e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent action selection

      const currentStatus = isFavorite(actionId, categoryId);

      try {
        await toggleFavorite.mutateAsync({
          actionId,
          categoryId,
          isFavorite: !currentStatus,
        });
      } catch (err) {
        console.error("Failed to toggle favorite:", err);
      }
    },
    [isFavorite, toggleFavorite]
  );

  // Check if all actions in a category are selected
  const areAllCategoryActionsSelected = useCallback(
    (category: ActionCategory): boolean => {
      if (!category || !category.actions || category.actions.length === 0) {
        return false;
      }
      return category.actions.every((action) =>
        selectedActivitiesMap.has(action.id)
      );
    },
    [selectedActivitiesMap]
  );

  // Toggle select all actions in a category
  const toggleSelectAllCategoryActions = useCallback(
    async (category: ActionCategory, checked: boolean) => {
      if (!category || !category.actions || category.actions.length === 0) {
        return;
      }

      const categoryActionIds = category.actions.map((action) => action.id);

      if (checked) {
        // When checking "select all", just select everything
        const newActivities = [
          ...new Set([...selectedActivities, ...categoryActionIds]),
        ];
        updateActivities(newActivities);
        updateActivitiesByCategory(category.id, categoryActionIds);
      } else {
        // Check if this is a mandatory category
        const isMandatory = mandatoryCategories.includes(category.name);

        // For each deselected action, also remove it from favorites
        const actionsToUnfavorite: string[] = [];
        
        for (const actionId of categoryActionIds) {
          // If favorited, collect for unfavoriting
          if (isFavorite(actionId, category.id)) {
            actionsToUnfavorite.push(actionId);
          }
        }

        if (isMandatory && minRequiredActionsPerCategory > 0) {
          // For mandatory categories, keep the minimum required
          const actionsToKeep = categoryActionIds.slice(
            0,
            minRequiredActionsPerCategory
          );

          // Update activities excluding all but the kept ones
          const newActivities = selectedActivities.filter(
            (activityId) =>
              !categoryActionIds.includes(activityId) ||
              actionsToKeep.includes(activityId)
          );
          updateActivities(newActivities);
          updateActivitiesByCategory(category.id, actionsToKeep);
          
          // Only unfavorite actions that are actually being deselected
          const actionsToReallyUnfavorite = actionsToUnfavorite.filter(
            id => !actionsToKeep.includes(id)
          );
          
          // Unfavorite deselected actions
          for (const actionId of actionsToReallyUnfavorite) {
            try {
              await toggleFavorite.mutateAsync({
                actionId,
                categoryId: category.id,
                isFavorite: false,
              });
            } catch (err) {
              console.error(
                `Failed to remove favorite status for action ${actionId}:`,
                err
              );
            }
          }
        } else {
          // For non-mandatory categories, deselect all
          const newActivities = selectedActivities.filter(
            (activityId) => !categoryActionIds.includes(activityId)
          );
          updateActivities(newActivities);
          updateActivitiesByCategory(category.id, []);
          
          // Unfavorite all deselected actions
          for (const actionId of actionsToUnfavorite) {
            try {
              await toggleFavorite.mutateAsync({
                actionId,
                categoryId: category.id,
                isFavorite: false,
              });
            } catch (err) {
              console.error(
                `Failed to remove favorite status for action ${actionId}:`,
                err
              );
            }
          }
        }
      }
    },
    [
      selectedActivities,
      updateActivities,
      updateActivitiesByCategory,
      mandatoryCategories,
      minRequiredActionsPerCategory,
      isFavorite,
      toggleFavorite,
    ]
  );

  // Get the currently selected category
  const selectedCategory = useMemo(
    () => categories?.find((cat) => cat.id === selectedCategoryId),
    [categories, selectedCategoryId]
  );

  // Set first category as selected if none is selected and categories are available
  useEffect(() => {
    if (filteredCategories?.length > 0 && !selectedCategoryId && !isLoading) {
      setSelectedCategoryId(filteredCategories[0].id);
      if (setHasInteracted && !hasInteracted) {
        setHasInteracted(true);
      }
    }
  }, [
    filteredCategories,
    selectedCategoryId,
    isLoading,
    setHasInteracted,
    hasInteracted,
  ]);

  if (isLoading) {
    return <div className="flex justify-center py-12">Loading actions...</div>;
  }

  return (
    <Card className="p-1">
      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row">
        {/* Left column: Categories */}
        <div className="w-full md:w-1/3 border-r border-border-weak">
          <div className="py-6 px-4">
            <h2 className="heading-3">{categoriesTitle}</h2>
          </div>
          <div className="divide-y divide-neutral-lighter">
            {filteredCategories.length === 0 ? (
              <div className="p-4 text-foreground-weak">
                No functions available
              </div>
            ) : (
              filteredCategories.map((category) => {
                const selectedCount = getSelectedCount(category.id);
                const isSelected = selectedCategoryId === category.id;
                const hasMinimumSelected =
                  minRequiredActionsPerCategory > 0
                    ? selectedCount >= minRequiredActionsPerCategory
                    : false;
                const isMandatoryCategory = mandatoryCategories.includes(
                  category.name
                );

                return (
                  <div
                    key={category.id}
                    className={cn(
                      "min-h-12 px-4 py-2 -ml-1 flex justify-between items-center cursor-pointer hover:bg-neutral-50",
                      isSelected &&
                        "bg-primary-50 border-l-4 border-l-primary",
                      !isSelected && "border-l-4 border-l-transparent"
                    )}
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                    </div>
                    {selectedCount > 0 && (
                      <Badge variant="primary">
                        <Check className="size-3 mr-1" /> {selectedCount}
                      </Badge>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right column: Actions */}
        <div className="w-full md:w-2/3">
          {selectedCategory ? (
            <div className="h-full flex flex-col">
              <div className="py-6 px-4 flex justify-between items-center">
                <div>
                  <h2 className="heading-3">{selectedCategory.name} Actions</h2>
                </div>
                <div className="flex items-center gap-3">
                  {/* Show minimum required badge with appropriate styling based on selection */}
                  {mandatoryCategories.includes(selectedCategory.name) &&
                    minRequiredActionsPerCategory > 0 && (
                      <Badge
                        variant={
                          getSelectedCount(selectedCategory.id) <
                          minRequiredActionsPerCategory
                            ? "destructive"
                            : "outline"
                        }
                        className={
                          getSelectedCount(selectedCategory.id) <
                          minRequiredActionsPerCategory
                            ? "text-destructive bg-destructive/10"
                            : "text-foreground-weak"
                        }
                      >
                        min {minRequiredActionsPerCategory} required
                      </Badge>
                    )}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground-weak">
                      Select all
                    </span>
                    <Switch
                      data-slot="switch"
                      checked={areAllCategoryActionsSelected(selectedCategory)}
                      onCheckedChange={(checked) =>
                        toggleSelectAllCategoryActions(
                          selectedCategory,
                          checked
                        )
                      }
                      disabled={
                        mandatoryCategories.includes(selectedCategory.name) &&
                        areAllCategoryActionsSelected(selectedCategory)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-auto">
                <div className="divide-y divide-neutral-lighter">
                  {selectedCategory.actions.map((action) => {
                    const isSelected = selectedActivitiesMap.has(action.id);
                    const selectedCount = getSelectedCount(selectedCategory.id);
                    // Check if this is a mandatory category
                    const isMandatoryCategory = mandatoryCategories.includes(selectedCategory.name);
                    
                    // Calculate how many actions we can safely deselect before hitting the minimum
                    const canDeselect = selectedCount - minRequiredActionsPerCategory;
                    
                    // This action is mandatory only if we're at exactly the minimum required actions
                    // OR we have too few selected actions
                    const isActionMandatory = 
                      isMandatoryCategory && 
                      isSelected && 
                      minRequiredActionsPerCategory > 0 && 
                      canDeselect <= 0;

                    const actionIsFavorite = isFavorite(
                      action.id,
                      selectedCategory.id
                    );

                    // For mandatory categories, we'll disable deselection:
                    // 1. Only if this particular action is already selected
                    // 2. AND if removing it would put us below the minimum requirement
                    const isActionDisabled = isActionMandatory;

                    return (
                      <div
                        key={action.id}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3",
                          isSelected ? "bg-primary-50" : "",
                          isActionDisabled
                            ? "cursor-not-allowed"
                            : "cursor-pointer hover:bg-neutral-50"
                        )}
                        onClick={() => {
                          if (!isActionDisabled) {
                            handleSelectActivity(
                              action.id,
                              action.name,
                              selectedCategory.id
                            );
                          }
                        }}
                      >
                        <div className="size-5">
                          {isSelected ? (
                            <SquareCheck className="text-primary-500 size-5" />
                          ) : (
                            <Square className="text-neutral-300 size-5" />
                          )}
                        </div>
                          <span className="text-base flex-1">
                          {action.name}
                          {isActionDisabled && (
                            <span className="text-xs text-primary-700 ml-1">
                              (Required to meet minimum)
                            </span>
                          )}
                        </span>

                        {/* Favorite button - Only enabled when action is selected */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={!isSelected}
                                onClick={(e) =>
                                  handleToggleFavorite(
                                    action.id,
                                    selectedCategory.id,
                                    e
                                  )
                                }
                                className={cn(
                                  "p-1 size-7",
                                  actionIsFavorite
                                    ? "text-primary hover:text-primary/80"
                                    : "text-foreground/25 hover:text-foreground/50",
                                  !isSelected && "opacity-30 cursor-not-allowed"
                                )}
                              >
                                <Heart
                                  className={cn(
                                    "size-4",
                                    actionIsFavorite &&
                                      isSelected &&
                                      "fill-current"
                                  )}
                                />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {!isSelected
                                ? "Select action first to favorite it"
                                : actionIsFavorite
                                ? "Remove from favorites"
                                : "Add to favorites"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 flex items-center justify-center h-full">
              <p className="text-foreground-weak">
                Select a category to view actions
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
});

export default ActionsSelector;