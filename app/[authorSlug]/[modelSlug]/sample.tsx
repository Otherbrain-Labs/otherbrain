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
      className="mt-4 border rounded p-4 space-y-2 text-xs"
    >
      <div className="font-bold">System prompt</div>
      <Markdown className="prose prose-sm" remarkPlugins={[remarkGfm]}>
        {humanFeedback.lastSystemPrompt}
      </Markdown>
      {humanFeedback.messages
        .sort((a, b) => a.index - b.index)
        .map((message) => (
          <div key={message.id} className="space-y-2">
            <div className="font-bold">
              {message.fromUser ? "Human" : "Bot"}
            </div>
            <Markdown className="prose prose-sm" remarkPlugins={[remarkGfm]}>
              {message.text}
            </Markdown>
          </div>
        ))}
    </div>
  );
}
