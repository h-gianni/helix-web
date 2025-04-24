// src/app/dashboard/components/scoring/ScoringStepActions.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/core/Label";
import { Badge } from "@/components/ui/core/Badge";
import {
  RadioGroupCards,
  RadioGroupCardsContainer,
  RadioGroupCard,
} from "@/components/ui/core/RadioGroupCards";
import { useTeamActivities } from "@/store/performance-rating-store";
import { useFavoritesStore, useFavorites, useToggleFavorite } from '@/store/favorites-store';
import { Loader, Heart, Building2, PencilRuler, Activity } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/core/Tooltip";
import { Button } from "@/components/ui/core/Button";
import { cn } from "@/lib/utils";

// Add type for activities
interface Activity {
  id: string;
  name: string;
  description?: string | null;
  category?: {
    id: string;
    name: string;
  } | string;
}

interface ScoringStepActionsProps {
  teamId: string;
  selectedActivityId: string | undefined;
  setSelectedActivityId: (activityId: string) => void;
}

export default function ScoringStepActions({
  teamId,
  selectedActivityId,
  setSelectedActivityId,
}: ScoringStepActionsProps) {
  const { data: activities = [], isLoading: activitiesLoading } =
    useTeamActivities(teamId);
  const [activeGroup, setActiveGroup] = useState<string>("favorite");
  
  // Load favorites
  const { isLoading: isFavoritesLoading } = useFavorites();
  const favorites = useFavoritesStore((state) => state.favorites);
  const toggleFavorite = useToggleFavorite();
  const isFavorite = useFavoritesStore((state) => state.isFavorite);

  // State to store organized activities
  const [organizedActivities, setOrganizedActivities] = useState<Record<string, Record<string, Activity[]>>>({
    favorite: { "Saved Favorites": [] },
    global: {},
    functions: {}
  });

  // Helper function to extract base actionId from composed ID
  const extractBaseActionId = (composedId: string): string => {
    // If the ID follows the org-actionId-teamId-timestamp pattern
    if (typeof composedId === 'string' && composedId.startsWith('org-')) {
      const parts = composedId.split('-');
      if (parts.length >= 3) {
        // Return the second part which should be the actionId
        return parts[1];
      }
    }
    // If not a composed ID or doesn't follow expected pattern, return as is
    return composedId;
  };

  // Modified isFavorite check that's aware of ID formats
  const isActivityFavorite = (activityId: string, categoryId: string): boolean => {
    const baseActivityId = extractBaseActionId(activityId);
    return (favorites[categoryId] || []).some(favId => 
      favId === activityId || favId === baseActivityId || extractBaseActionId(favId) === baseActivityId
    );
  };

  // Debug function to log favorite state
  const logFavoritesState = () => {
    console.log("Current favorites state:", favorites);
    console.log("Activities count:", activities.length);
    console.log("Favorites count:", Object.values(favorites).flat().length);
    console.log("Saved favorites in UI:", organizedActivities.favorite["Saved Favorites"].length);
    
    // Log individual category counts
    Object.entries(favorites).forEach(([categoryId, activityIds]) => {
      console.log(`Category ${categoryId}: ${activityIds.length} favorites`);
    });
  };

  // Effect to organize activities when they are loaded
  useEffect(() => {
    console.log("Organizing activities...", { activities, favorites });
      
    if (activitiesLoading || isFavoritesLoading) return;
      
    // Map to track activities that have been added to favorites
    const addedToFavorites = new Set<string>();
      
    // Create an organized structure of activities
    const organized: Record<string, Record<string, Activity[]>> = {
      favorite: { "Saved Favorites": [] },
      global: {},
      functions: {}
    };
      
    // Process favorites first by iterating over all categories in favorites
    Object.entries(favorites).forEach(([categoryId, activityIds]) => {
      // For each favorited activity ID in this category
      activityIds.forEach(favoriteId => {
        // Find the matching activity in all activities
        // We need to check if any activity's ID or the extracted baseId matches our favoriteId
        const activity = activities.find(act => {
          const baseActivityId = extractBaseActionId(act.id);
          const baseFavoriteId = extractBaseActionId(favoriteId);
          return act.id === favoriteId || 
                 baseActivityId === favoriteId || 
                 baseActivityId === baseFavoriteId ||
                 act.id === baseFavoriteId;
        });
        
        if (activity) {
          // Add to Saved Favorites section
          organized.favorite["Saved Favorites"].push(activity);
          // Mark as added to favorites to avoid duplication
          addedToFavorites.add(activity.id);
        }
      });
    });
      
    // Then organize the rest of the activities
    activities.forEach(activity => {
      // Skip if already in favorites
      if (addedToFavorites.has(activity.id)) return;
        
      // Get category name, handling different structure possibilities
      const categoryName = typeof activity.category === 'object' 
        ? activity.category?.name 
        : typeof activity.category === 'string' ? activity.category : 'Other';
        
      // Determine if it's a global or function-specific action
      const isGlobal = categoryName.includes('Values') || 
                     categoryName.includes('Culture') || 
                     categoryName.includes('Teamwork');
        
      const groupKey = isGlobal ? 'global' : 'functions';
        
      // Initialize the category array if it doesn't exist
      if (!organized[groupKey][categoryName]) {
        organized[groupKey][categoryName] = [];
      }
        
      // Add activity to its category
      organized[groupKey][categoryName].push(activity);
    });
      
    setOrganizedActivities(organized);
    
    // Log the favorites status for debugging
    console.log("Organized activities:", organized);
    console.log("Saved favorites count:", organized.favorite["Saved Favorites"].length);
  }, [activities, favorites, activitiesLoading, isFavoritesLoading]);

  // Use this in a useEffect to track changes
  useEffect(() => {
    if (!activitiesLoading && !isFavoritesLoading) {
      logFavoritesState();
    }
  }, [favorites, activities, activitiesLoading, isFavoritesLoading]);

  // Handle activity selection with scroll position preservation
  const handleActivitySelect = (activityId: string) => {
    // Set the selected activity ID
    setSelectedActivityId(activityId);
  };

  // Handle toggle favorite that's aware of ID formats
  const handleToggleFavorite = async (
    activityId: string, 
    categoryId: string, 
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Prevent selection
  
    // Extract the base ID for consistency
    const baseActivityId = extractBaseActionId(activityId);
    
    // Check if it's currently a favorite using our ID-aware check
    const currentStatus = isActivityFavorite(activityId, categoryId);
    
    try {
      // Use the base ID for toggling favorite status
      await toggleFavorite.mutateAsync({
        actionId: baseActivityId,
        categoryId,
        isFavorite: !currentStatus,
      });
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  // Categories with their icons
  const groups = [
    { id: "favorite", name: "Favorites", icon: <Heart className="size-4" /> },
    { id: "global", name: "Global", icon: <Building2 className="size-4" /> },
    {
      id: "functions",
      name: "Functions",
      icon: <PencilRuler className="size-4" />,
    },
  ];

  // Display loading state
  if (activitiesLoading || isFavoritesLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  const currentGroupActivities = organizedActivities[activeGroup];
  const hasFavorites = organizedActivities.favorite["Saved Favorites"].length > 0;

  // Render favorites section
  const renderFavoriteSection = () => {
    const favoriteActivities = organizedActivities.favorite["Saved Favorites"];
    
    if (favoriteActivities.length === 0) {
      return (
        <div className="p-6 text-center border rounded-lg bg-muted">
          <Heart className="size-8 mx-auto mb-2 text-foreground-muted" />
          <p className="text-foreground font-medium">No favorites saved</p>
          <p className="text-sm text-foreground-muted mt-1">
            You can mark actions as favorites in the other tabs or in the Settings/Org actions section
          </p>
        </div>
      );
    }
    
    return (
      <div className="space-y-2.5">
        <Label className="!text-foreground-weak">Saved Favorites</Label>
        <RadioGroupCards
          value={selectedActivityId ?? ""}
          onValueChange={handleActivitySelect}
        >
          <RadioGroupCardsContainer className="flex flex-col">
            {favoriteActivities.map((activity) => (
              <RadioGroupCard
                key={activity.id}
                id={`activity-${activity.id}`}
                value={activity.id}
                title={activity.name}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{activity.name}</span>
                  {typeof activity.category === 'object' && (
                    <Badge variant="outline" className="ml-2">
                      {activity.category.name}
                    </Badge>
                  )}
                </div>
              </RadioGroupCard>
            ))}
          </RadioGroupCardsContainer>
        </RadioGroupCards>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Group Selection */}
      <div className="space-y-2">
        <RadioGroupCards
          value={activeGroup}
          onValueChange={setActiveGroup}
          orientation="horizontal"
          className="shadow-sm"
        >
          <RadioGroupCardsContainer
            className="grid grid-cols-3 overflow-hidden rounded-lg"
            layout="compact"
          >
            {groups.map((group, index) => (
              <RadioGroupCard
                key={group.id}
                id={`group-${group.id}`}
                value={group.id}
                title={group.name}
                layout="compact"
                radioSymbol={false}
                containerClassName={index < groups.length - 1 ? "border-r" : ""}
              >
                <div className="flex items-center justify-center gap-2">
                  {group.icon}
                  <span className="hidden sm:inline">{group.name}</span>
                  {group.id === "favorite" && hasFavorites && (
                    <span className="inline-flex items-center justify-center size-5 bg-accent/20 text-accent rounded-full text-xs font-medium">
                      {organizedActivities.favorite["Saved Favorites"].length}
                    </span>
                  )}
                </div>
              </RadioGroupCard>
            ))}
          </RadioGroupCardsContainer>
        </RadioGroupCards>
      </div>

      {/* Categories and Activities Selection */}
      <div className="space-y-6">
        {activeGroup === "favorite" ? (
          renderFavoriteSection()
        ) : (
          Object.entries(currentGroupActivities).length === 0 ? (
            <div className="p-6 text-center border rounded-lg bg-muted">
              <Activity className="size-8 mx-auto mb-2 text-foreground" />
              <p className="text-foreground">No activities available</p>
            </div>
          ) : (
            Object.entries(currentGroupActivities).map(
              ([category, categoryActivities]) => (
                <div key={category} className="space-y-2.5">
                  <Label className="!text-foreground-weak">{category}</Label>
                  <RadioGroupCards
                    value={selectedActivityId ?? ""}
                    onValueChange={handleActivitySelect}
                  >
                    <RadioGroupCardsContainer
                      className="flex flex-col shadow-sm overflow-hidden rounded-lg"
                      layout="compact"
                    >
                      {categoryActivities.map((activity) => {
                        const categoryId = typeof activity.category === 'object' 
                          ? activity.category?.id 
                          : '';
                        const actionIsFavorite = categoryId 
                          ? isActivityFavorite(activity.id, categoryId)
                          : false;
                          
                        return (
                          <RadioGroupCard
                            key={activity.id}
                            id={`activity-${activity.id}`}
                            value={activity.id}
                            title={activity.name}
                            layout="compact"
                          >
                            <div className="flex items-center justify-between w-full">
                              <span>{activity.name}</span>
                              {categoryId && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) =>
                                          handleToggleFavorite(activity.id, categoryId, e)
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
                              )}
                            </div>
                          </RadioGroupCard>
                        );
                      })}
                    </RadioGroupCardsContainer>
                  </RadioGroupCards>
                </div>
              )
            )
          )
        )}
      </div>
    </div>
  );
}