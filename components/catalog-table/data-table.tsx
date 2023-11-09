"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useRef, useState } from "react";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { useRouter, useSearchParams } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: searchParams.get("sortingId") || "lastModifiedDate",
      desc: searchParams.get("sortingDesc") === "true",
    },
  ]);

  const columnFiltersParam = searchParams.get("columnFilters");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    columnFiltersParam ? JSON.parse(columnFiltersParam) : []
  );

  const pageIndex = parseInt(searchParams.get("pageIndex") || "0", 10);
  const skipPageResetRef = useRef(false);
  const [pagination, setPagination] = useState({
    pageIndex,
    pageSize: 30,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onPaginationChange: setPagination,
    autoResetPageIndex: !skipPageResetRef.current,
  });

  const [tableState, setTableState] = useState(table.initialState);

  table.setOptions((prev) => ({
    ...prev,
    state: { ...tableState, sorting, columnFilters, pagination },
    onStateChange: setTableState,
  }));

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (
      sorting.length > 0 &&
      !(sorting[0].id === "lastModifiedDate" && !sorting[0].desc)
    ) {
      params.set("sortingId", sorting[0].id);
      params.set("sortingDesc", sorting[0].desc ? "true" : "false");
    } else {
      params.delete("sortingId");
      params.delete("sortingDesc");
    }
    if (columnFilters.length > 0) {
      params.set("columnFilters", JSON.stringify(columnFilters));
    } else {
      params.delete("columnFilters");
    }
    if (pagination.pageIndex) {
      params.set("pageIndex", pagination.pageIndex.toString());
    } else {
      params.delete("pageIndex");
    }

    skipPageResetRef.current = true;
    router.replace(`?${params.toString()}`, { scroll: false });

    if (params.toString() === searchParams.toString()) {
      skipPageResetRef.current = false;
    } else {
      skipPageResetRef.current = true;
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [pagination, columnFilters, sorting, searchParams, router]);

  return (
    <div>
      <DataTableToolbar table={table} />
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </div>
  );
}
