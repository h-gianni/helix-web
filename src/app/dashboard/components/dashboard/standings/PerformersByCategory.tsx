import React from "react";
import { Member, PerformanceCategory } from "@/store/member";
import { TeamPerformanceView } from "@/app/dashboard/components/TeamPerformanceView";
import type { TeamResponse } from "@/lib/types/api";
import { usePerformersStore } from "@/store/performers-store";

interface PerformersByCategoryProps {
  performers: Member[];
  teams: TeamResponse[];
  category: PerformanceCategory;
  viewType?: "table" | "grid";
}

export function PerformersByCategory({
  category,
  performers,
  teams,
  viewType,
}: PerformersByCategoryProps) {
  const { viewType: storeViewType, setViewType } = usePerformersStore();

  // Use passed viewType prop if provided, otherwise use from store
  const effectiveViewType = viewType || storeViewType;

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
    <div className="space-y-6">
      <div
        className={`border-t border-border pt-4 ${isEmpty ? "opacity-50" : ""}`}
      >
        <div className="flex flex-col md:flex-row items-center gap-2 mb-4">
          {category.label && (
            <category.Icon
              className={`size-4 text-foreground-weak ${category.className}`}
            />
          )}
          <div className="flex flex-col sm:flex-row items-baseline sm:gap-3">
            <span className="whitespace-nowrap font-semibold">
              {isEmpty ? `No ${category.label}` : category.label}
            </span>
            {category.description && (
              <span className="body-sm text-foreground-weak">
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
