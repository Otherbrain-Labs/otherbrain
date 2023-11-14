import StarRating from "@/components/ui/star-rating";
import type { Review } from "./page";
import { deleteReview } from "./actions";
import { getServerSession } from "@/lib/auth";
import { Trash } from "lucide-react";
import Link from "next/link";

type ReviewProps = {
  review: Review;
};

export default async function Review({ review }: ReviewProps) {
  const session = await getServerSession();
  const deleteReviewWithId = deleteReview.bind(null, review.id);

  return (
    <div key={review.id} className="border rounded px-3 pt-4 pb-3">
      <div className="flex justify-between mb-4">
        <StarRating rating={review.stars} />
      </div>
      <div className="text-sm leading-tight mt-1 mb-2">
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
      {review.externalUrl && (
        <>
          <div className="text-xs text-muted-foreground inline">
            <Link href={review.externalUrl} rel="noopener noreferrer">
              {review.externalName || review.externalUrl}
            </Link>
            <span> on </span>
          </div>
        </>
      )}{" "}
      <div className="text-xs text-muted-foreground inline">
        {new Date(review.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
