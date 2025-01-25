import React, { useState } from "react";
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
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
  showRatingsCount = true
}: StarRatingProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  // If no ratings, show placeholder text
  if (ratingsCount === 0 && disabled) {
    return <span className="star-no-ratings">No ratings yet</span>;
  }

  return (
    <div className="star-rating-container">
      {Array.from({ length: count }).map((_, index) => {
        const starNumber = index + 1;
        const currentValue = hoverValue ?? value;
        const isFullStar = currentValue >= starNumber;
        const isHalfStar = !isFullStar && 
          (currentValue + 0.5 >= starNumber) && 
          (Math.ceil(currentValue) === starNumber);

        return (
          <button
            key={index}
            type="button"
            disabled={disabled}
            className="star-button"
            onMouseEnter={() => !disabled && setHoverValue(starNumber)}
            onMouseLeave={() => !disabled && setHoverValue(null)}
            onClick={() => onChange?.(starNumber)}
          >
            {isHalfStar ? (
              <>
                <Star className={cn(`star-${size}`, "star-base-layer")} />
                <StarHalf className={cn(`star-${size}`, "star-overlay")} />
              </>
            ) : (
              <Star
                className={cn(
                  `star-${size}`,
                  "star-transition",
                  isFullStar ? "star-filled" : "star-empty"
                )}
              />
            )}
          </button>
        );
      })}
      {showValue && value > 0 && (
        <span className="star-value">
          {value.toFixed(1)}
        </span>
      )}
      {showRatingsCount && ratingsCount !== undefined && ratingsCount > 0 && (
        <span className="star-count">
          ({ratingsCount})
        </span>
      )}
    </div>
  );
};

export default StarRating;