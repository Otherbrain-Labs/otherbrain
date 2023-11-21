import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

type StarProps = {
  filled: boolean;
  className?: string;
};

export default function MyStar({ filled, className }: StarProps) {
  return (
    <Star
      className={cn("w-4 h-4 stroke-none relative -top-px", className, {
        "fill-amber-400": filled,
        "fill-gray-400": !filled,
      })}
    />
  );
}
