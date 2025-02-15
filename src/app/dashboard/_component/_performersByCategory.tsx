"use client";

import React from "react";
import { Member, PerformanceCategory } from "@/store/member";
import { TeamPerformanceView } from "./_teamPerformanceView";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/core/Card";
import type { TeamResponse } from "@/lib/types/api";
import { usePerformersStore } from "@/store/performers-store";

interface PerformersByCategoryProps {
  performers: Member[];
  teams: TeamResponse[];
  category: PerformanceCategory;
}

export function PerformersByCategory({
  category,
  performers,
  teams,
}: PerformersByCategoryProps) {
  const { viewType } = usePerformersStore();

  const categoryPerformers = performers
    .filter((performer) => {
      if (category.label === "Not Rated") {
        return performer.ratingsCount === 0;
      }
      return (
        performer.ratingsCount > 0 &&
        performer.averageRating >= category.minRating &&
        performer.averageRating <= category.maxRating
      );
    })
    .sort((a, b) => {
      if (category.label === "Not Rated") {
        return a.name.localeCompare(b.name);
      }
      return b.averageRating - a.averageRating;
    });

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center pb-2">
      <div className={`p-2 rounded-full ${category.className}`}>
        <category.Icon className="h-6 w-6" />
      </div>
      <div className="text-center">
        <h3 className="heading-3">{`No ${category.label}`}</h3>
        <p className="text-sm text-foreground-weak max-w-md pt-1">
          {category.label === "Not Rated"
            ? "All team members have received at least one rating."
            : category.label.includes("Poor") || category.label.includes("Weak")
            ? "Great news! You don't have any team members performing below expectations."
            : `No team members currently fall into the ${category.label.toLowerCase()} category.`}
        </p>
      </div>
    </div>
  );

  if (categoryPerformers.length === 0) {
    return (
      <Card>
        <CardContent className="p-0">
          <EmptyState />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <category.Icon className={`h-5 w-5 ${category.className}`} />
          <span>{category.label}</span>
          {category.description && (
            <span className="body-sm text-foreground-weak">
              <span className="px-2 text-foreground-muted/50">/</span>
              {category.description}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <TeamPerformanceView
          members={categoryPerformers}
          teams={teams}
          showAvatar={true}
          mode="compact"
          viewType={viewType}
        />
      </CardContent>
    </Card>
  );
}