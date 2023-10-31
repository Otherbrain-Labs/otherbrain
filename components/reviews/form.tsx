import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { revalidatePath } from "next/cache";
import StarRater from "@/components/ui/star-rater";

export default function ReviewsForm({ modelId }: { modelId: string }) {
  async function create(formData: FormData) {
    "use server";

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

    revalidatePath("/");
    return result;
  }

  return (
    <form
      action={create}
      className="flex flex-col bg-muted space-y-4 px-4 py-8 sm:px-16"
    >
      <div>
        <label
          htmlFor="stars"
          className="block text-xs text-muted-foreground uppercase"
        >
          Stars
        </label>
        <StarRater rating={2} />
      </div>

      <div>
        <label
          htmlFor="text"
          className="block text-xs text-muted-foreground uppercase"
        >
          Review
        </label>
        <textarea
          id="text"
          name="text"
          placeholder="Your review"
          required
          className="mt-1 block w-full appearance-none rounded-md border border-border px-3 py-2 placeholder-muted-foreground focus:border-accent focus:outline-none focus:ring-accent sm:text-sm"
        />
      </div>

      <button
        type="submit"
        className={`${"border-border bg-background text-foreground hover:bg-primary hover:text-primary-foreground"} flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
      >
        Submit
      </button>
    </form>
  );
}
