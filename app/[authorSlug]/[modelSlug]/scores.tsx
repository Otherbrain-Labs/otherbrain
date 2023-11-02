import { Button } from "@/components/ui/button";
import type { Model } from "./page";
import { ScoreKey, scoreText, scoreDescription } from "@/components/scores";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { QuestionMarkIcon } from "@radix-ui/react-icons";
import { InfoIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";

export default function Scores({ model }: { model: Model }) {
  const filtered = Object.keys(scoreText).filter(
    (key) => model[key as ScoreKey]
  );
  return (
    <Popover>
      <div className="max-w-xl flex space-x-5">
        {filtered.map((key) => (
          <div className="max-w-[200px]" key={key}>
            <div className="text-sm font-medium">{key}</div>
            <div className="text-left text-xl">{model[key as ScoreKey]}</div>
          </div>
        ))}
        <PopoverTrigger asChild>
          {/* info button */}
          <Button
            variant="outline"
            className="h-6 w-6 rounded-full p-1 text-xs font-bold"
          >
            ?
          </Button>
        </PopoverTrigger>
      </div>

      <PopoverContent className="space-y-2 w-100 max-w-md flex flex-col">
        {filtered.map((key) => (
          <div className="text-xs" key={key}>
            <span className="font-medium underline">
              {scoreText[key as ScoreKey]}
            </span>
            :{" "}
            <span className="text-left">
              {scoreDescription[key as ScoreKey]}
            </span>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
