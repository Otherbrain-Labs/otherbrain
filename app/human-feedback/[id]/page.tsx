import Sample from "@/app/[authorSlug]/[modelSlug]/sample";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";

export default async function Home({ params }: { params: { id: string } }) {
  const [humanFeedback, count] = await Promise.all([
    prisma.humanFeedback.findUnique({
      where: { id: params.id },
      include: {
        messages: true,
        model: {
          include: { author: true },
        },
      },
    }),
    prisma.humanFeedback.count(),
  ]);

  if (!humanFeedback) {
    notFound();
  }

  const { model } = humanFeedback;

  return (
    <div className="mt-6 max-w-xl mb-20 mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-5xl mr-2 font-semibold truncate">
            {humanFeedback.createdAt.toLocaleString()}
          </h1>
        </div>

        <div className="flex items-center mt-1.5 text-muted-foreground">
          <div className="text-sm">
            {model && (
              <>
                <Link
                  className="hover:underline mr-3"
                  href={`${model.remoteId}`}
                >
                  {model.name} ({humanFeedback.modelName.replace(".gguf", "")})
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="text-xs p-3 border rounded">
        Thanks for adding this sample to Otherbrain Open Feedback (OOF), a free
        dataset of interactions with open models. It is small, but growing every
        day with great contributions like yours. Our hope is to accelerate open
        model training with user-curated training data and accelerate open model
        adoption with exciting samples.
        <label className="block py-3">
          Enhance your sample by selecting one or more categories:
        </label>
        <ToggleGroup type="multiple" className="justify-between block sm:flex">
          <ToggleGroupItem value="a" className="text-xs">
            Roleplay
          </ToggleGroupItem>
          <ToggleGroupItem value="b" className="text-xs">
            Facts
          </ToggleGroupItem>
          <ToggleGroupItem value="c" className="text-xs">
            History
          </ToggleGroupItem>
          <ToggleGroupItem value="d" className="text-xs">
            Coding
          </ToggleGroupItem>
          <ToggleGroupItem value="e" className="text-xs">
            Philosophy
          </ToggleGroupItem>
          <ToggleGroupItem value="f" className="text-xs">
            Romance
          </ToggleGroupItem>
          <ToggleGroupItem value="g" className="text-xs">
            NSFW
          </ToggleGroupItem>
        </ToggleGroup>
        <div className="flex flex-row-reverse">
          <Button className="mt-2">Submit</Button>
        </div>
      </div>

      <Sample humanFeedback={humanFeedback} hideDate />
    </div>
  );
}
