"use client";

import React, { useState, useEffect } from "react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "base" | "lg" | "xl";
  disabled?: boolean;
  ratingsCount?: number;
  showValue?: boolean;
  showRatingsCount?: boolean;
  className?: string;
  activeScore?: boolean; // New prop for interactive scoring mode
}

const TOTAL_STARS = 5;
const DEFAULT_ACTIVE_SCORE_VALUE = 1; // Default to 1 star when in activeScore mode

const StarRating = React.forwardRef<HTMLDivElement, StarRatingProps>(
  (
    {
      value,
      onChange,
      size = "",
      disabled = false,
      ratingsCount,
      showValue = true,
      showRatingsCount = true,
      className,
      activeScore = false, // Default to view mode
    },
    ref
  ) => {
    const [hoverValue, setHoverValue] = useState<number | null>(null);
    
    // Initialize with 1 star when in activeScore mode and no initial value
    useEffect(() => {
      if (activeScore && value === 0 && onChange && !disabled) {
        onChange(DEFAULT_ACTIVE_SCORE_VALUE);
      }
    }, [activeScore, value, onChange, disabled]);

    // Handle no ratings case
    if (ratingsCount === 0 && disabled) {
      return (
        <div ref={ref} className={cn("text-unavailable", className)}>
          No scores received
        </div>
      );
    }

    const getStarProps = (index: number) => {
      const starNumber = index + 1;
      const currentValue = hoverValue ?? value;
      const isFullStar = currentValue >= starNumber;
      const isHalfStar =
        !isFullStar &&
        currentValue + 0.5 >= starNumber &&
        Math.ceil(currentValue) === starNumber;

      return { isFullStar, isHalfStar, starNumber };
    };

    // Get star size based on the size prop
    const getStarSize = () => {
      switch (size) {
        case "sm": return 14;
        case "lg": return 24;
        case "xl": return 48;
        default: return 18; // base size
      }
    };

    // Get padding based on the size prop
    const getStarPadding = () => {
      switch (size) {
        case "sm": return "p-0.5";
        case "xl": return "p-2";
        case "lg": return "p-1";
        default: return "p-0.5"; // base padding
      }
    };

    // Determine star colors based on activeScore mode
    const getStarColorClasses = (isFullStar: boolean, isHalfStar: boolean) => {
      if (activeScore) {
        // Active scoring mode - using primary-500 for selection
        if (isFullStar) {
          return "text-primary-500 fill-primary-500";
        } else if (isHalfStar) {
          return ""; // Base class for half stars in active mode
        } else {
          return "text-gray-300"; // Unselected stars in active mode
        }
      } else {
        // Regular display mode - using the existing star color classes
        if (isFullStar) {
          return "star-color-on";
        } else if (isHalfStar) {
          return ""; // Base class for half stars in regular mode
        } else {
          return "star-color-off";
        }
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center",
          size === "xl" ? "gap-4" : "gap-2",
          size === "sm" && "text-base",
          size === "lg" && "text-lg",
          size === "xl" && "text-xl",
          className
        )}
      >
        <ToggleGroup.Root
          type="single"
          value={value.toString()}
          onValueChange={(newValue) => {
            if (!disabled && onChange) {
              onChange(Number(newValue));
            }
          }}
          disabled={disabled}
          className="flex"
        >
          {Array.from({ length: TOTAL_STARS }).map((_, index) => {
            const { isFullStar, isHalfStar, starNumber } = getStarProps(index);
            const starColorClasses = getStarColorClasses(isFullStar, isHalfStar);

            return (
              <ToggleGroup.Item
                key={index}
                value={starNumber.toString()}
                disabled={disabled}
                className={cn(
                  "inline-flex items-center justify-center",
                  getStarPadding(),
                  activeScore ? "text-gray-300" : "star-color-off",
                  "rounded-md",
                  "hover:text-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:pointer-events-none",
                  size === "xl" && !disabled && "cursor-pointer transition-transform hover:scale-110",
                  {
                    "cursor-pointer": !disabled,
                  }
                )}
                onMouseEnter={() => !disabled && setHoverValue(starNumber)}
                onMouseLeave={() => !disabled && setHoverValue(null)}
              >
                {isHalfStar ? (
                  <div className="relative">
                    <Star
                      className={cn("")}
                      strokeWidth={1.5}
                      size={getStarSize()}
                    />
                    <StarHalf
                      className={cn(
                        "absolute inset-0",
                        activeScore ? "text-primary-500" : "star-color-on",
                        "transition-colors duration-200"
                      )}
                      strokeWidth={1.5}
                      size={getStarSize()}
                    />
                  </div>
                ) : (
                  <Star
                    className={cn(
                      starColorClasses,
                      activeScore && isFullStar && "stroke-primary-500",
                      "transition-colors duration-200"
                    )}
                    strokeWidth={1.5}
                    size={getStarSize()}
                    fill={isFullStar ? (activeScore ? "currentColor" : undefined) : "none"}
                  />
                )}
              </ToggleGroup.Item>
            );
          })}
        </ToggleGroup.Root>

        {(showValue || showRatingsCount) && (
          <div className="flex items-baseline gap-1">
            {showValue && (
              <span className={cn(
                size === "xl" ? "display-2" : "heading-5",
                value === 0 && "text-foreground-muted"
              )}>
                {value.toFixed(1)}
              </span>
            )}
            {showRatingsCount && ratingsCount !== undefined && ratingsCount > 0 && (
              <span className={cn("text-sm leading-none text-foreground-weak", size === "xl" && "text-base")}>({ratingsCount})</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

StarRating.displayName = "StarRating";

export default StarRating;