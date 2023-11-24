"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function compare(
  suppliedPassword?: string | null,
  storedPassword?: string | null
): Promise<boolean> {
  if (!suppliedPassword || !storedPassword) return false;
  const [salt, hashedPassword] = storedPassword.split(":");
  const hashedPasswordBuf = Buffer.from(hashedPassword, "hex");
  const suppliedPasswordBuf = (await scryptAsync(
    suppliedPassword,
    salt,
    64
  )) as Buffer;
  return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
}

export async function update(humanFeedbackId: string, formData: FormData) {
  const tags = formData
    .getAll("tags")
    .filter((tag) => tag !== "")
    .map((tag) => tag.toString().toLowerCase());
  const quality = parseInt(formData.get("stars") as string, 10);

  const humanFeedback = await prisma.humanFeedback.findUnique({
    where: {
      id: humanFeedbackId,
    },
  });

  if (!humanFeedback) {
    throw new Error("Human feedback not found");
  }

  const editKey = cookies().get(`edit-key-${humanFeedback.numId}`)?.value;

  if (!(await compare(editKey, humanFeedback.editKeyHash))) {
    throw new Error("Edit key does not match");
  }

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
