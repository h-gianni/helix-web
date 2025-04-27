"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/core/Badge";
import { Circle } from "lucide-react";

const performanceBadgeVariants = cva(
  "inline-flex items-center justify-center gap-1.5 cursor-default",
  {
    variants: {
      size: {
        base: "text-xs leading-0 h-6",
        lg: "text-sm leading-0 h-6 px-2.5",
      },
    },
    defaultVariants: {
      size: "base",
    },
  }
);

// Updated PerformanceVariant type to include all required values
export type PerformanceVariant =
  | "star"
  | "strong"
  | "solid"
  | "lower"       // Changed from "inconsistent"
  | "poor"        // Changed from "low"
  | "not-scored"  // Added for consistency
  | "unavailable";

export interface PerformanceBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof performanceBadgeVariants> {
  variant?: PerformanceVariant;
  value?: number | null;
  isLoading?: boolean; // For API loading states
  ratingsCount?: number; // Optional count of ratings
  // If true, will use the unavailable variant
  noPerformanceData?: boolean;
}

// Updated performance configuration with new variant names
const PERFORMANCE_CONFIG = {
  star: {
    label: "Star Performer",
    circleColor: "text-primary-500 fill-primary-500",
    badgeClassName: "bg-neutral-50 text-neutral-foreground",
  },
  strong: {
    label: "Strong Performer",
    circleColor: "text-secondary-500 fill-secondary-500",
    badgeClassName: "bg-neutral-50 text-neutral-foreground",
  },
  solid: {
    label: "Solid Performer",
    circleColor: "text-tertiary-500 fill-tertiary-500",
    badgeClassName: "bg-neutral-50 text-neutral-foreground",
  },
  lower: {  // Changed from "inconsistent"
    label: "Lower Performer",
    circleColor: "text-warning-500 fill-warning-500",
    badgeClassName: "bg-neutral-50 text-neutral-foreground",
  },
  poor: {   // Changed from "low"
    label: "Poor Performer",
    circleColor: "text-destructive-500 fill-destructive-500",
    badgeClassName: "bg-neutral-50 text-neutral-foreground",
  },
  "not-scored": {  // Added for consistency
    label: "Not Scored",
    circleColor: "text-neutral-400 fill-neutral-400",
    badgeClassName: "bg-transparent text-unavailable",
  },
  unavailable: {
    label: "Not Rated",
    circleColor: "text-neutral-400 fill-neutral-400",
    badgeClassName: "bg-transparent text-unavailable",
  },
} as const;

// Updated helper function to determine variant based on numeric value
function getVariantFromValue(
  value: number | null | undefined
): PerformanceVariant {
  // Handle null/undefined/NaN values
  if (value === null || value === undefined || isNaN(value)) {
    return "solid"; // Default to solid for missing data
  }

  // Ensure value is within expected range
  const safeValue = Math.max(0, Math.min(5, value));

  if (safeValue >= 4.5) return "star";
  if (safeValue >= 3.5) return "strong";
  if (safeValue >= 2.5) return "solid";
  if (safeValue >= 1.5) return "lower"; // Changed from "inconsistent"

  // Special case for zero ratings (not rated)
  if (safeValue === 0) return "not-scored"; // Changed to be more specific

  return "poor"; // Changed from "low"
}

type PerformanceConfigType = typeof PERFORMANCE_CONFIG;
type PerformanceConfigKey = keyof PerformanceConfigType;

/**
 * PerformanceBadge component displays a badge indicating performance level
 * using colored circles instead of icons
 *
 * @example
 * ```tsx
 * // With explicit variant
 * <PerformanceBadge variant="star" />
 *
 * // With automatic variant based on value
 * <PerformanceBadge value={4.8} />
 * 
 * // With unavailable data
 * <PerformanceBadge noPerformanceData />
 * ```
 */
export function PerformanceBadge({
  className,
  variant,
  size = "base",
  value,
  isLoading = false,
  ratingsCount,
  noPerformanceData = false,
  ...props
}: PerformanceBadgeProps) {
  // Move all state calculations to the top, before any conditional returns
  const hasNoRatings = ratingsCount === 0;

  // Determine variant based on value if provided, otherwise use passed variant or default to "solid"
  const resolvedVariant: PerformanceVariant = React.useMemo(() => {
    // If noPerformanceData is true, use not-scored variant
    if (noPerformanceData) return "not-scored"; // Changed from "unavailable"
    // If explicitly has no ratings, show "not-scored" variant
    if (hasNoRatings) return "not-scored"; // Changed from "solid"
    // Otherwise use value if available
    if (value !== undefined && value !== null)
      return getVariantFromValue(value);
    // Fall back to the provided variant or "solid"
    return variant || "solid";
  }, [value, variant, hasNoRatings, noPerformanceData]);

  const config = PERFORMANCE_CONFIG[resolvedVariant];

  // Now handle conditional renders using the values computed above

  // If loading, show a shimmer effect
  if (isLoading) {
    return (
      <Badge
        className={cn(
          performanceBadgeVariants({ size }),
          "bg-neutral-200 animate-pulse",
          className
        )}
        {...props}
      >
        <span className="opacity-0">Loading</span>
      </Badge>
    );
  }

  // Display a "Not Scored" badge when explicitly has no ratings
  if (hasNoRatings && !noPerformanceData) {
    return (
      <Badge
        className={cn(
          performanceBadgeVariants({ size }),
          "bg-white text-neutral-600",
          className
        )}
        {...props}
      >
        <Circle
          className={cn(
            "text-neutral-400 fill-neutral-400",
            size === "lg" ? "size-2.5" : "size-2"
          )}
        />
        <span className="text-unavailable">Not Scored</span>
      </Badge>
    );
  }

  return (
    <Badge
      className={cn(
        performanceBadgeVariants({ size }),
        config.badgeClassName,
        className
      )}
      {...props}
    >
      <Circle
        className={cn(
          config.circleColor,
          size === "lg" ? "size-2.5" : "size-2"
        )}
      />
      <span>{config.label}</span>
    </Badge>
  );
}