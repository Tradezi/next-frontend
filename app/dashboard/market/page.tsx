'use client';

import { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ColumnDef } from '@tanstack/react-table';

interface StockMetadata {
  symbol: string;
  comapny_name: string;
  currentPrice?: number;
}

interface PriceInfo {
  symbol: string;
  currentPrice: number;
}

// Define columns for the market data table
const columns: ColumnDef<StockMetadata>[] = [
  {
    accessorKey: 'symbol',
    header: 'Symbol'
  },
  {
    accessorKey: 'comapny_name',
    header: 'Name'
  },
  {
    accessorKey: 'currentPrice',
    header: 'Current Price',
    cell: ({ row }) => {
      const price = row.original.currentPrice;
      return price ? `₹${Number(price).toFixed(2)}` : 'Loading...';
    }
  }
];

const ITEMS_PER_PAGE = 10;

export default function MarketPage() {
  const [stocks, setStocks] = useState<StockMetadata[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all stock metadata
  useEffect(() => {
    fetch('/api/stock/metadata', {
      credentials: 'include',
      headers: {
        Accept: 'application/json'
      }
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch stock metadata');
        return response.json();
      })
      .then((data) => {
        setStocks(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Stock metadata error:', error);
        setIsLoading(false);
      });
  }, []);

  // Fetch current prices for visible stocks
  useEffect(() => {
    if (stocks.length === 0) return;

    // Get symbols for current page only
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const visibleStocks = stocks.slice(startIndex, endIndex);
    const symbols = visibleStocks.map((stock) => stock.symbol);

    fetch('/api/stock/price/bulk', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ symbols: symbols })
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch stock prices');
        return response.json();
      })
      .then((priceData) => {
        setStocks((prevStocks) => {
          return prevStocks.map((stock) => ({
            ...stock,
            currentPrice: priceData.find(
              (p: PriceInfo) => p.symbol === stock.symbol
            )?.currentPrice
          }));
        });
      })
      .catch((error) => {
        console.error('Stock prices error:', error);
      });
  }, [stocks.length, currentPage]); // Add currentPage back to dependencies

  // Get paginated data
  const getPaginatedData = () => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return stocks.slice(startIndex, endIndex);
  };

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Stock Market</h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                Buy Stock
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Buy Stock</h4>
                  <p className="text-sm text-muted-foreground">
                    Enter the details to place your order
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="symbol">Symbol</Label>
                    <Input
                      id="symbol"
                      className="col-span-2"
                      placeholder="AAPL"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="numOfStocks"
                      type="number"
                      className="col-span-2"
                      placeholder="1"
                    />
                  </div>
                  <Button
                    className="mt-2"
                    onClick={async () => {
                      const symbol = (
                        document.getElementById('symbol') as HTMLInputElement
                      ).value;
                      const quantity = (
                        document.getElementById(
                          'numOfStocks'
                        ) as HTMLInputElement
                      ).value;
                      if (!symbol || !quantity) {
                        alert('Please fill in both symbol and quantity.');
                        return;
                      }
                      try {
                        const response = await fetch('/api/order/create', {
                          method: 'POST',
                          credentials: 'include',
                          headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json'
                          },
                          body: JSON.stringify({
                            symbol: symbol.toUpperCase(),
                            numOfStocks: parseInt(quantity),
                            type: 'BUY'
                          })
                        });
                        if (!response.ok) {
                          const error = await response.json();
                          throw new Error(
                            error.message || 'Failed to place order'
                          );
                        }
                        alert('Order placed successfully!');
                        window.location.reload();
                      } catch (error) {
                        console.error('Error placing order:', error);
                        alert(
                          error instanceof Error
                            ? error.message
                            : 'Failed to place order. Please try again.'
                        );
                      }
                    }}
                  >
                    Place Order
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="mt-6">
          <DataTable
            columns={columns}
            data={stocks}
            searchKey="symbol"
            pagination={{
              currentPage,
              pageSize: ITEMS_PER_PAGE,
              totalItems: stocks.length,
              onPageChange: setCurrentPage
            }}
          />
        </div>
      </div>
    </PageContainer>
  );
}
