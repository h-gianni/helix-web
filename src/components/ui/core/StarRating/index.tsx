"use client";

import React, { useState } from "react";
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
}

const TOTAL_STARS = 5;

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
    },
    ref
  ) => {
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    // Handle no ratings case
    if (ratingsCount === 0 && disabled) {
      return (
        <div ref={ref} className={cn("missing-text", className)}>
          No scores received yet
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
        case "sm": return 16;
        case "lg": return 24;
        case "xl": return 32;
        default: return 20; // base size
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

            return (
              <ToggleGroup.Item
                key={index}
                value={starNumber.toString()}
                disabled={disabled}
                className={cn(
                  "inline-flex items-center justify-center",
                  getStarPadding(),
                  "star-color-off rounded-md",
                  "hover:star-color-on focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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
                        "absolute inset-0 star-color-on",
                        "transition-colors duration-200"
                      )}
                      strokeWidth={1.5}
                      size={getStarSize()}
                    />
                  </div>
                ) : (
                  <Star
                    className={cn(
                      isFullStar ? "star-color-on" : "",
                      "transition-colors duration-200"
                    )}
                    strokeWidth={1.5}
                    size={getStarSize()}
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