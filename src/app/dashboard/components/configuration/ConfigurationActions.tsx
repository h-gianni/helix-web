// src/app/dashboard/components/configuration/ConfigurationActions.tsx
import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/core/Switch";
import { Square, SquareCheckBig, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/core/Badge";
import { Button } from "@/components/ui/core/Button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/core/Accordion";
import { useConfigStore } from "@/store/config-store";
import {
  useFavoritesStore,
  useToggleFavorite,
  useFavorites,
} from "@/store/favorites-store";
import {
  useActionModalStore,
  useActions,
  useActionsByCategory,
  useActionStore,
  MANDATORY_CATEGORIES,
} from "@/store/action-store";
import { Action, ActionCategory } from "@/lib/types/api/action";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/core/Tooltip";
import { set } from "date-fns";

interface ActionsConfigProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  setSelectedActions: (category: string,actions: string[]) => void;
  preselectCategory?: string;
}

function ActionsConfig({
  selectedCategory,
  setSelectedCategory,
  preselectCategory,
  setSelectedActions
}: ActionsConfigProps) {
  const MIN_REQUIRED_ACTIONS_PER_CATEGORY = 3;

  const selectedActivities = useConfigStore(
    (state) => state.config.activities.selected
  );
  const selectedByCategory = useConfigStore(
    (state) => state.config.activities.selectedByCategory
  );
  const updateActivities = useConfigStore((state) => state.updateActivities);
  const updateActivitiesByCategory = useConfigStore(
    (state) => state.updateActivitiesByCategory
  );

  // Load favorites
  const { isLoading: isFavoritesLoading } = useFavorites();
  const toggleFavorite = useToggleFavorite();
  const isFavorite = useFavoritesStore((state) => state.isFavorite);

  const { data: actionCategories, isLoading } = useActions();
  const [generalCategories, setGeneralCategories] = useState<ActionCategory[]>(
    []
  );
  const [coreCategories, setCoreCategories] = useState<ActionCategory[]>([]);
  const [hasPreselected, setHasPreselected] = useState(false);

  // Define the general responsibilities categories by name
  const generalCategoryNames = MANDATORY_CATEGORIES;

  useEffect(() => {
    if (actionCategories && actionCategories.length > 0) {
      // Group categories by name with exact matching
      const generalItems = actionCategories.filter((category) =>
        generalCategoryNames.includes(category.name)
      );
      setGeneralCategories(generalItems);

      const coreItems = actionCategories.filter(
        (category) => !generalCategoryNames.includes(category.name)
      );
      setCoreCategories(coreItems);
    }
  }, [actionCategories]);

  

  const handleSelectActivity = (activityId: string, categoryId: string) => {
    // Check if this action is in a mandatory category
    const isMandatoryCategory = MANDATORY_CATEGORIES.includes(
      actionCategories?.find((cat) => cat.id === categoryId)?.name || ""
    );

    // If it's in a mandatory category, check if deselecting would violate the minimum
    if (
      isMandatoryCategory &&
      selectedActivities.includes(activityId) &&
      categoryId
    ) {
      const currentSelected =
        (selectedByCategory && selectedByCategory[categoryId]) || [];

      // If deselecting would result in fewer than minimum required actions, prevent it
      if (currentSelected.length <= MIN_REQUIRED_ACTIONS_PER_CATEGORY) {
        console.log(
          `Must keep at least ${MIN_REQUIRED_ACTIONS_PER_CATEGORY} actions selected in this category`
        );
        return;
      }
    }

    // Proceed with selection/deselection
    const newActivities = selectedActivities.includes(activityId)
      ? selectedActivities.filter((a) => a !== activityId)
      : [...selectedActivities, activityId];
    updateActivities(newActivities);

    if (categoryId) {
      const currentCategoryActivities =
        selectedByCategory && selectedByCategory[categoryId]
          ? [...selectedByCategory[categoryId]]
          : [];

      const isActivitySelected = selectedActivities.includes(activityId);

      let updatedCategoryActivities;
      if (isActivitySelected) {
        updatedCategoryActivities = currentCategoryActivities.filter(
          (id) => id !== activityId
        );
      } else {
        updatedCategoryActivities = [...currentCategoryActivities, activityId];
      }

      updateActivitiesByCategory(categoryId, updatedCategoryActivities);
      setSelectedActions(categoryId,updatedCategoryActivities);
    }
  };

  // Handle favorites toggle
  const handleToggleFavorite = async (
    actionId: string,
    categoryId: string,
    e: React.MouseEvent
  ) => {
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
  };

  // Get selected count for a category
  const getSelectedCount = (categoryId: string): number => {
    return selectedByCategory && selectedByCategory[categoryId]
      ? selectedByCategory[categoryId].length
      : 0;
  };

  // Check if all actions in a category are selected
  const areAllCategoryActionsSelected = (category: ActionCategory): boolean => {
    return category.actions.every((action) =>
      selectedActivities.includes(action.id)
    );
  };

  // Toggle select all actions in a category
  const toggleSelectAllCategoryActions = (
    category: ActionCategory,
    checked: boolean
  ) => {
    const categoryActionIds = category.actions.map((action) => action.id);

    if (checked) {
      const newActivities = [
        ...new Set([...selectedActivities, ...categoryActionIds]),
      ];
      updateActivities(newActivities);
      updateActivitiesByCategory(category.id, categoryActionIds);
    } else {
      // Check if this is a mandatory category
      const isMandatory = MANDATORY_CATEGORIES.includes(category.name);

      if (isMandatory) {
        // For mandatory categories, keep the minimum required
        const actionsToKeep = categoryActionIds.slice(
          0,
          MIN_REQUIRED_ACTIONS_PER_CATEGORY
        );

        // Update activities excluding all but the kept ones
        const newActivities = selectedActivities.filter(
          (activityId) =>
            !categoryActionIds.includes(activityId) ||
            actionsToKeep.includes(activityId)
        );
        updateActivities(newActivities);

        updateActivitiesByCategory(category.id, actionsToKeep);
      } else {
        // For non-mandatory categories, proceed as normal
        const newActivities = selectedActivities.filter(
          (activityId) => !categoryActionIds.includes(activityId)
        );
        updateActivities(newActivities);
        updateActivitiesByCategory(category.id, []);
      }
    }
  };

  if (isLoading || isFavoritesLoading) {
    return <div>Loading actions...</div>;
  }

  const renderCategoryActions = (category: ActionCategory) => {
    const isMandatoryCategory = MANDATORY_CATEGORIES.includes(category.name);
    const selectedCount = getSelectedCount(category.id);

    return (
      <div className="space-y-1.5">
        {/* {isMandatoryCategory && (
          <div className="text-xs text-primary italic mb-2 px-4">
            At least {MIN_REQUIRED_ACTIONS_PER_CATEGORY} actions must be
            selected in this category. Currently {selectedCount}/
            {MIN_REQUIRED_ACTIONS_PER_CATEGORY} selected
          </div>
        )} */}

        <div className="flex items-center gap-2 pb-2">
          <Switch
            data-slot="switch"
            checked={areAllCategoryActionsSelected(category)}
            onCheckedChange={(checked) =>
              toggleSelectAllCategoryActions(category, checked)
            }
            disabled={
              isMandatoryCategory && areAllCategoryActionsSelected(category)
            }
          />
          <span className="text-sm text-foreground-weak">Select all</span>
        </div>
        <div className="w-full -space-y-px">
          {category.actions.map((action) => {
            const isSelected = selectedByCategory[category.id]?.includes(
              action.id
            );
            const isMandatoryAction =
              isMandatoryCategory &&
              isSelected &&
              selectedCount <= MIN_REQUIRED_ACTIONS_PER_CATEGORY;
            const actionIsFavorite = isFavorite(action.id, category.id);

            return (
              <div
                key={action.id}
                className={cn(
                  "flex items-center gap-4 bg-white border px-4 py-3 cursor-pointer hover:border-border-strong hover:bg-background",
                  isSelected
                    ? "bg-primary/10 text-foreground"
                    : "border-border",
                  isMandatoryAction && "cursor-not-allowed"
                )}
                onClick={() => {
                  if (!isMandatoryAction) {
                    handleSelectActivity(action.id, category.id);
                  }
                }}
              >
                <div className="size-4">
                  {isSelected ? (
                    <SquareCheckBig className="text-primary size-4" />
                  ) : (
                    <Square className="text-foreground/25 size-4" />
                  )}
                </div>
                <span className="text-base flex-1">{action.name}</span>

                {/* Favorite button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) =>
                          handleToggleFavorite(action.id, category.id, e)
                        }
                        className={cn(
                          "p-1 h-7 w-7",
                          actionIsFavorite
                            ? "text-accent hover:text-accent/80"
                            : "text-foreground/25 hover:text-foreground/50"
                        )}
                      >
                        <Heart
                          className={cn(
                            "size-4",
                            actionIsFavorite && "fill-current"
                          )}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {actionIsFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {isMandatoryAction && (
                  <span className="text-xs text-primary italic">
                    (Min. 3 Required)
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* <p className="text-base">
        Select all important activities in your organization for team
        performance scoring.
      </p> */}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Function actions */}
        <div className="lg:w-1/2 space-y-4">
          <div>
            <h4 className="heading-3">Functions actions</h4>
            <p className="body-sm">
              Select your function and the actions that you expect your team to
              perform. You can mix actions from different functions.
            </p>
          </div>
          <Accordion
            type="multiple"
            className="w-full bg-white shadow-sm rounded-md"
          >
            {coreCategories.map((category) => (
              <AccordionItem
                key={category.id}
                value={category.id}
                data-slot="accordion-item"
              >
                <AccordionTrigger
                  className="px-4 lg:h-12 cursor-pointer decoration-current"
                  data-slot="accordion-trigger"
                >
                  <div className="flex justify-between items-center w-full">
                    <span
                      className={cn(
                        "text-base font-semibold",
                        getSelectedCount(category.id) > 0
                          ? "text-primary-dark"
                          : "text-foreground",
                        // Add this line for the open state
                        "group-[&[data-state=open]]:text-foreground-strong"
                      )}
                    >
                      {category.name}
                    </span>
                    {getSelectedCount(category.id) > 0 && (
                      <Badge
                        data-slot="badge"
                        variant="default"
                        className="mr-2"
                      >
                        {getSelectedCount(category.id)}
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent
                  data-slot="accordion-content"
                  className="px-4"
                >
                  {/* {JSON.stringify(category)} */}
                  {renderCategoryActions(category)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        {/* Global actions */}
        <div className="lg:w-1/2 space-y-4 order-first lg:order-none">
          <div>
            <h4 className="heading-3">Global actions</h4>
            {/* {isMandatoryCategory && (
          <div className="text-xs text-primary italic mb-2 px-4">
            At least {MIN_REQUIRED_ACTIONS_PER_CATEGORY} actions must be
            selected in this category. Currently {selectedCount}/
            {MIN_REQUIRED_ACTIONS_PER_CATEGORY} selected
          </div>
        )} */}
            <p className="body-sm">
              Measure the performance of your team against what is valuable in
              your organisation, beyond your function.{" "}
              <span className="text-warning-darker">
                At least 3 actions per category must be selected.
              </span>
            </p>
          </div>
          <Accordion
            type="multiple"
            className="w-full bg-white shadow-sm rounded-md"
          >
            {generalCategories.map((category) => (
              <AccordionItem
                key={category.id}
                value={category.id}
                data-slot="accordion-item"
              >
                <AccordionTrigger
                  className="px-4 lg:h-12 cursor-pointer decoration-current"
                  data-slot="accordion-trigger"
                >
                  <div className="flex justify-between items-center w-full">
                    <span
                      className={cn(
                        "text-base font-semibold",
                        getSelectedCount(category.id) > 0
                          ? "text-primary-dark"
                          : "text-foreground",
                        // Add this line for the open state
                        "group-[&[data-state=open]]:text-foreground-strong"
                      )}
                    >
                      {category.name}
                    </span>
                    {getSelectedCount(category.id) > 0 && (
                      <Badge
                        data-slot="badge"
                        variant="default"
                        className="mr-2"
                      >
                        {getSelectedCount(category.id)}
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent
                  data-slot="accordion-content"
                  className="px-4"
                >
                  {renderCategoryActions(category)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}

export default ActionsConfig;
