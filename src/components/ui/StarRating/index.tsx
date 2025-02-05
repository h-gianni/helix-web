"use client";

import React, { useState } from "react";
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

  // If no ratings and disabled, show placeholder text.
  if (ratingsCount === 0 && disabled) {
    return <span className="ui-star-rating-no-ratings">No ratings yet</span>;
  }

  return (
    <div className="ui-star-rating-container">
      {Array.from({ length: count }).map((_, index) => {
        const starNumber = index + 1;
        const currentValue = hoverValue ?? value;
        const isFullStar = currentValue >= starNumber;
        const isHalfStar =
          !isFullStar &&
          currentValue + 0.5 >= starNumber &&
          Math.ceil(currentValue) === starNumber;

        return (
          <button
            key={index}
            type="button"
            disabled={disabled}
            className="ui-star-rating-button"
            onMouseEnter={() => !disabled && setHoverValue(starNumber)}
            onMouseLeave={() => !disabled && setHoverValue(null)}
            onClick={() => onChange?.(starNumber)}
          >
            {isHalfStar ? (
              <>
                <Star
                  className={cn(
                    `ui-star-rating-${size}`,
                    "ui-star-rating-base-layer"
                  )}
                />
                <StarHalf
                  className={cn(
                    `ui-star-rating-${size}`,
                    "ui-star-rating-overlay"
                  )}
                />
              </>
            ) : (
              <Star
                className={cn(
                  `ui-star-rating-${size}`,
                  "ui-star-rating-transition",
                  isFullStar ? "ui-star-rating-filled" : "ui-star-rating-empty"
                )}
              />
            )}
          </button>
        );
      })}
      {showValue && value > 0 && (
        <span className="ui-star-rating-value">{value.toFixed(1)}</span>
      )}
      {showRatingsCount &&
        ratingsCount !== undefined &&
        ratingsCount > 0 && (
          <span className="ui-star-rating-count">({ratingsCount})</span>
        )}
    </div>
  );
};

export default StarRating;
