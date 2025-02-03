"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  MemberPerformance,
  PerformanceCategory,
} from "@/app/dashboard/types/member";
import { TeamPerformanceView } from "./_teamPerformanceView";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Gem,
  Sparkles,
  Sparkle,
  Footprints,
  LifeBuoy,
  MinusCircle,
  LayoutGrid,
  Table as TableIcon,
} from "lucide-react";

interface Team {
  id: string;
  name: string;
}

interface PerformersByCategoryProps {
  category: PerformanceCategory;
  performers: MemberPerformance[];
  teams: Team[];
  isLoading?: boolean;
  viewType: "table" | "grid";
  onViewChange: (value: "table" | "grid") => void;
}

export const performanceCategories: PerformanceCategory[] = [
  {
    label: "Top Performers",
    minRating: 4.6,
    maxRating: 5,
    className: "text-success bg-success-weakest",
    Icon: Gem,
    description: "Outstanding performance across all activities",
  },
  {
    label: "Strong Performers",
    minRating: 4,
    maxRating: 4.5,
    className: "text-success bg-success-weakest",
    Icon: Sparkles,
    description: "Consistently exceeding expectations",
  },
  {
    label: "Solid Performers",
    minRating: 3,
    maxRating: 3.9,
    className: "text-info bg-info-weakest",
    Icon: Sparkle,
    description: "Meeting expectations consistently",
  },
  {
    label: "Weak Performers",
    minRating: 2.1,
    maxRating: 2.9,
    className: "text-warning bg-warning-weakest",
    Icon: Footprints,
    description: "Need support to improve performance",
  },
  {
    label: "Poor Performers",
    minRating: 1,
    maxRating: 2,
    className: "text-danger bg-danger-weakest",
    Icon: LifeBuoy,
    description: "Requires immediate attention and support",
  },
  {
    label: "Not Rated",
    minRating: 0,
    maxRating: 0,
    className: "text-neutral bg-neutral-weakest",
    Icon: MinusCircle,
    description: "Members awaiting their first performance rating",
  },
];

export const ViewSwitcher = ({ 
  viewType, 
  onViewChange 
}: { 
  viewType: 'table' | 'grid';
  onViewChange: (value: 'table' | 'grid') => void;
}) => {
  return (
    <div className="w-fit">
    <Select 
      value={viewType} 
      onValueChange={onViewChange}
      width="inline"
    >
      <SelectTrigger>
        <SelectValue placeholder="Select view" />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="table">Table View</SelectItem>
        <SelectItem value="grid">Card View</SelectItem>
      </SelectContent>
    </Select>
    </div>
  );
};

export function PerformersByCategory({
  category,
  performers,
  teams,
  isLoading,
  viewType,
  onViewChange,
}: PerformersByCategoryProps) {
  const router = useRouter();

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
    <div className="flex flex-col items-center justify-center py-sm">
      <div className={`p-sm rounded-full ${category.className} mb-sm`}>
        <category.Icon className="size-5" />
      </div>
      <div className="text-center">
        <h3 className="text-heading-5 text-text-strong">No {category.label}</h3>
        <p className="text-helper max-w-copy mx-auto">
          {category.label === "Not Rated"
            ? "All team members have received at least one rating."
            : category.label === "Poor Performers" ||
              category.label === "Weak Performers"
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
          <CardTitle className="flex items-center gap-sm">
            <category.Icon className={`size-5 ${category.className}`} />
            <span>{category.label}</span>
            {category.description && (
              <span className="text-helper">
               <span className="pr-xs text-muted"> / </span> {category.description}
              </span>
            )}
          </CardTitle>
      </CardHeader>
      <CardContent>
        <TeamPerformanceView
          members={categoryPerformers}
          teams={teams}
          showAvatar={true}
          mode="compact"
          viewType={viewType}
          onViewChange={onViewChange}
        />
      </CardContent>
    </Card>
  );
}
