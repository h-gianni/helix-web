import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/core/Dialog";
import { Button } from "@/components/ui/core/Button";
import { Badge } from "@/components/ui/core/Badge";
import { Heart, GripHorizontal, Eye, EyeOff } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/core/Tooltip";
import { cn } from "@/lib/utils";
import { activityData } from "@/data/org-actions-data";
import { useConfigStore } from "@/store/config-store";

interface ActivityState {
  favorite: boolean;
  hidden: boolean;
}

interface Team {
  id: string;
  name: string;
  functions: string[];
}

export interface TeamActionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
}

function TeamActionsDialog({ isOpen, onClose, team }: TeamActionsDialogProps) {
  const selectedActivities = useConfigStore(
    (state) => state.config.activities.selected
  );
  const favorites = useConfigStore((state) => state.config.activities.favorites);
  const hidden = useConfigStore((state) => state.config.activities.hidden);
  const updateFavorites = useConfigStore((state) => state.updateFavorites);
  const updateHidden = useConfigStore((state) => state.updateHidden);

  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [activities, setActivities] = useState<Record<string, string[]>>({});
  const [activityStates, setActivityStates] =
    useState<Record<string, ActivityState>>({});

  useEffect(() => {
    const teamActivities = team.functions.reduce(
      (acc: Record<string, string[]>, func) => {
        if (activityData[func]) {
          acc[func] = activityData[func].filter((act) =>
            selectedActivities.includes(act)
          );
        }
        return acc;
      },
      {}
    );
    setActivities(teamActivities);

    const states: Record<string, ActivityState> = {};
    Object.entries(teamActivities).forEach(([category, acts]) => {
      acts.forEach((act) => {
        states[act] = {
          favorite: favorites?.[category]?.includes(act) || false,
          hidden: hidden?.[category]?.includes(act) || false,
        };
      });
    });
    setActivityStates(states);
  }, [team, selectedActivities, favorites, hidden]);

  const toggleFavorite = (act: string, category: string): void => {
    const categoryActivities = activities[category] || [];
    const favoritesInCategory = categoryActivities.filter(
      (a) => activityStates[a]?.favorite
    ).length;

    // Don’t allow more than 5 favorites
    if (favoritesInCategory >= 5 && !activityStates[act]?.favorite) {
      return;
    }

    const newState = !activityStates[act]?.favorite;
    setActivityStates((prev) => ({
      ...prev,
      [act]: {
        ...prev[act],
        favorite: newState,
        hidden: false,
      },
    }));

    const currentFavorites = favorites?.[category] || [];
    const updatedFavorites = newState
      ? [...currentFavorites, act]
      : currentFavorites.filter((a) => a !== act);
    updateFavorites(category, updatedFavorites);

    if (hidden?.[category]?.includes(act)) {
      const updatedHidden = (hidden[category] || []).filter((a) => a !== act);
      updateHidden(category, updatedHidden);
    }
  };

  const toggleVisibility = (act: string, category: string): void => {
    const categoryActivities = activities[category] || [];
    const visibleInCategory = categoryActivities.filter(
      (a) => !activityStates[a]?.hidden
    ).length;

    // Must keep at least 1 visible
    if (visibleInCategory <= 1 && !activityStates[act]?.hidden) {
      return;
    }

    const newState = !activityStates[act]?.hidden;
    setActivityStates((prev) => ({
      ...prev,
      [act]: {
        ...prev[act],
        hidden: newState,
        favorite: false,
      },
    }));

    const currentHidden = hidden?.[category] || [];
    const updatedHidden = newState
      ? [...currentHidden, act]
      : currentHidden.filter((a) => a !== act);
    updateHidden(category, updatedHidden);

    if (favorites?.[category]?.includes(act)) {
      const updatedFavorites = (favorites[category] || []).filter(
        (a) => a !== act
      );
      updateFavorites(category, updatedFavorites);
    }
  };

  interface DragData {
    category: string;
    activity: string;
    index: number;
  }

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    category: string,
    activity: string,
    index: number
  ): void => {
    setDraggedItem(activity);
    const dragData: DragData = { category, activity, index };
    e.dataTransfer.setData("text/plain", JSON.stringify(dragData));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetCategory: string,
    targetIndex: number
  ): void => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text/plain")) as DragData;

    if (data.category === targetCategory) {
      const newActivities = { ...activities };
      const categoryActivities = [...newActivities[targetCategory]];
      const [movedItem] = categoryActivities.splice(data.index, 1);
      categoryActivities.splice(targetIndex, 0, movedItem);
      newActivities[targetCategory] = categoryActivities;
      setActivities(newActivities);
    }

    setDraggedItem(null);
  };

  const getCategoryActivities = (
    categoryKey: string,
    categoryActs: string[]
  ): string[] => {
    return [...categoryActs].sort((a, b) => {
      const stateA = activityStates[a];
      const stateB = activityStates[b];
      if (stateA?.favorite && !stateB?.favorite) return -1;
      if (!stateA?.favorite && stateB?.favorite) return 1;
      if (stateA?.hidden && !stateB?.hidden) return 1;
      if (!stateA?.hidden && stateB?.hidden) return -1;
      return 0;
    });
  };

  return (
    <Dialog
      data-slot="dialog"
      open={isOpen}
      onOpenChange={onClose}
    >
      {/* 
        No more DialogBody, just place the content 
        directly in DialogContent and apply overflow. 
      */}
      <DialogContent
        data-slot="dialog-content"
        className="max-w-4xl h-[90vh] overflow-y-auto"
      >
        <DialogHeader data-slot="dialog-header" className="p-6 border-b">
          <DialogTitle data-slot="dialog-title">
            <div className="flex flex-col gap-2">
              <h2 className="heading-2">{team.name}&apos;s Actions</h2>
              <div className="flex gap-2">
                {team.functions.map((func) => (
                  <Badge data-slot="badge" key={func} variant="secondary">
                    {func}
                  </Badge>
                ))}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Replace <DialogBody> with a simple <div> or <section> */}
        <div className="p-4 space-y-6">
          {Object.entries(activities).map(([category, categoryActivities]) =>
            categoryActivities.length > 0 ? (
              <div key={category} className="space-y-2">
                <h3 className="heading-4 capitalize">{category}</h3>
                <div className="w-full -space-y-px">
                  {getCategoryActivities(category, categoryActivities).map(
                    (activity, index) => (
                      <div
                        key={activity}
                        draggable
                        onDragStart={(e) =>
                          handleDragStart(e, category, activity, index)
                        }
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, category, index)}
                        className={cn(
                          "flex items-center justify-between bg-white border px-4 py-3 border-border",
                          draggedItem === activity && "shadow-lg"
                        )}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <GripHorizontal className="size-4 cursor-grab text-foreground/25" />
                          <span className="text-base">{activity}</span>
                        </div>
                        <div className="flex gap-1">
                          {/* Favorite toggle */}
                          <TooltipProvider data-slot="tooltip-provider">
                            <Tooltip data-slot="tooltip">
                              <TooltipTrigger data-slot="tooltip-trigger" asChild>
                                <div>
                                  <Button
                                    data-slot="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleFavorite(activity, category)}
                                    disabled={activityStates[activity]?.hidden}
                                    className={cn(
                                      activityStates[activity]?.favorite && "text-accent"
                                    )}
                                  >
                                    <Heart
                                      className={cn(
                                        "size-4",
                                        activityStates[activity]?.favorite && "fill-current"
                                      )}
                                    />
                                  </Button>
                                </div>
                              </TooltipTrigger>
                              {activityStates[activity]?.hidden ? (
                                <TooltipContent data-slot="tooltip-content">
                                  Cannot favorite a hidden action
                                </TooltipContent>
                              ) : getCategoryActivities(category, activities[category])
                                  .filter((a) => activityStates[a]?.favorite).length >= 5 &&
                                !activityStates[activity]?.favorite ? (
                                <TooltipContent data-slot="tooltip-content">
                                  Maximum 5 favorites per category
                                </TooltipContent>
                              ) : null}
                            </Tooltip>
                          </TooltipProvider>

                          {/* Visibility toggle */}
                          <TooltipProvider data-slot="tooltip-provider">
                            <Tooltip data-slot="tooltip">
                              <TooltipTrigger data-slot="tooltip-trigger" asChild>
                                <div>
                                  <Button
                                    data-slot="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleVisibility(activity, category)}
                                    disabled={activityStates[activity]?.favorite}
                                  >
                                    {activityStates[activity]?.hidden ? (
                                      <EyeOff className="size-4" />
                                    ) : (
                                      <Eye className="size-4" />
                                    )}
                                  </Button>
                                </div>
                              </TooltipTrigger>
                              {activityStates[activity]?.favorite ? (
                                <TooltipContent data-slot="tooltip-content">
                                  Cannot hide a favorite action
                                </TooltipContent>
                              ) : activities[category].filter(
                                  (a) => !activityStates[a]?.hidden
                                ).length <= 1 &&
                                !activityStates[activity]?.hidden ? (
                                <TooltipContent data-slot="tooltip-content">
                                  Must keep at least 1 visible action
                                </TooltipContent>
                              ) : null}
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            ) : null
          )}
        </div>

        <DialogFooter data-slot="dialog-footer" className="p-6 border-t">
          <Button data-slot="button" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TeamActionsDialog;
