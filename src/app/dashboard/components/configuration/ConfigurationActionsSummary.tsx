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
import { useProfileStore } from "@/store/user-store";

interface OrgActionsSummaryProps {
  onEdit?: () => void;
  variant?: "setup" | "settings";
}

function OrgActionsSummary({
  onEdit,
  variant = "settings",
}: OrgActionsSummaryProps) {
  const { data: actionCategories, isLoading } = useActions();

  // Load favorites
  const { data: fetchedFavorites, isLoading: isFavoritesLoading } =
    useFavorites();
  const favorites = useFavoritesStore((state) => state.favorites);

  // Get the selected activities and categories from config store
  const selectedActivities = useConfigStore(
    (state) => state.config.activities.selected
  );
  const selectedByCategory = useConfigStore(
    (state) => state.config.activities.selectedByCategory
  );
  const organizationName = useConfigStore(
    (state) => state.config.organization.name
  );

  useEffect(() => {
    if (fetchedFavorites) {
      useFavoritesStore.setState({ favorites: fetchedFavorites });
    }
  }, [fetchedFavorites]);

  // Get action names for display
  const getActionNameById = (actionId: string) => {
    if (!actionCategories) return "Unknown Action";
    for (const category of actionCategories) {
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
    if (!actionCategories) return "Loading...";
    const category = actionCategories.find((cat) => cat.id === categoryId);

    return category ? category.name : "Unknown Category";
  };

  // Get favorites count for a category
  const getFavoritesCount = (categoryId: string): number => {
    console.log(favorites, "favorites");
    return favorites[categoryId]?.length || 0;
  };

  // Check if an action is a favorite
  const isActionFavorite = (actionId: string, categoryId: string): boolean => {
    return favorites[categoryId]?.includes(actionId) || false;
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
              <div className="flex size-10 items-center justify-center rounded-lg bg-neutral-lightest">
                <PencilRuler className="size-5 text-primary" />
              </div>
            </div>
            Team's actions
          </CardTitle>
          <Button data-slot="button" variant="ghost" onClick={onEdit}>
            <Pen />
          </Button>
        </CardHeader>
        <CardContent data-slot="card-content">
          {isLoading || isFavoritesLoading ? (
            <div className="text-center py-4 text-foreground-muted">
              Loading activities...
            </div>
          ) : !selectedActivities || selectedActivities.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-foreground-muted">
                No activities have been selected yet.
              </p>
            </div>
          ) : (
            <Accordion type="multiple" className="space-y-1">
              {Object.entries(selectedByCategory || {})
                .filter(([_, activities]) => activities.length > 0)
                .map(([categoryId, activities]) => {
                  const categoryName = getCategoryNameById(categoryId);
                  const favoritesCount = getFavoritesCount(categoryId);

                  return (
                    <AccordionItem
                      key={categoryId}
                      value={categoryId}
                      data-slot="accordion-item"
                      className="border-b px-0"
                    >
                      <AccordionTrigger
                        data-slot="accordion-trigger"
                        className="py-2"
                      >
                        <div className="flex justify-between items-center gap-2 w-full pr-4">
                          <span className="font-medium">{categoryName}</span>
                          <div className="flex items-center gap-2">
                            {favoritesCount > 0 && (
                              <Badge
                                data-slot="badge"
                                className="flex items-center gap-1 bg-primary-lightest text-primary"
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
                        <ul className="space-y-2 pb-2">
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
                                  <Heart className="size-3 text-accent fill-current" />
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
