"use client";

import { useEffect, useState } from "react";
import Star from "./star";

type StarRaterProps = {
  defaultValue?: number;
  descriptions?: string[];
};

export default function StarRater({
  defaultValue = 0,
  descriptions,
}: StarRaterProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [rating, setRating] = useState(defaultValue);

  useEffect(() => {
    setRating(defaultValue);
  }, [defaultValue]);

  return (
    <div className="flex items-center">
      <input
        id="stars"
        name="stars"
        type="number"
        className="hidden mt-1 w-full appearance-none rounded-md border border-border px-3 py-2 placeholder-muted-foreground focus:border-accent focus:outline-none focus:ring-accent sm:text-sm"
        value={rating}
        readOnly
      />

      {[...Array(5)].map((_, i) => {
        const starNumber = i + 1;
        return (
          <button
            key={i}
            className="focus:outline-none"
            onClick={() => setRating(starNumber)}
            onMouseEnter={() => setHoverRating(starNumber)}
            onMouseLeave={() => setHoverRating(0)}
            type="button"
          >
            <Star
              filled={starNumber <= (hoverRating || rating)}
              className="w-4 h-4 text-yellow-300 mr-1"
            />
          </button>
        );
      })}

      {descriptions && (
        <span className="ml-2 text-xs text-muted-foreground">
          {descriptions[rating - 1]}
        </span>
      )}
    </div>
  );
}
