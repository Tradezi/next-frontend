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
import { useState, useEffect } from 'react';

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
  onFilteredDataChange?: (data: TData[]) => void;
  onRowClick?: (data: TData) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  pagination,
  onFilteredDataChange,
  onRowClick
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState('');

  // First filter the entire dataset
  const filteredData = data.filter((item) => {
    const value = (item as any)[searchKey]?.toString().toLowerCase();
    return globalFilter === '' || value?.includes(globalFilter.toLowerCase());
  });

  // Then paginate the filtered results
  const startIndex =
    (pagination?.currentPage ?? 0) * (pagination?.pageSize ?? 10);
  const endIndex = startIndex + (pagination?.pageSize ?? 10);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination: {
        pageIndex: pagination?.currentPage ?? 0,
        pageSize: pagination?.pageSize ?? 10
      }
    },
    manualPagination: true,
    pageCount: Math.ceil(filteredData.length / (pagination?.pageSize ?? 10))
  });

  // Notify parent of visible data changes
  useEffect(() => {
    onFilteredDataChange?.(paginatedData);
  }, [globalFilter, pagination?.currentPage]);

  // Reset to first page when filter changes
  useEffect(() => {
    if (pagination?.onPageChange) {
      pagination.onPageChange(0);
    }
  }, [globalFilter]);

  return (
    <>
      <Input
        placeholder={`Search ${searchKey}...`}
        value={globalFilter}
        onChange={(event) => setGlobalFilter(event.target.value)}
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
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onRowClick?.(row.original)}
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
            {Math.ceil(filteredData.length / pagination.pageSize)}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            disabled={
              pagination.currentPage ===
              Math.ceil(filteredData.length / pagination.pageSize) - 1
            }
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
}
