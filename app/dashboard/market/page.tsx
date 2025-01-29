'use client';

import { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ColumnDef } from '@tanstack/react-table';
import { Modal } from '@/components/ui/modal';
import axios from 'axios';

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

// Create a base axios instance with common config
const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_FLASK_BACKEND_URL ||
    'https://backend.tradezi.co.in',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default function MarketPage() {
  const [stocks, setStocks] = useState<StockMetadata[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState<StockMetadata | null>(
    null
  );

  // Fetch all stock metadata
  useEffect(() => {
    api
      .get('/stock/metadata')
      .then((response) => {
        setStocks(response.data);
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

    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const visibleStocks = stocks.slice(startIndex, endIndex);
    const symbols = visibleStocks.map((stock) => stock.symbol);

    api
      .post('/stock/price/bulk', { symbols: symbols })
      .then((response) => {
        setStocks((prevStocks) => {
          return prevStocks.map((stock) => ({
            ...stock,
            currentPrice: response.data.find(
              (p: PriceInfo) => p.symbol === stock.symbol
            )?.currentPrice
          }));
        });
      })
      .catch((error) => {
        console.error('Stock prices error:', error);
      });
  }, [stocks.length, currentPage]);

  // Get paginated data
  const getPaginatedData = () => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return stocks.slice(startIndex, endIndex);
  };

  // Add placeOrder function
  const placeOrder = async (type: 'BUY' | 'SELL') => {
    const quantity = (
      document.getElementById('numOfStocks') as HTMLInputElement
    ).value;
    if (!selectedStock?.symbol || !quantity) {
      alert('Please enter quantity.');
      return;
    }
    try {
      await api.post('/order/create', {
        symbol: selectedStock.symbol,
        numOfStocks: parseInt(quantity),
        type: type
      });
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
  };

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Stock Market</h2>
        </div>

        <div className="mt-6">
          <DataTable
            columns={columns}
            data={stocks}
            searchKey="symbol"
            onRowClick={(stock) => setSelectedStock(stock)}
            onFilteredDataChange={(filteredData) => {
              const symbols = filteredData.map((stock) => stock.symbol);

              api
                .post('/stock/price/bulk', { symbols: symbols })
                .then((response) => {
                  setStocks((prevStocks) => {
                    return prevStocks.map((stock) => ({
                      ...stock,
                      currentPrice: response.data.find(
                        (p: PriceInfo) => p.symbol === stock.symbol
                      )?.currentPrice
                    }));
                  });
                })
                .catch((error) => {
                  console.error('Stock prices error:', error);
                });
            }}
            pagination={{
              currentPage,
              pageSize: ITEMS_PER_PAGE,
              totalItems: stocks.length,
              onPageChange: setCurrentPage
            }}
          />
        </div>
      </div>

      <Modal
        title={`Place an order for ${selectedStock?.symbol}`}
        description={`Current Price: ₹${selectedStock?.currentPrice?.toFixed(
          2
        )}`}
        isOpen={!!selectedStock}
        onClose={() => setSelectedStock(null)}
      >
        <div className="grid gap-2">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="symbol">Symbol</Label>
            <Input
              id="symbol"
              className="col-span-2"
              value={selectedStock?.symbol || ''}
              disabled
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
          <div className="mt-2 flex gap-2">
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => placeOrder('BUY')}
            >
              Buy
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={() => placeOrder('SELL')}
            >
              Sell
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
