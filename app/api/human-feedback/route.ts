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

  // try to find model to link to feedback by iteratively removing extensions from modelName
  const parts = result.modelName.toLowerCase().split(".");
  // pop and skip if last part is "gguf"
  if (parts[parts.length - 1] == "gguf") {
    parts.pop();
  }
  var model = null;
  while (parts.length > 0 && model == null) {
    model = await prisma.model.findFirst({
      where: {
        slug: parts.join("."),
      },
      select: { id: true },
    });
    parts.pop();
  }

  // save with prisma
  const humanFeedback = await prisma.humanFeedback.create({
    data: {
      modelId: model?.id,
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
