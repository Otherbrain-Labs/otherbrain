import Link from "next/link";
import { HumanFeedback } from "./chats";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import StarRating from "@/components/ui/star-rating";

type ChatProps = {
  humanFeedback: HumanFeedback;
  hideDate?: boolean;
};

export default async function Chat({ humanFeedback, hideDate }: ChatProps) {
  const messages = humanFeedback.messages.sort((a, b) => a.index - b.index);

  return (
    <div
      key={humanFeedback.id}
      className="mt-4 border rounded p-4 space-y-4 leading-tight text-xs"
    >
      {!hideDate && (
        <Link
          className="hover:underline flex items-center justify-between mb-3 font-mono"
          href={`/human-feedback/${humanFeedback.numId}`}
        >
          <div className="flex">
            <div className="pr-4">Chat #{humanFeedback.numId}</div>
            {!!humanFeedback.quality && (
              <StarRating rating={humanFeedback.quality} />
            )}
          </div>

          {humanFeedback.createdAt.toLocaleDateString()}
        </Link>
      )}
      <Markdown
        className="prose prose-sm dark:prose-invert italic leading-tight text-xs"
        remarkPlugins={[remarkGfm]}
      >
        {humanFeedback.lastSystemPrompt.replaceAll("\n", "  \n")}
      </Markdown>
      {messages
        .sort((a, b) => a.index - b.index)
        .map((message, i) => (
          <div key={message.id} className="flex spacing-y-2 w-full">
            <div className="font-semibold italic row-auto min-w-[41px] text-right">
              {message.fromUser ? "human" : "bot"}
            </div>
            <div className="prose prose-sm dark:prose-invert leading-tight text-xs ml-3 break-words w-full overflow-clip">
              <Markdown remarkPlugins={[remarkGfm]}>
                {message.text.replaceAll("\n", "  \n")}
              </Markdown>
            </div>
          </div>
        ))}
    </div>
  );
}
