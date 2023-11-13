import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function Home({ params }: { params: { id: string } }) {
  const humanFeedback = await prisma.humanFeedback.findUnique({
    where: { id: params.id },
    include: { messages: true },
  });

  if (!humanFeedback) {
    notFound();
  }

  const messages = humanFeedback.messages.sort((a, b) => a.index - b.index);

  return (
    <div className="mt-6 max-w-lg">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-5xl mr-2 font-semibold">
            Human Feedback 👍
          </h1>
        </div>
        <div className="flex items-center mt-1.5">
          <div className="text-sm">
            {humanFeedback.createdAt.toDateString()}, {humanFeedback.modelName}
          </div>
        </div>
      </div>

      <div className="mt-4 border border-dashed rounded p-4 space-y-2 text-xs">
        <div className="text-bold">System prompt</div>
        <div>{humanFeedback.lastSystemPrompt}</div>{" "}
      </div>
      <div className="mt-4 border border-dashed rounded p-4 space-y-2 text-xs">
        {messages.map((message) => (
          <div className="flex">
            {message.fromUser ? "Human" : "Bot"}: {message.text}
          </div>
        ))}
      </div>
    </div>
  );
}
