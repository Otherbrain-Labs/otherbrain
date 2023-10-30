// small ui component for inputting a star rating
// hovering stars lights them up and clicking sets the rating
//
// usage:
// <StarRater rating={rating} onChange={setRating} />
//
// where rating is a number between 0 and 5
// and setRating is a function that sets the rating
//
// note: the onChange function is called with the new rating
// after the user clicks a star
//

"use client";

import { useState } from "react";
import Star from "./star";

export type StarRaterProps = {
  rating: number;
  onChange: (rating: number) => void;
};

export default function StarRater({ rating, onChange }: StarRaterProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => {
        const starNumber = i + 1;
        return (
          <button
            key={i}
            className="focus:outline-none"
            onClick={() => onChange(starNumber)}
            onMouseEnter={() => setHoverRating(starNumber)}
            onMouseLeave={() => setHoverRating(0)}
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
