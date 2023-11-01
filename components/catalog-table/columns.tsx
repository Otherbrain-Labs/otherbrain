"use client";

import { loadModels } from "@/app/page";
import { loadModels as loadAuthorModels } from "@/app/[authorSlug]/page";

import { Cell, Column, ColumnDef, Row } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
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
  lastModifiedDate: "Updated",
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
          <ChevronUp className="ml-1 h-3.5 w-3.5" />
        )}
        {column.getIsSorted() === "asc" && (
          <ChevronDown className="ml-1 h-3.5 w-3.5" />
        )}
      </span>
    </Button>
  );
}

function ScoreCell({ cell }: { cell: Cell<Model, unknown> }) {
  const v = cell.getValue();
  return (
    <div className="flex items-center">
      <span className="relative left-1 top-0.5">
        {typeof v === "number" ? `${v}` : "--"}
      </span>
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
          className="hover:underline max-w-[180px] inline-block truncate"
          href={href}
          title={`${model.name} by ${model.author.name}`}
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
    accessorKey: "lastModifiedDate",
    header: ({ column }) => <SortHeader column={column} />,
    cell: ({ row }) => {
      const model = row.original;
      const date = model.lastModifiedDate;
      const formatted = dateFormatter.format(date);
      return <span>{formatted}</span>;
    },
    sortingFn: "datetime",
    invertSorting: true,
  },
  {
    accessorKey: "numParameters",
    header: ({ column }) => <SortHeader column={column} />,
    invertSorting: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "average",
    header: ({ column }) => <SortHeader column={column} />,
    cell: ScoreCell,
    invertSorting: true,
  },
  {
    accessorKey: "arc",
    header: ({ column }) => <SortHeader column={column} />,
    cell: ScoreCell,
    invertSorting: true,
  },
  {
    accessorKey: "hellaswag",
    header: ({ column }) => <SortHeader column={column} />,
    cell: ScoreCell,
    invertSorting: true,
  },
  {
    accessorKey: "mmlu",
    header: ({ column }) => <SortHeader column={column} />,
    cell: ScoreCell,
    invertSorting: true,
  },
  {
    accessorKey: "truthfulqa",
    header: ({ column }) => <SortHeader column={column} />,
    cell: ScoreCell,
    invertSorting: true,
  },
];
