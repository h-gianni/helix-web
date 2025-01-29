"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MemberPerformance, PerformanceCategory } from '@/app/dashboard/types/member';
import { TeamPerformanceView } from "./_teamPerformanceView";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
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
  viewType: 'table' | 'grid';
  onViewChange: (value: 'table' | 'grid') => void;
}

export const performanceCategories: PerformanceCategory[] = [
  {
    label: "Top Performers",
    minRating: 4.6,
    maxRating: 5,
    className: "text-success bg-success-weakest",
    Icon: Gem,
    description: "Outstanding performance across all initiatives",
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
    className: "text-text bg-neutral",
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
  const icons = {
    table: <TableIcon />,
    grid: <LayoutGrid />
  };

  return (
    <Select 
      size="sm"
      value={viewType} 
      onValueChange={onViewChange}
    >
      <SelectTrigger icon={icons[viewType]} className="w-40">
        <SelectValue placeholder="Select view" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem 
          value="table"
          withIcon={icons.table}
        >
          Table View
        </SelectItem>
        <SelectItem 
          value="grid"
          withIcon={icons.grid}
        >
          Card View
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export function PerformersByCategory({
  category,
  performers,
  teams,
  isLoading,
  viewType,
  onViewChange
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
    <div className="flex flex-col items-center justify-center py-base">
      <div className={`p-3 rounded-full ${category.className} mb-4`}>
        <category.Icon className="size-6" />
      </div>
      <div className="text-center space-y-xxs">
        <h3 className="text-heading-3 text-text-strong">No {category.label}</h3>
        <p className="text-body-small text-text-weakest max-w-copy mx-auto">
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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <category.Icon className={`size-5 ${category.className}`} />
            <span>{category.label}</span>
            {category.description && (
              <span className="text-body-small text-text-weakest">
                - {category.description}
              </span>
            )}
          </CardTitle>
        </div>
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