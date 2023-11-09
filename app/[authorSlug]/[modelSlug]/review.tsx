import StarRating from "@/components/ui/star-rating";
import type { Review } from "./page";
import { deleteReview } from "./actions";
import { getServerSession } from "@/lib/auth";
import { Trash } from "lucide-react";

type ReviewProps = {
  review: Review;
};

export default async function Review({ review }: ReviewProps) {
  const session = await getServerSession();
  const deleteReviewWithId = deleteReview.bind(null, review.id);

  return (
    <div key={review.id} className="border p-3">
      <div className="flex justify-between">
        <StarRating rating={review.stars} />
        <div className="text-muted-foreground">
          {new Date(review.createdAt).toLocaleDateString()}
        </div>
      </div>
      <div className="text-sm mt-1">
        {review.text.split("\n").map((line, index) => (
          <p key={index} className={line ? "" : "h-4"}>
            {line}
          </p>
        ))}
      </div>
      {session?.user?.id === review.userId && (
        <form action={deleteReviewWithId} className="flex justify-end">
          <button
            type="submit"
            title="delete"
            className="text-sm hover:underline focus:outline-none text-muted-foreground"
          >
            <Trash size={16} />
          </button>
        </form>
      )}
    </div>
  );
}
