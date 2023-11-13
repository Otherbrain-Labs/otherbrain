import Star from "./star";

export type StarRatingProps = {
  rating: number;
};

export default function StarRating({ rating }: StarRatingProps) {
  return (
    <div className="flex items-center" title={`${rating} stars`}>
      {[...Array(rating)].map((_, i) => (
        <Star key={i} filled className="w-3 h-3 mr-1" />
      ))}
    </div>
  );
}
