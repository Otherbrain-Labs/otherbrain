"use client";

import { loadModels } from "@/app/page";
import { loadModels as loadAuthorModels } from "@/app/[authorSlug]/page";

import { Column, ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
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

function SortHeader({
  column,
  title,
}: {
  column: Column<Model>;
  title: String;
}) {
  return (
    <Button
      variant="link"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="w-full justify-start p-0 relative group"
    >
      <span className="absolute left-0 flex items-center">
        <span
          className={cn({
            "font-bold": column.getIsSorted(),
          })}
        >
          {title}
        </span>
        {!column.getIsSorted() && (
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-50" />
        )}
        {column.getIsSorted() === "desc" && (
          <ArrowDown className="ml-2 h-4 w-4" />
        )}
        {column.getIsSorted() === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
      </span>
    </Button>
  );
}

export const columns: ColumnDef<Model>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortHeader column={column} title="Name" />,
    cell: ({ row }) => {
      const model = row.original;
      const href = `/${model.author.slug}/${model.slug}`;
      return (
        <Link className="hover:underline" href={href}>
          {model.name}
        </Link>
      );
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "stars",
    header: ({ column }) => <SortHeader column={column} title="Stars" />,
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
    header: ({ column }) => <SortHeader column={column} title="Updated" />,
    cell: ({ row }) => {
      const model = row.original;
      const date = model.lastModifiedDate;
      const formatted = dateFormatter.format(date);
      return <span>{formatted}</span>;
    },
    sortingFn: "datetime",
  },
];
