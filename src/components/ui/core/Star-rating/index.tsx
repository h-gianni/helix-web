"use client";

import React, { useState } from "react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "base" | "lg";
  count?: number;
  showValue?: boolean;
  disabled?: boolean;
  ratingsCount?: number;
  showRatingsCount?: boolean;
}

const StarRating = ({
  value,
  onChange,
  size = "base",
  count = 5,
  showValue = true,
  disabled = false,
  ratingsCount,
  showRatingsCount = true,
}: StarRatingProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  if (ratingsCount === 0 && disabled) {
    return <span className="ui-star-rating-no-ratings">No ratings yet</span>;
  }

  return (
    <div className="ui-star-rating-container" data-size={size}>
      <ToggleGroup.Root
        type="single"
        value={value.toString()}
        onValueChange={(newValue) => {
          if (!disabled && onChange) {
            onChange(Number(newValue));
          }
        }}
        disabled={disabled}
        className="ui-star-rating-toggle"
      >
        {Array.from({ length: count }).map((_, index) => {
          const starNumber = index + 1;
          const currentValue = hoverValue ?? value;
          const isFullStar = currentValue >= starNumber;
          const isHalfStar =
            !isFullStar &&
            currentValue + 0.5 >= starNumber &&
            Math.ceil(currentValue) === starNumber;

          return (
            <ToggleGroup.Item
              key={index}
              value={starNumber.toString()}
              disabled={disabled}
              className="ui-star-rating-button"
              onMouseEnter={() => !disabled && setHoverValue(starNumber)}
              onMouseLeave={() => !disabled && setHoverValue(null)}
            >
              {isHalfStar ? (
                <>
                  <Star
                    className="ui-star-rating-star ui-star-rating-base-layer"
                    data-size={size}
                  />
                  <StarHalf
                    className="ui-star-rating-star ui-star-rating-overlay"
                    data-size={size}
                  />
                </>
              ) : (
                <Star
                  className={cn(
                    "ui-star-rating-star",
                    "ui-star-rating-transition",
                    isFullStar ? "ui-star-rating-filled" : "ui-star-rating-empty"
                  )}
                  data-size={size}
                />
              )}
            </ToggleGroup.Item>
          );
        })}
      </ToggleGroup.Root>
      <div className="ui-star-rating-tail">
        {showValue && value > 0 && (
          <span className="ui-star-rating-value" data-size={size}>
            {value.toFixed(1)}
          </span>
        )}
        {showRatingsCount && ratingsCount !== undefined && ratingsCount > 0 && (
          <span className="ui-star-rating-count" data-size={size}>
            ({ratingsCount})
          </span>
        )}
      </div>
    </div>
  );
};

export default StarRating;
