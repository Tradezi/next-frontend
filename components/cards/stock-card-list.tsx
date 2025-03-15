import { ScrollArea } from '@/components/ui/scroll-area';
import { StockCard, StockCardSkeleton } from './stock-card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

interface StockMetadata {
  symbol: string;
  comapny_name: string;
  currentPrice?: number;
}

interface StockCardListProps {
  stocks: StockMetadata[];
  isLoading: boolean;
  onStockClick: (stock: StockMetadata) => void;
  onFilteredDataChange?: (data: StockMetadata[]) => void;
  searchKey?: string;
  pagination?: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
}

export function StockCardList({
  stocks,
  isLoading,
  onStockClick,
  onFilteredDataChange,
  searchKey = 'symbol',
  pagination
}: StockCardListProps) {
  const [globalFilter, setGlobalFilter] = useState('');

  // Filter stocks based on search term
  const filteredStocks = stocks.filter((stock) => {
    const value = stock[searchKey as keyof StockMetadata]
      ?.toString()
      .toLowerCase();
    return (
      globalFilter === '' ||
      globalFilter.length < 4 ||
      (globalFilter.length >= 4 && value?.includes(globalFilter.toLowerCase()))
    );
  });

  // Paginate the filtered results
  const startIndex =
    (pagination?.currentPage ?? 0) * (pagination?.pageSize ?? 10);
  const endIndex = startIndex + (pagination?.pageSize ?? 10);
  const paginatedStocks = pagination
    ? filteredStocks.slice(startIndex, endIndex)
    : filteredStocks;

  // Notify parent of visible data changes
  useEffect(() => {
    onFilteredDataChange?.(paginatedStocks);
  }, [globalFilter, pagination?.currentPage]);

  // Reset to first page when filter changes
  useEffect(() => {
    if (pagination?.onPageChange) {
      pagination.onPageChange(0);
    }
  }, [globalFilter]);

  if (isLoading) {
    return (
      <div className="h-full w-full space-y-4">
        <Input
          placeholder={`Search ${searchKey
            ?.replace(/([A-Z])/g, ' $1')
            .trim()
            .toLowerCase()}... (type at least 4 characters)`}
          disabled
          className="mb-2 w-full"
        />
        <div className="overflow-hidden rounded-lg border border-border bg-card p-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <StockCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center rounded-lg border border-none bg-card py-8 text-center">
        <p className="mb-4 text-sm text-muted-foreground">
          No stocks available.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full space-y-4">
      <Input
        placeholder={`Search ${searchKey
          ?.replace(/([A-Z])/g, ' $1')
          .trim()
          .toLowerCase()}... (type at least 4 characters)`}
        value={globalFilter}
        onChange={(event) => setGlobalFilter(event.target.value)}
        className="mb-2 w-full"
      />
      <ScrollArea className="h-[calc(80vh-220px)] w-full rounded-lg border border-border bg-card p-2">
        <div>
          {paginatedStocks.map((stock) => (
            <StockCard
              key={stock.symbol}
              stock={stock}
              onClick={onStockClick}
            />
          ))}
        </div>
      </ScrollArea>

      {pagination && (
        <div className="flex flex-col-reverse items-center justify-between gap-2 py-2 sm:flex-row">
          <div className="text-sm text-muted-foreground">
            Page {pagination.currentPage + 1} of{' '}
            {Math.ceil(filteredStocks.length / pagination.pageSize)}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                pagination.onPageChange(pagination.currentPage - 1)
              }
              disabled={pagination.currentPage === 0}
              className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-4"
            >
              <span className="sr-only sm:not-sr-only">Previous</span>
              <span className="sm:hidden">←</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                pagination.onPageChange(pagination.currentPage + 1)
              }
              disabled={
                pagination.currentPage ===
                Math.ceil(filteredStocks.length / pagination.pageSize) - 1
              }
              className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-4"
            >
              <span className="sr-only sm:not-sr-only">Next</span>
              <span className="sm:hidden">→</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
