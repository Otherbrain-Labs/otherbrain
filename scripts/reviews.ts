import prisma from "../lib/prisma";
import reviews from "./data/reviews.json";

export async function load() {
  const [originalCount] = await prisma.$transaction([prisma.review.count()]);

  const user = await prisma.user.upsert({
    where: {
      email: "chappy@otherbrain.world",
    },
    update: {},
    create: {
      email: "chappy@otherbrain.world",
      name: "Chappy",
    },
  });

  let count = 0;
  for (const review of reviews) {
    try {
      const dbReview = await prisma.review.findFirst({
        where: {
          userId: user.id,
          externalUrl: review.externalUrl,
          model: {
            remoteId: review.remoteId,
          },
        },
      });
      if (dbReview) {
        continue;
      }
      const { remoteId, ...rest } = review;

      await prisma.review.create({
        data: {
          ...rest,
          model: {
            connect: {
              remoteId: review.remoteId,
            },
          },
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      console.log(`Added review`, review.remoteId);
      count++;
    } catch (error) {
      console.error(`Error adding review`, error, { review });
    }
  }
  console.log(
    `Added ${count} new reviews, ${count + originalCount} reviews total`
  );
}
