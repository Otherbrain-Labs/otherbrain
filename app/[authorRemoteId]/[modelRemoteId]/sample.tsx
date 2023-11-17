import Link from "next/link";
import { HumanFeedback } from "./samples";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

type SampleProps = {
  humanFeedback: HumanFeedback;
  hideDate?: boolean;
};

export default async function Sample({ humanFeedback, hideDate }: SampleProps) {
  const messages = humanFeedback.messages.sort((a, b) => a.index - b.index);

  return (
    <div
      key={humanFeedback.id}
      className="mt-4 border rounded p-4 space-y-4 leading-tight text-xs"
    >
      {!hideDate && (
        <div className="flex items-center justify-between mb-3">
          <Link
            className="hover:underline"
            href={`/human-feedback/${humanFeedback.id}`}
          >
            {humanFeedback.createdAt.toLocaleDateString()}
          </Link>
        </div>
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
                  <div className="font-bold italic row-auto">
                    {message.fromUser ? "human" : "bot"}
                  </div>
                </td>
                <td align="left" valign="top">
                  <Markdown
                    className={cn(
                      "prose prose-sm dark:prose-invert leading-tight text-xs ml-2",
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
