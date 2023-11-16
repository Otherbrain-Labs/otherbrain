"use client";

import { Model } from "@/app/[authorSlug]/[modelSlug]/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";
import Review from "./review";
import { useRouter, useSearchParams } from "next/navigation";

export function Reviews({ model }: { model: Model }) {
  return model.reviews.length === 0 ? (
    <div className="text-sm text-muted-foreground ml-2">No reviews yet</div>
  ) : (
    <div className="space-y-3 mt-4">
      {model.reviews.map((review) => (
        <Review key={review.id} review={review} />
      ))}
    </div>
  );
}

type ReviewsAndSamplesProps = {
  model: Model;
  samples: React.ReactNode;
};

export default function ReviewsAndSamples({
  model,
  samples,
}: ReviewsAndSamplesProps) {
  const { numHumanFeedback, numReviews } = model;
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <Tabs
      defaultValue="reviews"
      className="mt-10"
      value={searchParams.get("tab") || "reviews"}
    >
      <TabsList className="mb-2">
        <TabsTrigger
          value="reviews"
          onClick={() => {
            const params = new URLSearchParams(searchParams);
            params.delete("tab");
            router.replace(`?${params.toString()}`, { scroll: false });
          }}
        >
          Reviews
          {numReviews && numReviews > 0 ? ` (${numReviews})` : ""}
        </TabsTrigger>
        <TabsTrigger
          value="samples"
          onClick={() => {
            const params = new URLSearchParams(searchParams);
            params.set("tab", "samples");
            router.replace(`?${params.toString()}`, { scroll: false });
          }}
        >
          Samples
          {numHumanFeedback && numHumanFeedback > 0
            ? ` (${numHumanFeedback})`
            : ""}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="reviews">
        <Reviews model={model} />
      </TabsContent>
      <TabsContent value="samples">
        <Suspense>{samples}</Suspense>
      </TabsContent>
    </Tabs>
  );
}
