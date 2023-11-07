import type { Model } from "./page";
import {
  ScoreKey,
  scoreText,
  scoreDescription,
  scoreHref,
} from "@/components/scores";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export default function Scores({ model }: { model: Model }) {
  const filtered = Object.keys(scoreText).filter(
    (key) => model[key as ScoreKey]
  );
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="max-w-xl flex space-x-5">
          {filtered.map((key) => (
            <div className="max-w-[200px]" key={key}>
              <div className="text-sm font-medium">{key}</div>
              <div className="text-left text-xl">{model[key as ScoreKey]}</div>
            </div>
          ))}
        </div>
      </TooltipTrigger>

      <TooltipContent className="space-y-2 w-100 max-w-md flex flex-col">
        {filtered.map((key) => (
          <div className="text-xs" key={key}>
            {scoreHref[key as ScoreKey] ? (
              <Link
                href={scoreHref[key as ScoreKey]!}
                rel="noopener noreferrer"
                className="font-medium underline"
              >
                {scoreText[key as ScoreKey]}
              </Link>
            ) : (
              <span className="font-medium underline">
                {scoreText[key as ScoreKey]}
              </span>
            )}
            :{" "}
            <span className="text-left">
              {scoreDescription[key as ScoreKey]}
            </span>
          </div>
        ))}
      </TooltipContent>
    </Tooltip>
  );
}
