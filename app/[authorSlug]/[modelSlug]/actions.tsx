import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";

export async function deleteReview(id: string) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return { message: "Session is required, please sign in." };
  }

  const deleted = await prisma.review.delete({
    where: {
      id,
      user: {
        id: session.user.id,
      },
    },
  });
}
