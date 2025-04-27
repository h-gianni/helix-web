import React from "react";
import { Member, PerformanceCategory } from "@/store/member";
import { TeamPerformanceView } from "@/app/dashboard/components/TeamPerformanceView";
import type { TeamResponse } from "@/lib/types/api";
import { usePerformersStore } from "@/store/performers-store";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PerformersByCategoryProps {
  performers: Member[];
  teams: TeamResponse[];
  category: PerformanceCategory;
  viewType?: "table" | "grid";
}

// Map performance categories to their respective UI colors based on performance variant
const CATEGORY_COLOR_MAP = {
  "Star": "text-primary-500 fill-primary-500",
  "Strong": "text-secondary-500 fill-secondary-500",
  "Solid": "text-tertiary-500 fill-tertiary-500", 
  "Lower": "text-warning-500 fill-warning-500",
  "Poor": "text-destructive-500 fill-destructive-500",
  "Not Scored": "text-neutral-200 fill-neutral-200",
} as const;

export function PerformersByCategory({
  category,
  performers,
  teams,
  viewType: propsViewType,
}: PerformersByCategoryProps) {
  const { viewType: storeViewType, setViewType } = usePerformersStore();

  // Use passed viewType prop if provided, otherwise use the persisted state from store
  const effectiveViewType = propsViewType || storeViewType;

  // Get the appropriate color class for the category circle
  const circleColorClass = CATEGORY_COLOR_MAP[category.label as keyof typeof CATEGORY_COLOR_MAP] || "text-neutral-400 fill-neutral-400";

  const categoryPerformers = performers
    .filter((performer: Member) => {
      if (category.label === "Not Scored") {
        return performer.ratingsCount === 0;
      }
      return (
        performer.ratingsCount > 0 &&
        performer.averageRating >= category.minRating &&
        performer.averageRating <= category.maxRating
      );
    })
    .sort((a: Member, b: Member) => {
      if (category.label === "Not Scored") {
        return a.name.localeCompare(b.name);
      }
      return b.averageRating - a.averageRating;
    });

  // Handle view type changes from the TeamPerformanceView
  const handleViewChange = (newViewType: "table" | "grid") => {
    setViewType(newViewType);
  };

  const isEmpty = categoryPerformers.length === 0;

  return (
    <div className="">
      <div className={cn("py-2", isEmpty && "opacity-50")}>
        <div className="flex flex-col md:flex-row items-start gap-2 p-4 bg-transparent">
          {/* Circle with category color or neutral-100 if empty */}
          <Circle className={cn("size-4 mt-0.5", isEmpty ? "text-neutral-200 fill-neutral-200" : circleColorClass)} />
          
          <div className="flex flex-col items-baseline gap-0 -mt-1">
            <span className="whitespace-nowrap heading-2">
              {isEmpty ? `No ${category.label} performers` : `${category.label} performers`}
            </span>
            {category.description && (
              <span className="caption text-foreground-weak">
                {category.description}
              </span>
            )}
          </div>
        </div>

        {!isEmpty && (
          <TeamPerformanceView
            members={categoryPerformers}
            teams={teams}
            showAvatar={true}
            showTableHead={false}
            mode="desktop"
            viewType={effectiveViewType}
            onViewChange={handleViewChange}
          />
        )}
      </div>
    </div>
  );
}