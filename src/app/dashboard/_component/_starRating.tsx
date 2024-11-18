import React, { useState } from 'react';
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

const StarRating = ({ value, onChange, size = 'md' }: StarRatingProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={cn(
            "transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1",
            "transform-gpu hover:animate-pulse"
          )}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(null)}
          onClick={() => onChange(star)}
        >
          <svg
            className={cn(
              sizes[size],
              "transition-colors duration-200",
              (hoverValue !== null ? star <= hoverValue : star <= value)
                ? "fill-yellow-400 stroke-yellow-400"
                : "fill-transparent stroke-gray-300 hover:stroke-gray-400"
            )}
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
        </button>
      ))}
    </div>
  );
};

export default StarRating;