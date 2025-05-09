// src/app/dashboard/components/configuration/ConfigurationActionsSummary.tsx
import React, { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/core/Button";
import { Badge } from "@/components/ui/core/Badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/core/Accordion";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/core/Card";
import { PenSquare, Heart, Pen, PencilRuler } from "lucide-react";
import { useConfigStore } from "@/store/config-store";
import { useFavoritesStore, useFavorites } from "@/store/favorites-store";
import { useActions, MANDATORY_CATEGORIES } from "@/store/action-store";
import { useProfileStore, useUserActions, useUserActionCategories } from "@/store/user-store";
import { HeroBadge } from "@/components/ui/core/HeroBadge";
import { useTeamActivitiesStore } from "@/store/team-activities-store";

interface OrgActionsSummaryProps {
  onEdit?: () => void;
  variant?: "setup" | "settings";
}

function OrgActionsSummary({
  onEdit,
  variant = "settings",
}: OrgActionsSummaryProps) {
  const { data: userCategories, isLoading: isCategoriesLoading } = useUserActionCategories();
  const { data: userAllActions, isLoading: isActionsLoading } = useUserActions();
  const { actions, setActions } = useProfileStore();

  // Get the selected activities and categories from config store
  const selectedActivities = useConfigStore(
    (state) => state.config.activities.selected
  );
  const selectedByCategory = useConfigStore(
    (state) => state.config.activities.selectedByCategory
  );

  // Load favorites
  const { data: fetchedFavorites, isLoading: isFavoritesLoading } = useFavorites();
  const favorites = useFavoritesStore((state) => state.favorites);

  useEffect(() => {
    if (fetchedFavorites) {
      useFavoritesStore.setState({ favorites: fetchedFavorites });
    }
  }, [fetchedFavorites]);

  // Get favorites count for a category
  const getFavoritesCount = (categoryId: string): number => {
    return favorites[categoryId]?.length || 0;
  };

  // Check if an action is a favorite
  const isActionFavorite = (actionId: string, categoryId: string): boolean => {
    return favorites[categoryId]?.includes(actionId) || false;
  };

  // Get action name for display
  const getActionNameById = (actionId: string) => {
    if (!userCategories) return "Unknown Action";
    for (const category of userCategories) {
      for (const action of category.actions) {
        if (action.id === actionId) {
          return action.name;
        }
      }
    }
    return "Unknown Action";
  };

  // Get category name for display
  const getCategoryNameById = (categoryId: string) => {
    if (!userCategories) return "Loading...";
    const category = userCategories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  return (
    <>
      <Card data-slot="card">
        <CardHeader
          data-slot="card-header"
          className="flex flex-row items-start justify-between"
        >
          <CardTitle data-slot="card-title">
            <div className="flex-shrink-0 mb-3">
              <HeroBadge variant="primary" size="base" icon={PencilRuler} />
            </div>
            Team&apos;s actions
          </CardTitle>
          <Button data-slot="button" variant="ghost" icon onClick={onEdit}>
            <Pen />
          </Button>
        </CardHeader>
        <CardContent data-slot="card-content">
          {isCategoriesLoading || isFavoritesLoading ? (
            <div className="text-center py-4 text-foreground-muted">
              Loading activities...
            </div>
          ) : (!userCategories || userCategories.length === 0) && (!selectedActivities || selectedActivities.length === 0) ? (
            <div className="text-center py-6">
              <p className="text-foreground-muted">
                No activities have been selected yet.
              </p>
            </div>
          ) : (
            <Accordion type="multiple" className="space-y-1">
              {/* Show user's actions */}
              {userCategories?.map((category) => {
                const favoritesCount = getFavoritesCount(category.id);
                const categoryActions = category.actions.filter(action => action.orgActions.length > 0);

                if (categoryActions.length === 0) return null;

                return (
                  <AccordionItem
                    key={`user-${category.id}`}
                    value={`user-${category.id}`}
                    data-slot="accordion-item"
                  >
                    <AccordionTrigger
                      data-slot="accordion-trigger"
                    >
                      <div className="flex justify-between items-center gap-2 w-full pr-4">
                        <span className="font-medium">{category.name}</span>
                        <div className="flex items-center gap-2">
                          {favoritesCount > 0 && (
                            <Badge
                              data-slot="badge"
                              className="flex items-center gap-1 bg-primary-50 text-primary"
                            >
                              <Heart className="size-3 fill-primary" />
                              {favoritesCount}
                            </Badge>
                          )}
                          <Badge data-slot="badge" variant="info-light">
                            {categoryActions.length}
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent data-slot="accordion-content">
                      <ul className="space-y-1 pb-2">
                        {categoryActions.map((action) => {
                          const isFavorite = isActionFavorite(
                            action.id,
                            category.id
                          );

                          return (
                            <li
                              key={action.id}
                              className="text-sm flex items-center gap-2"
                            >
                              {action.name}
                              {isFavorite && (
                                <Heart className="size-3 text-primary fill-current" />
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}

              {/* Show default selected actions */}
              {selectedByCategory && Object.entries(selectedByCategory)
                .filter(([_, activities]) => activities.length > 0)
                .map(([categoryId, activities]) => {
                  const categoryName = getCategoryNameById(categoryId);
                  const favoritesCount = getFavoritesCount(categoryId);

                  return (
                    <AccordionItem
                      key={`default-${categoryId}`}
                      value={`default-${categoryId}`}
                      data-slot="accordion-item"
                    >
                      <AccordionTrigger data-slot="accordion-trigger">
                        <div className="flex justify-between items-center gap-2 w-full pr-4">
                          <span className="font-medium">{categoryName}</span>
                          <div className="flex items-center gap-2">
                            {favoritesCount > 0 && (
                              <Badge
                                data-slot="badge"
                                className="flex items-center gap-1 bg-primary-50 text-primary"
                              >
                                <Heart className="size-3 fill-primary" />
                                {favoritesCount}
                              </Badge>
                            )}
                            <Badge data-slot="badge" variant="info-light">
                              {activities.length}
                            </Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent data-slot="accordion-content">
                        <ul className="space-y-1 pb-2">
                          {activities.map((actionId) => {
                            const actionName = getActionNameById(actionId);
                            const isFavorite = isActionFavorite(
                              actionId,
                              categoryId
                            );

                            return (
                              <li
                                key={actionId}
                                className="text-sm flex items-center gap-2"
                              >
                                {actionName}
                                {isFavorite && (
                                  <Heart className="size-3 text-primary fill-current" />
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default OrgActionsSummary;
