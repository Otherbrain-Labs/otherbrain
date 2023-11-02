import prisma from "@/lib/prisma";
import Catalog from "@/components/catalog";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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
    <div className="flex h-full">
      <div className="w-screen h-full flex flex-col justify-center">
        <h1 className="text-6xl pt-16 font-semibold">LLM Catalog</h1>
        <p className="text-sm pt-4 pb-0 max-w-lg">
          Browse reviews and benchmarks to find the best model for your use
          case. Write reviews and share your experiences. Data graciously (open)
          sourced from the{" "}
          <Link
            href="https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline group"
          >
            Open LLM Leaderboard
            <ArrowUpRight className="hidden h-3 w-3 group-hover:inline-block" />
          </Link>
          ,{" "}
          <Link
            href="https://huggingface.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline group"
          >
            Hugging Face
            <ArrowUpRight className="hidden h-3 w-3 group-hover:inline-block" />
          </Link>
          ,{" "}
          <Link
            href="https://github.com/simonw/scrape-huggingface-models/blob/main/TheBloke.json"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline group"
          >
            Simon Willison
            <ArrowUpRight className="hidden h-3 w-3 group-hover:inline-block" />
          </Link>
          ,{" "}
          <Link
            href="https://huggingface.co/TheBloke"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline group"
          >
            TheBloke
            <ArrowUpRight className="hidden h-3 w-3 group-hover:inline-block" />
          </Link>
          .
        </p>
        <Catalog models={models} />
      </div>
    </div>
  );
}
