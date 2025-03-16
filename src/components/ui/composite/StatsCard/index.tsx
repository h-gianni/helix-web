"use client";

import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/core/Card";
import { TrendingUp, TrendingDown, MoveRight } from "lucide-react";
import { Badge } from "@/components/ui/core/Badge";

export interface StatItemProps {
  title: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  trendLabel?: string;
  icon?: ReactNode;
}

export function StatItem({
  title,
  value,
  trend,
  trendValue,
  trendLabel,
  icon,
}: StatItemProps) {
  const isNA = value === "N/A";

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="size-4" />;
      case "down":
        return <TrendingDown className="size-4" />;
      case "neutral":
        return <MoveRight className="size-4" />;
      default:
        return null;
    }
  };

  const getTrendVariant = () => {
    switch (trend) {
      case "up":
        return "success-light";
      case "down":
        return "destructive-light";
      case "neutral":
        return "secondary-light";
      default:
        return "outline";
    }
  };

  return (
    <div className="flex flex-col gap-0">
      <div className="flex items-center justify-between">
        <h3 className={`heading-6 ${isNA ? "opacity-50" : ""} !text-foreground-weak truncate`}>{title}</h3>
        {icon && <div className="ml-2 flex-shrink-0">{icon}</div>}
      </div>
      <div className="mt-1">
        <span className={`heading-1 ${isNA ? "opacity-50" : ""} break-words`}>{value}</span>
      </div>
      {!isNA && (trendLabel || trend) && (
        <div className="flex flex-wrap items-center gap-1.5 mt-1 text-sm">
          {trend && (
            <Badge
              variant={getTrendVariant()}
              className="flex items-center gap-1.5 text-xs"
            >
              {getTrendIcon()}
              {trendValue && <span className="truncate max-w-32">{trendValue}</span>}
            </Badge>
          )}
          {trendLabel && trend && <span className="text-xs truncate">{trendLabel}</span>}
          {!trend && trendLabel && (
            <span className="text-xs text-foreground-weak truncate">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}

export interface StatsCardProps {
  items: StatItemProps[];
  className?: string;
  columns?: 2 | 3 | 4 | 5 | 6;
  withDividers?: boolean;
  background?: "default" | "muted";
}

export function StatsCard({
  items,
  className = "",
  columns = 4,
  withDividers = true,
  background = "default",
}: StatsCardProps) {
  const getGridCols = () => {
    switch (columns) {
      case 2:
        return "grid grid-cols-2 sm:grid-cols-2";
      case 3:
        return "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3";
      case 4:
        return "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4";
      case 5:
        return "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5";
      case 6:
        return "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6";
      default:
        return "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4";
    }
  };
  
  const getDividerClasses = () => {
    // For mobile (1 column)
    if (withDividers) {
      return "divide-y md:divide-x-1 md:divide-y-0 divide-gray-200";
    }
    return "gap-4";
  };

  const getCardClass = () => {
    return background === "muted" ? "bg-muted/30" : "";
  };

  return (
    <Card className={getCardClass()}>
      <CardContent className={withDividers ? "p-0" : "py-4"}>
        <div
          className={`${getGridCols()} ${getDividerClasses()} ${className}`}
        >
          {items.map((item, index) => (
            <div
              key={`stat-item-${index}`}
              className={
                withDividers
                  ? `p-4 ${
                      index % columns === 0 ? "sm:pr-4" : 
                      (index + 1) % columns === 0 || index === items.length - 1 ? "sm:pl-4" : 
                      "sm:px-4"
                    }`
                  : "p-4 bg-background rounded-md shadow-sm"
              }
            >
              <StatItem {...item} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}