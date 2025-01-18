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

  const sizes = {
    sm: "w-4 h-4",
    base: "w-6 h-6",
    lg: "w-8 h-8",
  };

  // If no ratings, show placeholder text
  if (ratingsCount === 0 && disabled) {
    return <span className="text-p-small text-muted">No ratings yet</span>;
  }

  return (
    <div className="flex items-center gap-1">
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
            className={cn(
              "transition-transform relative",
              !disabled && "hover:scale-110",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-ring focus-visible:ring-offset-2",
              "rounded-full p-0.5",
              disabled && "cursor-default"
            )}
            onMouseEnter={() => !disabled && setHoverValue(starNumber)}
            onMouseLeave={() => !disabled && setHoverValue(null)}
            onClick={() => onChange?.(starNumber)}
          >
            {isHalfStar ? (
              <>
                {/* Base neutral star */}
                <Star
                  className={cn(
                    sizes[size],
                    "absolute inset-0.5 fill-neutral-300 text-neutral-300"
                  )}
                />
                {/* Half filled star overlay */}
                <StarHalf
                  className={cn(
                    sizes[size],
                    "relative fill-yellow-400 text-yellow-400"
                  )}
                />
              </>
            ) : (
              <Star
                className={cn(
                  sizes[size],
                  "transition-colors duration-200",
                  isFullStar && "fill-yellow-400 text-yellow-400",
                  !isFullStar && "fill-neutral-300 text-neutral-300"
                )}
              />
            )}
          </button>
        );
      })}
      {showValue && value > 0 && (
        <span className="ml-2 text-p-small font-medium">
          {value.toFixed(1)}
        </span>
      )}
      {showRatingsCount && ratingsCount !== undefined && ratingsCount > 0 && (
        <span className="ml-0 text-p-small text-muted">
          ({ratingsCount})
        </span>
      )}
    </div>
  );
};

export default StarRating;