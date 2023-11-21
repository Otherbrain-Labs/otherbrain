"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function update(humanFeedbackId: string, formData: FormData) {
  const tags = formData
    .getAll("tags")
    .filter((tag) => tag !== "")
    .map((tag) => tag.toString().toLowerCase());
  const quality = parseInt(formData.get("stars") as string, 10);

  await prisma.humanFeedback.update({
    where: {
      id: humanFeedbackId,
    },
    data: {
      tags: {
        connectOrCreate: tags.map((tag) => ({
          where: { name: tag },
          create: { name: tag },
        })),
        set: tags.map((tag) => ({ name: tag })),
      },
      quality: quality || undefined,
      nsfw: formData.get("nsfw") === "on",
    },
  });

  // purge unlinked tags
  await prisma.humanFeedbackTag.deleteMany({
    where: {
      OR: [
        {
          humanFeedbacks: {
            none: {},
          },
        },
        { name: "" },
      ],
    },
  });

  revalidatePath("/");
}
