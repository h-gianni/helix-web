"use client";

import React, { useState, useEffect } from "react";
import { 
  Loader, Heart, Building2, PencilRuler, Activity, 
  LayoutGrid, Star, Users 
} from "lucide-react";
import { Badge } from "@/components/ui/core/Badge";
import { NavList, NavListItem, NavListSection } from "@/components/ui/core/NavList";
import { cn } from "@/lib/utils";
import { 
  useTeamActivities, 
} from "@/store/performance-rating-store";
import { 
  useFavoritesStore, 
  useFavorites
} from '@/store/favorites-store';

// Activity type definition
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
  onNext?: () => void;
}

export default function ScoringStepActions({
  teamId,
  selectedActivityId,
  setSelectedActivityId,
  onNext,
}: ScoringStepActionsProps) {
  const { data: activities = [], isLoading: activitiesLoading } = useTeamActivities(teamId);
  const [activeGroup, setActiveGroup] = useState<string>("favorite");
  
  // Load favorites
  const { isLoading: isFavoritesLoading } = useFavorites();
  const favorites = useFavoritesStore((state) => state.favorites);
  
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

  // Effect to organize activities when they are loaded
  useEffect(() => {
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
  }, [activities, favorites, activitiesLoading, isFavoritesLoading]);

  // Handle activity selection with auto-navigation
  const handleActivitySelect = (activityId: string) => {
    // Set the selected activity ID
    setSelectedActivityId(activityId);
    
    // Trigger navigation to the next step if provided
    if (onNext) {
      onNext();
    }
  };

  // Categories with their icons for the group selector
  const groups = [
    { id: "favorite", name: "Favorites", icon: <Heart className="size-4" /> },
    { id: "global", name: "Global", icon: <Building2 className="size-4" /> },
    { id: "functions", name: "Functions", icon: <PencilRuler className="size-4" /> },
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

  // Render group selector tabs
  const renderGroupSelector = () => (
    <div className="flex overflow-hidden rounded-lg border border-border shadow-sm mb-6">
      {groups.map((group, index) => (
        <button
          key={group.id}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 transition-colors",
            activeGroup === group.id 
              ? "bg-primary-50 text-primary-600 font-medium" 
              : "bg-white text-foreground-weak hover:bg-neutral-50",
            index < groups.length - 1 ? "border-r border-border" : ""
          )}
          onClick={() => setActiveGroup(group.id)}
        >
          {group.icon}
          <span className="hidden sm:inline-block">{group.name}</span>
          {group.id === "favorite" && hasFavorites && (
            <span className="inline-flex items-center justify-center size-5 bg-accent/20 text-accent rounded-full text-xs font-medium">
              {organizedActivities.favorite["Saved Favorites"].length}
            </span>
          )}
        </button>
      ))}
    </div>
  );

  // Render favorites section
  const renderFavoriteSection = () => {
    const favoriteActivities = organizedActivities.favorite["Saved Favorites"];
    
    if (favoriteActivities.length === 0) {
      return (
        <div className="p-6 text-center">
          <Heart className="size-6 mx-auto mb-2 text-foreground-muted" />
          <p className="heading-4">No favorites saved</p>
          <p className="body-sm text-foreground-weak mt-1 mx-auto">
          You can mark the most popular actions as favorites. Go to settings and check on the favourite (heart) icon of the actions from the function categories list.
          </p>
        </div>
      );
    }
    
    return (
      <NavListSection title="Saved Favorites">
        <NavList>
          {favoriteActivities.map((activity) => (
            <NavListItem
              key={activity.id}
              onClick={() => handleActivitySelect(activity.id)}
              trailingContent={
                typeof activity.category === 'object' ? (
                  <Badge variant="outline" className="ml-2">
                    {activity.category.name}
                  </Badge>
                ) : null
              }
            >
              {activity.name}
            </NavListItem>
          ))}
        </NavList>
      </NavListSection>
    );
  };

  return (
    <div className="space-y-6">
      {/* Group Selection */}
      {renderGroupSelector()}

      {/* Categories and Activities */}
      {activeGroup === "favorite" ? (
        renderFavoriteSection()
      ) : (
        Object.entries(currentGroupActivities).length === 0 ? (
          <div className="p-6 text-center">
            <Building2 className="size-6 mx-auto mb-2 text-foreground-muted" />
            <p className="heading-4">No {activeGroup} actions available</p>
          </div>
        ) : (
          Object.entries(currentGroupActivities).map(
            ([category, categoryActivities]) => (
              <NavListSection key={category} title={category}>
                <NavList>
                  {categoryActivities.map((activity) => (
                    <NavListItem
                      key={activity.id}
                      onClick={() => handleActivitySelect(activity.id)}
                      trailingContent={
                        typeof activity.category === 'object' ? (
                          <Badge variant="outline" className="ml-2">
                            {activity.category.name}
                          </Badge>
                        ) : null
                      }
                    >
                      {activity.name}
                    </NavListItem>
                  ))}
                </NavList>
              </NavListSection>
            )
          )
        )
      )}
    </div>
  );
}