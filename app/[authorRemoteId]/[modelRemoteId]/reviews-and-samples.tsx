"use client";

import { Model } from "@/app/[authorSlug]/[modelSlug]/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type ReviewsAndSamplesProps = {
  model: Model;
  reviews: React.ReactNode;
  samples: React.ReactNode;
};

export default function ReviewsAndSamples({
  model,
  reviews,
  samples,
}: ReviewsAndSamplesProps) {
  const { numHumanFeedback, numReviews } = model;
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!numReviews && numHumanFeedback)
      router.replace(`?tab=samples`, { scroll: false });
  }, [router]);

  return (
    <Tabs
      defaultValue="reviews"
      className="mt-10"
      value={searchParams.get("tab") || "reviews"}
      activationMode="manual"
      onValueChange={(value) => {
        const params = new URLSearchParams(searchParams);
        if (value === "reviews") {
          params.delete("tab");
        } else {
          params.set("tab", value);
        }
        router.replace(`?${params.toString()}`, { scroll: false });
      }}
    >
      <TabsList className="mb-2">
        <TabsTrigger value="reviews">
          Reviews
          {numReviews && numReviews > 0 ? ` (${numReviews})` : ""}
        </TabsTrigger>
        <TabsTrigger value="samples">
          Samples
          {numHumanFeedback && numHumanFeedback > 0
            ? ` (${numHumanFeedback})`
            : ""}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="reviews">{reviews}</TabsContent>
      <TabsContent value="samples">{samples}</TabsContent>
    </Tabs>
  );
}
