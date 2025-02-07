"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

type SkeletonSize = "xs" | "sm" | "md" | "lg" | "xl";
type SkeletonVariant = "default" | "shimmer" | "avatar" | "card";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SkeletonSize;
  variant?: SkeletonVariant;
}

function Skeleton({
  className,
  variant = "default",
  size = "md",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "ui-skeleton-base",
        `ui-skeleton-${size}`,
        variant === "shimmer" && "ui-skeleton-shimmer",
        variant === "avatar" && "ui-skeleton-avatar",
        variant === "card" && "ui-skeleton-card",
        className
      )}
      {...props}
    />
  );
}

interface SkeletonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: string;
}

function SkeletonGroup({ className, ...props }: SkeletonGroupProps) {
  return (
    <div className={cn("ui-skeleton-group", className)} {...props} />
  );
}

interface SkeletonTableProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number;
  columns?: number;
}

function SkeletonTable({
  className,
  rows = 3,
  columns = 4,
  ...props
}: SkeletonTableProps) {
  return (
    <div className={cn("ui-skeleton-table", className)} {...props}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="ui-skeleton-table-row flex">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export {
  Skeleton,
  SkeletonGroup,
  SkeletonTable,
  // type SkeletonProps,
  // type SkeletonGroupProps,
  // type SkeletonTableProps,
};
