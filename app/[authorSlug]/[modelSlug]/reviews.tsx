import { Model } from "@/app/[authorSlug]/[modelSlug]/page";
import Review from "./review";
import { Suspense } from "react";

export default function Reviews({ model }: { model: Model }) {
  return (
    <Suspense>
      {model.reviews.length === 0 ? (
        <div className="text-sm text-muted-foreground ml-2">No reviews yet</div>
      ) : (
        <div className="space-y-3 mt-4">
          {model.reviews.map((review) => (
            <Review key={review.id} review={review} />
          ))}
        </div>
      )}
    </Suspense>
  );
}
