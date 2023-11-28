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
        {humanFeedback.lastSystemPrompt}
      </Markdown>
      <table className="table-auto border-separate">
        <tbody>
          {messages
            .sort((a, b) => a.index - b.index)
            .map((message, i) => (
              <tr key={message.id}>
                <td align="right" valign="top">
                  <div className="font-semibold italic row-auto">
                    {message.fromUser ? "human" : "bot"}
                  </div>
                </td>
                <td align="left" valign="top">
                  <Markdown
                    className={cn(
                      "prose prose-sm dark:prose-invert leading-tight text-xs ml-2 break-words w-[92%]",
                      {
                        "mb-3": i !== humanFeedback.messages.length - 1,
                      }
                    )}
                    remarkPlugins={[remarkGfm]}
                  >
                    {message.text}
                  </Markdown>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
