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
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface StockMetadata {
  symbol: string;
  comapny_name: string;
  currentPrice?: number;
}

interface PriceInfo {
  symbol: string;
  currentPrice: number;
}

interface CandleData {
  x: Date;
  y: [number, number, number, number]; // [open, high, low, close]
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
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Add an interceptor to add the cookie header on the client side
if (typeof window !== 'undefined') {
  api.interceptors.request.use((config) => {
    config.headers.Cookie = document.cookie;
    return config;
  });
}

export default function MarketPage() {
  const [stocks, setStocks] = useState<StockMetadata[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState<StockMetadata | null>(
    null
  );
  const [stockHistory, setStockHistory] = useState<CandleData[]>([]);
  const [isLoadingChart, setIsLoadingChart] = useState(false);

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

  const fetchStockHistory = async (symbol: string) => {
    setIsLoadingChart(true);
    try {
      const response = await api.get(`/stock/history`, {
        params: {
          symbol: symbol,
          period: '1y'
        }
      });

      // Transform the data to match the candlestick format
      const transformedData = response.data.map((item: any) => ({
        x: new Date(item.Date).getTime(),
        y: [item.Open, item.High, item.Low, item.Close]
      }));

      setStockHistory(transformedData);
    } catch (error) {
      console.error('Error fetching stock history:', error);
      setStockHistory([]);
    } finally {
      setIsLoadingChart(false);
    }
  };

  // Add this effect to fetch stock history when a stock is selected
  useEffect(() => {
    if (selectedStock) {
      fetchStockHistory(selectedStock.symbol);
    } else {
      setStockHistory([]);
    }
  }, [selectedStock]);

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
        onClose={() => {
          setSelectedStock(null);
          setStockHistory([]);
        }}
      >
        <div className="grid gap-4">
          {stockHistory.length > 0 ? (
            <div className="mb-4 h-[300px] w-full">
              <Chart
                options={{
                  chart: {
                    type: 'candlestick',
                    height: 300,
                    toolbar: {
                      show: false
                    }
                  },
                  xaxis: {
                    type: 'datetime',
                    labels: {
                      formatter: function (val) {
                        return new Date(val).toLocaleDateString();
                      }
                    }
                  },
                  yaxis: {
                    tooltip: {
                      enabled: true
                    },
                    labels: {
                      formatter: function (val) {
                        if (typeof val === 'number') {
                          return '₹' + val.toFixed(2);
                        }
                        return val;
                      }
                    }
                  },
                  tooltip: {
                    custom: function ({ seriesIndex, dataPointIndex, w }) {
                      const o =
                        w.globals.seriesCandleO[seriesIndex][dataPointIndex];
                      const h =
                        w.globals.seriesCandleH[seriesIndex][dataPointIndex];
                      const l =
                        w.globals.seriesCandleL[seriesIndex][dataPointIndex];
                      const c =
                        w.globals.seriesCandleC[seriesIndex][dataPointIndex];
                      const date = new Date(
                        w.globals.seriesX[seriesIndex][dataPointIndex]
                      ).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      });

                      return (
                        '<div class="rounded-lg border bg-background text-foreground shadow-md dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 p-2 text-sm">' +
                        '<div class="font-medium border-b dark:border-slate-800 pb-1 mb-1">' +
                        date +
                        '</div>' +
                        '<div class="space-y-0.5">' +
                        '<div class="text-muted-foreground dark:text-slate-400">Open: <span class="text-foreground dark:text-slate-200">₹' +
                        o?.toFixed(2) +
                        '</span></div>' +
                        '<div class="text-muted-foreground dark:text-slate-400">High: <span class="text-foreground dark:text-slate-200">₹' +
                        h?.toFixed(2) +
                        '</span></div>' +
                        '<div class="text-muted-foreground dark:text-slate-400">Low: <span class="text-foreground dark:text-slate-200">₹' +
                        l?.toFixed(2) +
                        '</span></div>' +
                        '<div class="text-muted-foreground dark:text-slate-400">Close: <span class="text-foreground dark:text-slate-200">₹' +
                        c?.toFixed(2) +
                        '</span></div>' +
                        '</div>' +
                        '</div>'
                      );
                    }
                  }
                }}
                series={[
                  {
                    name: 'Price',
                    data: stockHistory
                  }
                ]}
                type="candlestick"
                height={300}
              />
            </div>
          ) : isLoadingChart ? (
            <div className="mb-4 flex h-[300px] w-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : null}

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
        </div>
      </Modal>
    </PageContainer>
  );
}
