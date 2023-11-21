import prisma from "@/lib/prisma";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import Link from "next/link";

function loadHumanFeedback() {
  return prisma.humanFeedback.count();
}

export default async function OtherbrainHFPage() {
  const count = await loadHumanFeedback();
  return (
    <div className="flex h-full w-full">
      <div className="h-full w-full flex flex-col justify-center mb-20  max-w-lg">
        <h1 className="text-4xl sm:text-6xl pt-16 font-bold">Otherbrain HF</h1>
        <p className="text-lg pt-3 pb-0">
          Free human feedback dataset for training open models
        </p>

        <h2 className="tet-2xl font-bold mt-8">Why?</h2>
        <p className="text-sm pt-2 pb-0">
          Commercial chatbots get to train on feedback from live users on their
          platform. We want open models and local AI systems to get the same
          opportunity.
        </p>
        <p className="text-sm pt-2 pb-0">
          In the near future we'll significantly amplify our cognitive
          capability with AI. To some degree we already do this with search
          engines and some of the early chatbots. In the near future we'll be
          10x smarter by fluidly passing data back and forth between our brains
          and models. However, the AI systems must be private and secure for us
          to feel comfortable enough using it. Open models that we can run
          locally on our own devices offer a promissing path to this future.
        </p>

        <h2 className="tet-2xl font-bold mt-8">Contribute chats</h2>
        <p className="text-sm pt-2 pb-0">
          To contribute data, use the <span className="inline-block">👍👎</span>{" "}
          feedback buttons in a supported client like{" "}
          <Link
            className="hover:underline"
            href="https://www.freechat.run"
            rel="noopener noreferrer"
          >
            FreeChat
            <ExternalLinkIcon className="inline mx-1 h-3 w-3 relative -top-0.5" />
          </Link>{" "}
          (others coming soon).
        </p>

        <h2 className="tet-2xl font-bold mt-8">
          Collect anonymous data in your app
        </h2>
        <p className="text-sm pt-2 pb-0">
          For app developers, Otherbrain HF is an easy path to integrate
          anonymous <span className="inline-block">👍👎</span> feedback
          collection in your app. Just POST a chat then redirect to have the
          user label it. If you have an app you'd like to add, contact us for
          help. We'll make sure your client is correctly linked and attributed.
        </p>

        <h2 className="tet-2xl font-bold mt-8">Get the data</h2>
        <p className="text-sm pt-2 pb-0">
          Are you training an open model that could benefit from the Otherbrain
          HF dataset? It's small right now ({count} chats) but growing every
          day. Contact us for access. When the dataset grows enough to be
          useful, we'll add automated dumps to Hugging Face.
        </p>
      </div>
    </div>
  );
}
