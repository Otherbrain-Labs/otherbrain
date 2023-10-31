// small ui component for inputting a star rating
// hovering stars lights them up and clicking sets the rating
//
// usage:
// <StarRater rating={rating} onChange={setRating} />
//

"use client";

import { useState } from "react";
import Star from "./star";

export type StarRaterProps = {
  rating: number;
};

export default function StarRater({}: StarRaterProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [rating, setRating] = useState(0);

  return (
    <div className="flex items-center">
      <input
        id="stars"
        name="stars"
        type="number"
        className="hidden mt-1 w-full appearance-none rounded-md border border-border px-3 py-2 placeholder-muted-foreground shadow-sm focus:border-accent focus:outline-none focus:ring-accent sm:text-sm"
        value={rating}
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
    </div>
  );
}
