import StarRater from "@/components/ui/star-rater";
import { createReview } from "@/app/[authorRemoteId]/[modelRemoteId]/actions";
import { Button } from "../ui/button";

export default function ReviewsForm({ modelId }: { modelId: string }) {
  const createReviewWithId = createReview.bind(null, modelId);
  return (
    <form
      action={createReviewWithId}
      className="flex flex-col bg-muted px-2 py-4 sm:px-4"
    >
      <div>
        <label
          htmlFor="stars"
          className="block text-xs text-muted-foreground uppercase"
        >
          Stars
        </label>
        <StarRater />
      </div>

      <div className="mt-4">
        <label
          htmlFor="text"
          className="block text-xs text-muted-foreground uppercase"
        >
          Review
        </label>
        <textarea
          id="text"
          name="text"
          placeholder="Your review"
          required
          className="mt-1 block w-full appearance-none rounded-md border border-border px-3 py-2 placeholder-muted-foreground focus:border-accent focus:outline-none focus:ring-accent sm:text-sm"
        />
      </div>

      <Button
        type="submit"
        className="hover:underline hover:bg-primary hover:text-primary-foreground flex h-10 px-8 max-w-xs self-end items-center justify-center rounded-md border text-sm transition-all focus:outline-none mt-4"
      >
        Submit
      </Button>
    </form>
  );
}
