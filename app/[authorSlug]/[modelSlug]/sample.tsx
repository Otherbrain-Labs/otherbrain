import StarRating from "@/components/ui/star-rating";
import type { Review } from "./page";
import { deleteReview } from "./actions";
import { getServerSession } from "@/lib/auth";
import { Trash } from "lucide-react";
import Link from "next/link";
import { HumanFeedback } from "./reviews-and-samples";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

type SampleProps = {
  humanFeedback: HumanFeedback;
};

export default async function Sample({ humanFeedback }: SampleProps) {
  return (
    <div
      key={humanFeedback.id}
      className="mt-4 border rounded p-4 space-y-1 text-xs"
    >
      <div className="flex items-center justify-between flex-row-reverse mb-3">
        <Link
          className="hover:underline"
          href={`/human-feedback/${humanFeedback.id}`}
        >
          {humanFeedback.createdAt.toDateString()}
        </Link>
      </div>
      <Markdown className="prose prose-sm italic" remarkPlugins={[remarkGfm]}>
        {humanFeedback.lastSystemPrompt}
      </Markdown>
      {humanFeedback.messages
        .sort((a, b) => a.index - b.index)
        .map((message) => (
          <div key={message.id}>
            <div className="font-bold"></div>
            <Markdown className="prose prose-sm" remarkPlugins={[remarkGfm]}>
              {`**${message.fromUser ? "Human" : "Bot"}**: ${message.text}`}
            </Markdown>
          </div>
        ))}
    </div>
  );
}
