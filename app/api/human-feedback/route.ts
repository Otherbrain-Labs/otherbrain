import { z } from "zod";
import prisma from "@/lib/prisma";
import { randomBytes, scrypt as asyncScrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(asyncScrypt);

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
  quality: z.number().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const result = HumanFeedback.parse(body);

  // try to find model to link to feedback by iteratively removing extensions from modelName
  const parts = result.modelName.toLowerCase().split(".");
  // pop and skip "gguf" extension
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

  const salt = randomBytes(16).toString("hex");
  const editKey = randomBytes(16).toString("hex");
  const editKeyHash =
    salt + ":" + ((await scrypt(editKey, salt, 64)) as Buffer).toString("hex");

  console.log("juicy fruity", editKey, editKeyHash);

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
      quality: result.quality,
      editKeyHash,
    },
  });

  if (model) {
    const counts = await prisma.humanFeedback.aggregate({
      where: {
        model: {
          id: model.id,
        },
      },
      _count: true,
    });

    await prisma.model.update({
      where: { id: model.id },
      data: {
        numHumanFeedback: counts._count,
      },
    });
  }

  return new Response(
    JSON.stringify({ id: `${humanFeedback.numId}_${editKey}` }),
    {
      headers: { "content-type": "application/json" },
    }
  );
}
