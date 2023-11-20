"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function update(humanFeedbackId: string, formData: FormData) {
  console.log("update", humanFeedbackId, formData);
  const tags = formData.getAll("tags").filter((tag) => tag !== "") as string[];
  console.log("update tags", tags);
  const quality = parseInt(formData.get("stars") as string, 10);

  console.log("all tags", await prisma.humanFeedbackTag.findMany());

  const updated = await prisma.humanFeedback.update({
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
      // quality: quality || undefined,
    },
  });

  console.log(updated);

  revalidatePath("/");
}
