"use client";

import * as React from "react";
import { TrendingUp, TrendingDown, MoveRight } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/core/Badge";

const trendBadgeVariants = cva(
  "inline-flex items-center gap-1.5 cursor-auto",
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
  },
  down: {
    icon: TrendingDown,
    label: "Declining",
    badgeClassName: "bg-warning-100/60 text-warning-foreground",
  },
  stable: {
    icon: MoveRight,
    label: "Stable",
    badgeClassName: "bg-info-100/60 text-info-foreground",
  },
  unavailable: {
    icon: null,
    label: "Trend not available",
    badgeClassName: "bg-transparent text-unavailable",
  },
} as const;

export type TrendVariant = 'up' | 'down' | 'stable' | 'unavailable';

export interface TrendBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof trendBadgeVariants> {
  variant?: TrendVariant;
  label?: string;
  // If true, will use the unavailable variant
  noTrendData?: boolean;
}

/**
 * TrendBadge component displays a badge indicating performance trend
 * with appropriate icon and color scheme
 * 
 * @example
 * ```tsx
 * <TrendBadge variant="up" label="Improving" />
 * ```
 */
export function TrendBadge({
  className,
  variant = "stable",
  size = "default",
  label,
  noTrendData = false,
  ...props
}: TrendBadgeProps) {
  // Use unavailable variant if noTrendData is true
  const effectiveVariant = noTrendData ? "unavailable" : variant;
  const config = TREND_CONFIG[effectiveVariant];
  
  // Use custom label if provided, otherwise use default from config
  const displayLabel = label || config.label;
  
  return (
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
}