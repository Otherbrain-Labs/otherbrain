import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default async function Home({ params }: { params: { id: string } }) {
  const [humanFeedback, count] = await Promise.all([
    prisma.humanFeedback.findUnique({
      where: { id: params.id },
      include: {
        messages: true,
        model: {
          include: { author: true },
        },
      },
    }),
    prisma.humanFeedback.count(),
  ]);

  if (!humanFeedback) {
    notFound();
  }

  const messages = humanFeedback.messages.sort((a, b) => a.index - b.index);
  const { model } = humanFeedback;

  return (
    <div className="mt-6 max-w-xl mb-20">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-5xl mr-2 font-semibold">
            Human Feedback 👍
          </h1>
        </div>
        <div className="flex items-center mt-1.5">
          <div className="text-sm">
            {humanFeedback.createdAt.toDateString()},{" "}
            {model && (
              <>
                <Link href={`/${model.author.slug}/${model.slug}`}>
                  {model.name}
                </Link>
                ,{" "}
              </>
            )}
            {humanFeedback.modelName}
          </div>
        </div>
      </div>

      <div className="mt-4 border rounded p-4 space-y-2 text-xs">
        <span className="italic text-muted-foreground">
          <div className="font-bold">System prompt</div>
          <Markdown className="prose prose-sm" remarkPlugins={[remarkGfm]}>
            {humanFeedback.lastSystemPrompt}
          </Markdown>
        </span>
        {messages.map((message) => (
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
    </div>
  );
}
