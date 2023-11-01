"use client";

import { loadModels } from "@/app/page";
import { loadModels as loadAuthorModels } from "@/app/[authorSlug]/page";

import { Cell, Column, ColumnDef, Row } from "@tanstack/react-table";
import { Button } from "../ui/button";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Star from "../ui/star";

type Models =
  | Awaited<ReturnType<typeof loadModels>>
  | Awaited<ReturnType<typeof loadAuthorModels>>;

type Model = Models[number];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const idToTitle: Record<string, string> = {
  name: "Name",
  stars: "Rating",
  lastDateModified: "Updated",
  numParameters: "Parameters",
  average: "Average",
  arc: "ARC",
  hellaswag: "HellaSwag",
  mmlu: "MMLU",
  truthfulqa: "TruthfulQA",
};

function SortHeader({ column }: { column: Column<Model> }) {
  return (
    <Button
      variant="link"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="w-full justify-start p-0 relative group text-xs"
    >
      <span className="opacity-0" aria-hidden>
        {idToTitle[column.id]}
      </span>
      <span className="absolute left-0 flex items-center group-hover:underline">
        {idToTitle[column.id]}

        {column.getIsSorted() === "desc" && (
          // <ArrowDown className="ml-2 h-3 w-3" />
          <ChevronDown className="ml-1 h-3.5 w-3.5" />
        )}
        {column.getIsSorted() === "asc" && (
          // <ArrowUp className="ml-2 h-3 w-3" />
          <ChevronUp className="ml-1 h-3.5 w-3.5" />
        )}
      </span>
    </Button>
  );
}

function ScoreCell({ cell }: { cell: Cell<Model, Number | undefined> }) {
  const v = cell.getValue();
  return (
    <div className="flex items-center">
      <span className="relative left-1 top-0.5">{v ? `${v}` : "--"}</span>
    </div>
  );
}

export const columns: ColumnDef<Model>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortHeader column={column} />,
    cell: ({ row }) => {
      const model = row.original;
      const href = `/${model.author.slug}/${model.slug}`;
      return (
        <Link
          className="hover:underline max-w-[200px] inline-block truncate"
          href={href}
        >
          {model.name}
        </Link>
      );
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "stars",
    header: ({ column }) => <SortHeader column={column} />,
    cell: ({ row }) => {
      const model = row.original;
      return (
        <div className="flex items-center">
          <Star filled />
          <span className="relative left-1 top-0.5">{4.96}</span>
        </div>
      );
    },
    invertSorting: true,
  },
  {
    accessorKey: "lastDateModified",
    header: ({ column }) => <SortHeader column={column} />,
    cell: ({ row }) => {
      const model = row.original;
      const date = model.lastModifiedDate;
      const formatted = dateFormatter.format(date);
      return <span>{formatted}</span>;
    },
    sortingFn: "datetime",
  },
  {
    accessorKey: "numParameters",
    header: ({ column }) => <SortHeader column={column} />,
  },
  {
    accessorKey: "average",
    header: ({ column }) => <SortHeader column={column} />,
    cell: ScoreCell,
  },
  {
    accessorKey: "arc",
    header: ({ column }) => <SortHeader column={column} />,
    cell: ScoreCell,
  },
  {
    accessorKey: "hellaswag",
    header: ({ column }) => <SortHeader column={column} />,
    cell: ScoreCell,
  },
  {
    accessorKey: "mmlu",
    header: ({ column }) => <SortHeader column={column} />,
    cell: ScoreCell,
  },
  {
    accessorKey: "truthfulqa",
    header: ({ column }) => <SortHeader column={column} />,
    cell: ScoreCell,
  },
];
