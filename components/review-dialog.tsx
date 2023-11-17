"use client";

import { Model } from "@/app/[authorRemoteId]/[modelRemoteId]/page";
import ReviewsForm from "./reviews/form";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

type ReviewDialogProps = {
  model: Model;
  children: React.ReactNode;
};

export default function ReviewDialog({ model, children }: ReviewDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[400px]">
        <div className="flex flex-col items-center justify-center space-y-2 border-b border-border px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Write a review</h3>
          <p className="text-sm text-muted-foreground">
            Share your experience with this model
          </p>
        </div>
        <ReviewsForm modelId={model.id} />
      </DialogContent>
    </Dialog>
  );
}
