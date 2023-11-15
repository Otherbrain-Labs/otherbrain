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
    <div key={review.id} className="border rounded px-7 pt-7 pb-5 mb-4">
      <div className="flex justify-between mb-5">
        <StarRating rating={review.stars} />
      </div>
      <div className="leading-tight mt-1 mb-4">
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
          <div className="text-sm text-muted-foreground inline">
            <Link href={review.externalUrl} rel="noopener noreferrer">
              {review.externalName || review.externalUrl}
            </Link>
            <span> on </span>
          </div>
        </>
      )}{" "}
      <div className="text-sm text-muted-foreground inline">
        {review.createdAt.toLocaleDateString()}
      </div>
    </div>
  );
}
