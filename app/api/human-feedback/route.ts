import { z } from "zod";
import prisma from "@/lib/prisma";

const HumanFeedback = z.object({
  messages: z.array(
    z.object({
      fromUser: z.boolean(),
      text: z.string(),
    })
  ),
  modelName: z.string(),
  promptTemplate: z.string(),
  lastSystemPrompt: z.string(),
  client: z.string(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const result = HumanFeedback.parse(body);

  // save with prisma
  const humanFeedback = await prisma.humanFeedback.create({
    data: {
      modelName: result.modelName,
      promptTemplate: result.promptTemplate,
      lastSystemPrompt: result.lastSystemPrompt,
      client: result.client,
      messages: {
        create: result.messages.map((message, i) => ({
          index: i,
          fromUser: message.fromUser,
          text: message.text,
        })),
      },
    },
  });

  return new Response(JSON.stringify({ id: humanFeedback.id }), {
    headers: { "content-type": "application/json" },
  });
}
