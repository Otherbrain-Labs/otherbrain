import prisma from "@/lib/prisma";
import Catalog from "@/components/catalog";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ExternalLinkIcon } from "@radix-ui/react-icons";

export async function loadModels() {
  const models = await prisma.model.findMany({
    include: {
      author: true,
    },
    orderBy: {
      lastModifiedDate: "desc",
    },
  });
  return models;
}

export default async function Home() {
  const models = await loadModels();

  return (
    <div className="flex h-full w-full">
      <div className="h-full w-full flex flex-col justify-center">
        <h1 className="text-4xl sm:text-6xl pt-16 font-semibold">
          LLM Catalog
        </h1>
        <p className="text-sm pt-4 pb-0 max-w-lg">
          Browse reviews and benchmarks to find the best model for your use
          case. Write a review and share your experience. Data graciously (open)
          sourced from the{" "}
          <Link
            href="https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline group"
          >
            Open LLM Leaderboard
          </Link>
          ,{" "}
          <Link
            href="https://huggingface.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline group"
          >
            Hugging Face
          </Link>
          ,{" "}
          <Link
            href="https://github.com/simonw"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline group"
          >
            Simon Willison
          </Link>
          ,{" "}
          <Link
            href="https://huggingface.co/TheBloke"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline group"
          >
            TheBloke
          </Link>
          .
        </p>
        <Catalog models={models} />
      </div>
    </div>
  );
}
