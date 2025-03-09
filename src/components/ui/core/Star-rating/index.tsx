"use client";

import React, { useState } from "react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "base" | "lg";
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
      size = "base",
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
          No ratings yet
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

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2",
          size === "sm" && "text-base",
          size === "lg" && "text-lg",
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
                  "inline-flex items-center justify-center p-0.5 star-color-off",
                  "hover:star-color-on focus-visible:outline-none",
                  "disabled:pointer-events-none",
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
                      size={size === "sm" ? 16 : size === "lg" ? 24 : 20}
                    />
                    <StarHalf
                      className={cn(
                        "absolute inset-0 star-color-on",
                        "transition-colors duration-200"
                      )}
                      strokeWidth={1.5}
                      size={size === "sm" ? 16 : size === "lg" ? 24 : 20}
                    />
                  </div>
                ) : (
                  <Star
                    className={cn(
                      isFullStar ? "star-color-on" : "",
                      "transition-colors duration-200"
                    )}
                    strokeWidth={1.5}
                    size={size === "sm" ? 16 : size === "lg" ? 24 : 20}
                  />
                )}
              </ToggleGroup.Item>
            );
          })}
        </ToggleGroup.Root>

        {(showValue || showRatingsCount) && (
          <div className="flex items-baseline gap-1">
            {showValue && value > 0 && (
              <span className="heading-5">{value.toFixed(1)}</span>
            )}
            {showRatingsCount && ratingsCount !== undefined && ratingsCount > 0 && (
              <span className="text-sm leading-none text-foreground-weak">({ratingsCount})</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

StarRating.displayName = "StarRating";

export default StarRating;