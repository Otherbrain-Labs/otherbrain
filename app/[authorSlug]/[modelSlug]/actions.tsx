"use server";

import { getServerSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteReview(id: string) {
  const session = await getServerSession();
  const userId = session?.user?.id;

  if (!userId) {
    return { message: "Session is required, please sign in." };
  }

  await prisma.review.delete({
    where: { id, userId },
  });

  revalidatePath("/");
}
