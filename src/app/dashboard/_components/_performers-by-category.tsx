"use client";

import React from "react";
import { Member, PerformanceCategory } from "@/store/member";
import { TeamPerformanceView } from "./_team-performance-view";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/core/Card";
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
    .filter((performer) => {
      if (category.label === "Not Scored") {
        return performer.ratingsCount === 0;
      }
      return (
        performer.ratingsCount > 0 &&
        performer.averageRating >= category.minRating &&
        performer.averageRating <= category.maxRating
      );
    })
    .sort((a, b) => {
      if (category.label === "Not Scored") {
        return a.name.localeCompare(b.name);
      }
      return b.averageRating - a.averageRating;
    });

  // Handle view type changes from the TeamPerformanceView
  const handleViewChange = (newViewType: "table" | "grid") => {
    setViewType(newViewType);
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div
        className={`bg-secondary size-8 rounded-full flex items-center justify-center mx-auto ${
          category.label === "Not Scored" ? "" : category.className
        }`}
      >
        {category.label !== "Not Scored" && <category.Icon className="size-4" />}
      </div>
      <div className="text-center space-y-0.5">
        <h3 className="heading-3">{`No ${category.label}`}</h3>
        <p className="body-sm text-foreground-weak max-w-md">
          {category.label === "Not Scored"
            ? "All team members have received at least one score."
            : category.label.includes("Poor") || category.label.includes("Weak")
            ? "Great news! You don't have any team member performing below expectations."
            : `No team member currently is a ${category.label.toLowerCase()} contributor.`}
        </p>
      </div>
    </div>
  );

  if (categoryPerformers.length === 0) {
    return (
      <Card data-slot="card">
        <CardContent data-slot="card-content">
          <EmptyState />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-slot="card">
      <CardHeader data-slot="card-header">
        <CardTitle
          data-slot="card-title"
          className="flex flex-col md:flex-row items-center gap-2"
        >
          {category.label !== "Not Scored" && (
            <category.Icon className={`size-5 ${category.className}`} />
          )}
          <div className="flex flex-col sm:flex-row items-baseline sm:gap-3">
            <span className="whitespace-nowrap">{category.label}</span>
            {category.description && (
              <span className="body-sm text-foreground-weak">
                {category.description}
              </span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent data-slot="card-content">
        <TeamPerformanceView
          members={categoryPerformers}
          teams={teams}
          showAvatar={true}
          mode="desktop"
          viewType={effectiveViewType}
          onViewChange={handleViewChange}
        />
      </CardContent>
    </Card>
  );
}