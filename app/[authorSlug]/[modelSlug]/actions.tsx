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

export async function createReview(modelId: string, formData: FormData) {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return { message: "Session is required, please sign in." };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return { message: "No user found" };
  }

  const result = await prisma.review.create({
    data: {
      modelId: modelId,
      userId: user.id,
      text: formData.get("text") as string,
      stars: parseInt(formData.get("stars") as string, 10),
    },
  });

  const avgStarsAndCount = await prisma.review.aggregate({
    where: {
      modelId: modelId,
    },
    _avg: {
      stars: true,
    },
    _count: {
      stars: true,
    },
  });

  // update the model with the new average stars and count
  await prisma.model.update({
    where: {
      id: modelId,
    },
    data: {
      avgStars: avgStarsAndCount._avg.stars,
      numReviews: avgStarsAndCount._count.stars,
    },
  });

  revalidatePath("/");
  return result;
}
