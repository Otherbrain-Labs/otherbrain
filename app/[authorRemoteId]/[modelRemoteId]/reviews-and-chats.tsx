"use client";

import { Model } from "@/app/[authorRemoteId]/[modelRemoteId]/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type ReviewsAndChatsProps = {
  model: Model;
  reviews: React.ReactNode;
  chats: React.ReactNode;
};

export default function ReviewsAndChats({
  model,
  reviews,
  chats,
}: ReviewsAndChatsProps) {
  const { numHumanFeedback, numReviews } = model;
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!numReviews && numHumanFeedback)
      router.replace(`?tab=chats`, { scroll: false });
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
        <TabsTrigger value="chats">
          Examples
          {numHumanFeedback && numHumanFeedback > 0
            ? ` (${numHumanFeedback})`
            : ""}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="reviews">{reviews}</TabsContent>
      <TabsContent value="chats">{chats}</TabsContent>
    </Tabs>
  );
}
