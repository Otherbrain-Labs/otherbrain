"use client";

import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { SearchIcon } from "lucide-react";
import { Column, Table } from "@tanstack/react-table";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

function compareParams(a: number | null, b: number | null) {
  if (a === null) return 1;
  if (b === null) return -1;
  return a - b;
}

function formatParams(value: number) {
  return value ? `${value}B` : "?";
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const paramColumn = table.getColumn("numParameters") as Column<TData, number>;

  return (
    <div className="flex items-center pb-2">
      <div className="flex space-x-3 items-center">
        <Input
          icon={<SearchIcon className="h-4 w-4 text-muted-foreground" />}
          iconPosition="left"
          placeholder="Search models..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm text-xs"
        />
        {paramColumn && (
          <DataTableFacetedFilter<TData, number>
            column={paramColumn}
            title="Parameters"
            compare={compareParams}
            format={formatParams}
          />
        )}
        <span className="text-xs text-muted-foreground">
          {table.getGlobalFacetedRowModel().rows.length} models
        </span>
      </div>

      <DataTableViewOptions table={table} />
    </div>
  );
}
