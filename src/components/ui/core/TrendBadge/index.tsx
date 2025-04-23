"use client";

import * as React from "react";
import { TrendingUp, TrendingDown, MoveRight } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/core/Badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/core/Tooltip";

const trendBadgeVariants = cva(
  "inline-flex items-center gap-1.5 cursor-default",
  {
    variants: {
      size: {
        default: "text-xs leading-0 h-6",
        sm: "text-xs leading-0 h-5 px-1.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

// Define the trend configurations
const TREND_CONFIG = {
  up: {
    icon: TrendingUp,
    label: "Improving",
    badgeClassName: "bg-success-100/60 text-success-foreground",
    tooltip: "Performance is improving over time",
  },
  down: {
    icon: TrendingDown,
    label: "Declining",
    badgeClassName: "bg-warning-100/60 text-warning-foreground",
    tooltip: "Performance requires attention",
  },
  stable: {
    icon: MoveRight,
    label: "Stable",
    badgeClassName: "bg-info-100/60 text-info-foreground",
    tooltip: "Performance remains stable",
  },
  unavailable: {
    icon: null,
    label: "Trend data not available yet",
    badgeClassName: "bg-transparent text-unavailable",
    tooltip: "Performance trend data has not been collected yet",
  },
} as const;

export type TrendVariant = 'up' | 'down' | 'stable' | 'unavailable';

export interface TrendBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof trendBadgeVariants> {
  variant?: TrendVariant;
  label?: string;
  showTooltip?: boolean;
  // If true, will use the unavailable variant
  noTrendData?: boolean;
}

/**
 * TrendBadge component displays a badge indicating performance trend
 * with appropriate icon and color scheme
 * 
 * @example
 * ```tsx
 * <TrendBadge variant="up" label="Improving" showTooltip />
 * ```
 */
export function TrendBadge({
  className,
  variant = "stable",
  size = "default",
  label,
  showTooltip = false,
  noTrendData = false,
  ...props
}: TrendBadgeProps) {
  // Use unavailable variant if noTrendData is true
  const effectiveVariant = noTrendData ? "unavailable" : variant;
  const config = TREND_CONFIG[effectiveVariant];
  
  // Use custom label if provided, otherwise use default from config
  const displayLabel = label || config.label;
  
  const badge = (
    <Badge
      className={cn(
        trendBadgeVariants({ size }),
        config.badgeClassName,
        className
      )}
      {...props}
    >
      {config.icon && (
        <config.icon className={size === "default" ? "size-3" : "size-2.5"} />
      )}
      <span>{displayLabel}</span>
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