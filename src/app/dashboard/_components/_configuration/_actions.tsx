import React from 'react';
import { Switch } from "@/components/ui/core/Switch";
import { Square, SquareCheckBig } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrganizationCategories } from "./_actions-categories";
import { activityData } from "@/data/org-actions-data";
import { useConfigStore } from '@/store/config-store';

interface ActionsConfigProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const ActionsConfig: React.FC<ActionsConfigProps> = ({
  selectedCategory,
  setSelectedCategory,
}) => {
  const selectedActivities = useConfigStore((state) => state.config.activities.selected);
  const updateActivities = useConfigStore((state) => state.updateActivities);

  const handleSelectActivity = (activity: string) => {
    const newActivities = selectedActivities.includes(activity)
      ? selectedActivities.filter(a => a !== activity)
      : [...selectedActivities, activity];
    updateActivities(newActivities);
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
            onSelect={setSelectedCategory}
            selectedActivities={selectedActivities}
          />
        </div>

        <div className="w-full space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="heading-5">Actions</h4>
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground-muted">Select all</span>
              <Switch
                checked={
                  activityData[selectedCategory]?.length > 0 &&
                  activityData[selectedCategory]?.every((activity) =>
                    selectedActivities.includes(activity)
                  )
                }
                onCheckedChange={(checked: boolean) => {
                  const activitiesForCategory = activityData[selectedCategory] || [];
                  if (checked) {
                    const newActivities = [
                      ...selectedActivities,
                      ...activitiesForCategory.filter(
                        (activity: string) => !selectedActivities.includes(activity)
                      ),
                    ];
                    updateActivities(newActivities);
                  } else {
                    const filteredActivities = selectedActivities.filter(
                      (activity: string) => !activitiesForCategory.includes(activity)
                    );
                    updateActivities(filteredActivities);
                  }
                }}
              />
            </div>
          </div>
          <div className="w-full -space-y-px">
            {activityData[selectedCategory]?.map((activity) => (
              <div
                key={activity}
                className={cn(
                  "flex items-center gap-4 bg-white text-foreground-weak border px-4 py-3 cursor-pointer hover:border-border-strong hover:bg-background",
                  selectedActivities.includes(activity)
                    ? "bg-primary/10 text-foreground"
                    : "border-border"
                )}
                onClick={() => handleSelectActivity(activity)}
              >
                <div className="size-4">
                  {selectedActivities.includes(activity) ? (
                    <SquareCheckBig className="text-primary w-4 h-4" />
                  ) : (
                    <Square className="text-foreground/25 w-4 h-4" />
                  )}
                </div>
                <span className="text-base">{activity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionsConfig;