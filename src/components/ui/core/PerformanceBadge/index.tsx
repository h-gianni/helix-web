"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/core/Badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/core/Tooltip";
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

export type PerformanceVariant = "star" | "strong" | "solid" | "inconsistent" | "low";

export interface PerformanceBadgeProps 
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof performanceBadgeVariants> {
  variant?: PerformanceVariant;
  showTooltip?: boolean;
  value?: number | null;
  isLoading?: boolean; // For API loading states
  ratingsCount?: number; // Optional count of ratings
}

// Performance configuration with color circles instead of different icons
const PERFORMANCE_CONFIG = {
  star: {
    label: "Star Performer",
    circleColor: "text-primary-500 fill-primary-500",
    badgeClassName: "bg-primary-100/50 text-primary-900",
    tooltip: "Top 5-10% of performers. Consistently exceeds expectations with outstanding results."
  },
  strong: {
    label: "Strong Performer",
    circleColor: "text-secondary-500 fill-secondary-500",
    badgeClassName: "bg-secondary-100/50 text-secondary-900",
    tooltip: "Frequently exceeds expectations. Delivers high-quality work consistently."
  },
  solid: {
    label: "Solid Performer",
    circleColor: "text-tertiary-500 fill-tertiary-500",
    badgeClassName: "bg-tertiary-100/50 text-tertiary-900",
    tooltip: "Meets all expectations consistently. A reliable team member."
  },
  inconsistent: {
    label: "Inconsistent Performer",
    circleColor: "text-warning-500 fill-warning-500",
    badgeClassName: "bg-warning-100/50 text-warning-900",
    tooltip: "Shows potential but results vary. Needs coaching in specific areas."
  },
  low: {
    label: "Needs Help",
    circleColor: "text-destructive-500 fill-destructive-500",
    badgeClassName: "bg-destructive-100/50 text-destructive-900",
    tooltip: "Currently falling short of expectations. Requires focused development plan."
  },
} as const;

// Helper function to determine variant based on numeric value
function getVariantFromValue(value: number | null | undefined): PerformanceVariant {
  // Handle null/undefined/NaN values
  if (value === null || value === undefined || isNaN(value)) {
    return "solid"; // Default to solid for missing data
  }
  
  // Ensure value is within expected range
  const safeValue = Math.max(0, Math.min(5, value));
  
  if (safeValue >= 4.5) return "star";
  if (safeValue >= 3.5) return "strong";
  if (safeValue >= 2.5) return "solid"; 
  if (safeValue >= 1.5) return "inconsistent";
  
  // Special case for zero ratings (not rated)
  if (safeValue === 0) return "solid";
  
  return "low";
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
 * <PerformanceBadge variant="star" showTooltip />
 * 
 * // With automatic variant based on value
 * <PerformanceBadge value={4.8} showTooltip />
 * ```
 */
export function PerformanceBadge({
  className,
  variant,
  size = "base",
  showTooltip = false,
  value,
  isLoading = false,
  ratingsCount,
  ...props
}: PerformanceBadgeProps) {
  // If loading, show a shimmer effect
  if (isLoading) {
    return (
      <Badge 
        className={cn(
          performanceBadgeVariants({ size }),
          "bg-gray-200 animate-pulse",
          className
        )} 
        {...props}
      >
        <span className="opacity-0">Loading</span>
      </Badge>
    );
  }

  // Check if there are no ratings (when ratingsCount is explicitly 0)
  const hasNoRatings = ratingsCount === 0;
  
  // Determine variant based on value if provided, otherwise use passed variant or default to "solid"
  const resolvedVariant = React.useMemo(() => {
    // If explicitly has no ratings, show "solid" variant
    if (hasNoRatings) return "solid";
    // Otherwise use value if available
    if (value !== undefined && value !== null) return getVariantFromValue(value);
    // Fall back to the provided variant or "solid"
    return variant || "solid";
  }, [value, variant, hasNoRatings]);
  
  const config = PERFORMANCE_CONFIG[resolvedVariant];
  
  // Display a "Not Rated" badge when explicitly has no ratings
  if (hasNoRatings) {
    return (
      <Badge 
        className={cn(
          performanceBadgeVariants({ size }), 
          "bg-white text-gray-600", 
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
        <span>Not Rated</span>
      </Badge>
    );
  }
  
  const badge = (
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

  // Return badge without tooltip if not requested
  if (!showTooltip) {
    return badge;
  }

  // Wrap with tooltip if requested
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          {config.tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}