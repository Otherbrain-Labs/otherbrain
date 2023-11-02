import prisma from "@/lib/prisma";
import Catalog from "@/components/catalog";

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
          sourced from the Open LLM Leaderboard, Hugging Face, Simon Willison,
          TheBloke.
        </p>
        <Catalog models={models} />
      </div>
    </div>
  );
}
