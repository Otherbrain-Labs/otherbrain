import { Model } from "@/app/[authorRemoteId]/[modelRemoteId]/page";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type ScoreKey = keyof Pick<
  Model,
  "average" | "arc" | "hellaswag" | "mmlu" | "truthfulqa"
>;

export const scoreText: Record<ScoreKey, string> = {
  average: "Average",
  arc: "ARC",
  hellaswag: "HellaSwag",
  mmlu: "MMLU",
  truthfulqa: "TruthfulQA",
};

export const scoreDescription: Record<ScoreKey, string> = {
  average: "mean of the scores below",
  arc: "a set of simple science questions for kids",
  hellaswag:
    "a common sense evaluation that's easy for humans, tough for top models",
  mmlu: "a test measuring factual accuracy on various topics like math, history, etc",
  truthfulqa: "evaluates tendency to propagate prevalent online falsehoods",
};

export const scoreHref: Partial<Record<ScoreKey, string>> = {
  arc: "https://arxiv.org/abs/1803.05457",
  hellaswag: "https://arxiv.org/abs/1905.07830",
  mmlu: "https://arxiv.org/abs/2009.03300",
  truthfulqa: "https://arxiv.org/abs/2109.07958",
};

export function ScoreTooltip({
  score,
  children,
  className,
}: {
  score: ScoreKey;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger className={className} asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent>{scoreDescription[score]}</TooltipContent>
    </Tooltip>
  );
}
