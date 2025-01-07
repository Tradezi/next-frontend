'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Input } from './input';
import { Button } from './button';
import { ScrollArea, ScrollBar } from './scroll-area';
import { useState } from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  pagination?: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  pagination
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState('');

  // Get paginated subset of data
  const startIndex =
    (pagination?.currentPage ?? 0) * (pagination?.pageSize ?? 10);
  const endIndex = startIndex + (pagination?.pageSize ?? 10);
  const paginatedData = data.slice(startIndex, endIndex);

  const table = useReactTable({
    data: paginatedData, // Use paginated data instead of all data
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase();
      const value = row.getValue(searchKey) as string;
      return value?.toLowerCase().includes(search);
    },
    state: {
      globalFilter,
      pagination: {
        pageIndex: pagination?.currentPage ?? 0,
        pageSize: pagination?.pageSize ?? 10
      }
    },
    manualPagination: true,
    pageCount: Math.ceil(
      (pagination?.totalItems ?? 0) / (pagination?.pageSize ?? 10)
    )
  });

  /* this can be used to get the selectedrows 
  console.log("value", table.getFilteredSelectedRowModel()); */

  return (
    <>
      <Input
        placeholder={`Search ${searchKey}...`}
        value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
        onChange={(event) =>
          table.getColumn(searchKey)?.setFilterValue(event.target.value)
        }
        className="mb-4 w-full"
      />
      <ScrollArea
        className={`rounded-md border ${
          table.getRowModel().rows.length <= 5
            ? 'h-fit max-h-[300px]'
            : 'h-[calc(80vh-220px)] md:h-[calc(80dvh-200px)]'
        }`}
      >
        <Table className="relative">
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
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {pagination && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 0}
          >
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {pagination.currentPage + 1} of{' '}
            {Math.ceil(pagination.totalItems / pagination.pageSize)}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            disabled={
              pagination.currentPage ===
              Math.ceil(pagination.totalItems / pagination.pageSize) - 1
            }
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
}
