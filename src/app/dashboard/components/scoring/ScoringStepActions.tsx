// src/app/dashboard/components/scoring/ScoringStepActions.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/core/Label";
import {
  RadioGroupCards,
  RadioGroupCardsContainer,
  RadioGroupCard,
} from "@/components/ui/core/RadioGroupCards";
import { useTeamActivities } from "@/store/performance-rating-store";
import { useFavoritesStore, useFavorites } from '@/store/favorites-store';
import { Loader, Heart, Building2, PencilRuler, Activity } from "lucide-react";

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

  // State to store organized activities
  const [organizedActivities, setOrganizedActivities] = useState<Record<string, Record<string, Activity[]>>>({
    favorite: { "Saved Favorites": [] },
    global: {},
    functions: {}
  });

  // Effect to organize activities when they are loaded
  useEffect(() => {
console.log("Organizing activities...", favorites);
    
    if (activitiesLoading || isFavoritesLoading) return;
    
    // Map to track activities that have been added to favorites
    const addedToFavorites = new Set<string>();
    
    // Create an organized structure of activities
    const organized: Record<string, Record<string, Activity[]>> = {
      favorite: { "Saved Favorites": [] },
      global: {},
      functions: {}
    };
    
    // Process favorites first
    Object.entries(favorites).forEach(([categoryId, activityIds]) => {
      // Find matching activities
      activityIds.forEach(activityId => {
        const activity = activities.find(act => act.id === activityId);
        if (activity) {
          organized.favorite["Saved Favorites"].push(activity);
          addedToFavorites.add(activityId);
        }
      });
    });
    
    // Then organize the rest of the activities
    activities.forEach(activity => {
      if (addedToFavorites.has(activity.id)) return; // Skip if already in favorites
      
      const categoryName = typeof activity.category === 'object' 
        ? activity.category?.name 
        : typeof activity.category === 'string' ? activity.category : 'Other';
      
      // Determine if it's a global or function-specific action
      // This is a simplified approach; you might want to implement more sophisticated categorization
      const isGlobal = categoryName.includes('Values') || 
                     categoryName.includes('Culture') || 
                     categoryName.includes('Teamwork');
      
      const groupKey = isGlobal ? 'global' : 'functions';
      
      if (!organized[groupKey][categoryName]) {
        organized[groupKey][categoryName] = [];
      }
      
      organized[groupKey][categoryName].push(activity);
    });
    
    setOrganizedActivities(organized);
  }, [activities, favorites, activitiesLoading, isFavoritesLoading]);

  // Handle activity selection with scroll position preservation
  const handleActivitySelect = (activityId: string) => {
    // Set the selected activity ID
    setSelectedActivityId(activityId);
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
              </RadioGroupCard>))}
          </RadioGroupCardsContainer>
        </RadioGroupCards>
      </div>

      {/* Categories and Activities Selection */}
      <div className="space-y-6">
        {Object.entries(currentGroupActivities).length === 0 ? (
          <div className="p-6 text-center border rounded-lg bg-muted">
            <Activity className="size-8 mx-auto mb-2 text-foreground" />
            {activeGroup === "favorite" ? (
              <div>
                <p className="text-foreground font-medium">No favorites saved yet</p>
                <p className="text-sm text-foreground-muted mt-1">
                  You can mark actions as favorites in the Settings/Org actions section
                </p>
              </div>
            ) : (
              <p className="text-foreground">No activities available</p>
            )}
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
                  {activeGroup === "favorite" ? (
                    <RadioGroupCardsContainer className="flex flex-col">
                      {categoryActivities.map((activity) => (
                        <RadioGroupCard
                          key={activity.id}
                          id={`activity-${activity.id}`}
                          value={activity.id}
                          title={activity.name}
                        >
                          {activity.name}
                        </RadioGroupCard>
                      ))}
                    </RadioGroupCardsContainer>
                  ) : (
                    <RadioGroupCardsContainer
                      className="flex flex-col shadow-sm overflow-hidden rounded-lg"
                      layout="compact"
                    >
                      {categoryActivities.map((activity) => (
                        <RadioGroupCard
                          key={activity.id}
                          id={`activity-${activity.id}`}
                          value={activity.id}
                          title={activity.name}
                          layout="compact"
                        >
                          {activity.name}
                        </RadioGroupCard>
                      ))}
                    </RadioGroupCardsContainer>
                  )}
                </RadioGroupCards>
              </div>
            )
          )
        )}
      </div>
    </div>
  )}