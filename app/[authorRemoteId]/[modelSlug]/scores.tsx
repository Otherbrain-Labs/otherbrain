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
        <div className="max-w-xl flex space-x-6">
          {filtered.map((key) => (
            <div className="max-w-[200px]" key={key}>
              <div className="text-left text-xl text-primary">
                {model[key as ScoreKey]}
              </div>
              <div className="text-sm text-muted-foreground leading-none">
                {key}
              </div>
            </div>
          ))}
        </div>
      </TooltipTrigger>

      <TooltipContent className="py-3 w-100 max-w-md flex flex-col">
        {filtered.map((key) => (
          <div className="text-xs py-0.5" key={key}>
            {scoreHref[key as ScoreKey] ? (
              <Link
                href={scoreHref[key as ScoreKey]!}
                rel="noopener noreferrer"
                className="font-semibold"
              >
                {scoreText[key as ScoreKey]}
              </Link>
            ) : (
              <span className="font-semibold">
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
