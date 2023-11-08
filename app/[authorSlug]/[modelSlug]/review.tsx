import StarRating from "@/components/ui/star-rating";
import type { Review } from "./page";
import { getServerSession } from "next-auth/next";
import { deleteReview } from "./actions";

type ReviewProps = {
  review: Review;
};

export default async function Review({ review }: ReviewProps) {
  const session = await getServerSession();

  console.log("xxx", session?.user, review.userId);

  return (
    <div key={review.id} className="border p-3">
      <div className="flex justify-between">
        <StarRating rating={review.stars} />
        <div className="text-muted-foreground">
          {new Date(review.createdAt).toLocaleDateString()}
        </div>
      </div>
      <div className="text-sm mt-1">{review.text}</div>
      {session?.user?.id === review.userId && (
        <button
          onClick={() => deleteReview(review.id)}
          className="text-sm text-red-500 hover:underline focus:outline-none"
        >
          Delete
        </button>
      )}
    </div>
  );
}
