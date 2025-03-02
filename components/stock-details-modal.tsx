'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';
import { X } from 'lucide-react';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface CandleData {
  x: Date;
  y: [number, number, number, number]; // [open, high, low, close]
}

interface HistoryDataPoint {
  Date: string;
  Open: number;
  High: number;
  Low: number;
  Close: number;
  '50DMA': number;
  '200DMA': number;
  Volume: number;
  Dividends: number;
  'Stock Splits': number;
}

interface StockMetrics {
  PE: number;
  marketCap: number;
  bookValue: number;
  dividendYield: number;
  earningsGrowth: number;
  revenueGrowth: number;
}

interface StockDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockSymbol?: string;
  companyName?: string;
  currentPrice?: number;
  api: any;
}

type PeriodOption =
  | '1d'
  | '5d'
  | '1mo'
  | '3mo'
  | '6mo'
  | '1y'
  | '2y'
  | '5y'
  | 'ytd'
  | 'max';
type ChartType = 'candlestick' | 'line' | 'area';

const periodDisplayMap: Record<PeriodOption, string> = {
  '1d': '1D',
  '5d': '5D',
  '1mo': '1M',
  '3mo': '3M',
  '6mo': '6M',
  '1y': '1Y',
  '2y': '2Y',
  '5y': '5Y',
  ytd: 'YTD',
  max: 'MAX'
};

export function StockDetailsModal({
  isOpen,
  onClose,
  stockSymbol,
  companyName,
  currentPrice,
  api
}: StockDetailsModalProps) {
  const [stockHistory, setStockHistory] = useState<CandleData[]>([]);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>('1mo');
  const [chartType, setChartType] = useState<ChartType>('candlestick');
  const [show50MA, setShow50MA] = useState(false);
  const [show200MA, setShow200MA] = useState(false);
  const [ma50Data, setMA50Data] = useState<{ x: number; y: number }[]>([]);
  const [ma200Data, setMA200Data] = useState<{ x: number; y: number }[]>([]);
  const [stockMetrics, setStockMetrics] = useState<StockMetrics | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [showMetricsPanel, setShowMetricsPanel] = useState(false);
  const [showOrderPanel, setShowOrderPanel] = useState(false);
  const [metricsPopupPosition, setMetricsPopupPosition] = useState({
    top: 0,
    left: 0
  });
  const [orderPopupPosition, setOrderPopupPosition] = useState({
    top: 0,
    left: 0
  });
  const metricsButtonRef = useRef<HTMLButtonElement>(null);
  const orderButtonRef = useRef<HTMLButtonElement>(null);

  const periods: PeriodOption[] = [
    '5d',
    '1mo',
    '3mo',
    '6mo',
    '1y',
    '2y',
    '5y',
    'ytd'
  ];

  const isDarkMode = document.documentElement.classList.contains('dark');
  const axisColor = isDarkMode ? '#94a3b8' : '#475569'; // slate-400 for dark, slate-600 for light

  // Separate useEffect for metrics - only runs when modal opens
  useEffect(() => {
    if (stockSymbol && isOpen) {
      fetchStockMetrics(stockSymbol);
    } else {
      setStockMetrics(null);
    }
  }, [stockSymbol, isOpen]);

  // Modified useEffect for history - runs when period changes
  useEffect(() => {
    if (stockSymbol && isOpen) {
      fetchStockHistory(stockSymbol);
    } else {
      setStockHistory([]);
    }
  }, [stockSymbol, isOpen, selectedPeriod]);

  const fetchStockMetrics = async (symbol: string) => {
    setIsLoadingMetrics(true);
    try {
      const response = await api.get('/stock/history', {
        params: {
          symbol: symbol,
          period: '1d' // Use shortest period for metrics
        }
      });

      setStockMetrics({
        PE: response.data.PE,
        marketCap: response.data.marketCap,
        bookValue: response.data.bookValue,
        dividendYield: response.data.dividendYield,
        earningsGrowth: response.data.earningsGrowth,
        revenueGrowth: response.data.revenueGrowth
      });
    } catch (error) {
      console.error('Error fetching stock metrics:', error);
      setStockMetrics(null);
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  const fetchStockHistory = async (symbol: string) => {
    setIsLoadingChart(true);
    try {
      const response = await api.get('/stock/history', {
        params: {
          symbol: symbol,
          period: selectedPeriod
        }
      });

      const transformedData = response.data.history.map(
        (item: HistoryDataPoint) => ({
          x: new Date(item.Date).getTime(),
          y: [item.Open, item.High, item.Low, item.Close]
        })
      );

      // Transform moving averages data
      const ma50Data = response.data.history.map((item: HistoryDataPoint) => ({
        x: new Date(item.Date).getTime(),
        y: item['50DMA']
      }));

      const ma200Data = response.data.history.map((item: HistoryDataPoint) => ({
        x: new Date(item.Date).getTime(),
        y: item['200DMA']
      }));

      setStockHistory(transformedData);
      setMA50Data(ma50Data);
      setMA200Data(ma200Data);
    } catch (error) {
      console.error('Error fetching stock history:', error);
      setStockHistory([]);
    } finally {
      setIsLoadingChart(false);
    }
  };

  const placeOrder = async (type: 'BUY' | 'SELL') => {
    const quantity = (
      document.getElementById('numOfStocks') as HTMLInputElement
    ).value;
    if (!stockSymbol || !quantity) {
      alert('Please enter quantity.');
      return;
    }
    try {
      await api.post('/order/create', {
        symbol: stockSymbol,
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

  // Transform data for line chart
  const lineChartData = stockHistory.map((item) => ({
    x: item.x,
    y: item.y[3] // Using closing price for line chart
  }));

  const MetricsSkeleton = () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        <div className="min-w-[120px] flex-1">
          <Skeleton className="mb-2 h-4 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="min-w-[120px] flex-1">
          <Skeleton className="mb-2 h-4 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="min-w-[120px] flex-1">
          <Skeleton className="mb-2 h-4 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="min-w-[120px] flex-1">
          <Skeleton className="mb-2 h-4 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="min-w-[120px] flex-1">
          <Skeleton className="mb-2 h-4 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="min-w-[120px] flex-1">
          <Skeleton className="mb-2 h-4 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
    </div>
  );

  // Update the popup positioning function to center the popups
  const positionPopup = () => {
    // No need to calculate positions anymore
    return { top: 0, left: 0 };
  };

  return (
    <Modal
      title={stockSymbol}
      description={companyName || stockSymbol}
      isOpen={isOpen}
      onClose={onClose}
      className="h-full max-w-full"
    >
      <div className="flex h-full flex-col gap-2 pb-4 sm:gap-2  md:pb-8">
        {/* Mobile Controls - Only visible on small screens */}
        <div className="flex gap-2 sm:hidden">
          <Button
            ref={metricsButtonRef}
            variant="outline"
            className="flex flex-1 items-center justify-center gap-1 py-2 text-xs"
            onClick={() => {
              setShowMetricsPanel(!showMetricsPanel);
              if (!showMetricsPanel) {
                setMetricsPopupPosition(positionPopup());
                setShowOrderPanel(false);
              }
            }}
          >
            Show Metrics
          </Button>
          <Button
            ref={orderButtonRef}
            variant="outline"
            className="flex flex-1 items-center justify-center gap-1 py-2 text-xs"
            onClick={() => {
              setShowOrderPanel(!showOrderPanel);
              if (!showOrderPanel) {
                setOrderPopupPosition(positionPopup());
                setShowMetricsPanel(false);
              }
            }}
          >
            Place Order
          </Button>
        </div>

        {/* Mobile Metrics Panel - Popup */}
        {showMetricsPanel && (
          <div
            className="fixed z-50 w-[calc(100%-2rem)] max-w-md rounded-lg border border-slate-200 bg-white p-3 shadow-lg sm:hidden dark:border-slate-800 dark:bg-slate-950"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium">Metrics</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setShowMetricsPanel(false)}
              >
                <X size={16} />
              </Button>
            </div>
            {isLoadingMetrics ? (
              <MetricsSkeleton />
            ) : stockMetrics ? (
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  {stockMetrics.marketCap && (
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground">
                        Market Cap
                      </div>
                      <div className="truncate text-sm font-medium">
                        ₹{(stockMetrics.marketCap / 10000000).toFixed(2)}Cr
                      </div>
                    </div>
                  )}
                  {stockMetrics.PE && (
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground">
                        P/E Ratio
                      </div>
                      <div className="truncate text-sm font-medium">
                        {stockMetrics.PE.toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  {stockMetrics.bookValue && (
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground">
                        Book Value
                      </div>
                      <div className="truncate text-sm font-medium">
                        ₹{stockMetrics.bookValue.toFixed(2)}
                      </div>
                    </div>
                  )}
                  {stockMetrics.dividendYield && (
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground">
                        Dividend Yield
                      </div>
                      <div className="truncate text-sm font-medium">
                        {(stockMetrics.dividendYield * 100).toFixed(2)}%
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  {stockMetrics.earningsGrowth !== null && (
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground">
                        Earnings Growth
                      </div>
                      <div
                        className={`truncate font-medium ${
                          stockMetrics.earningsGrowth > 0
                            ? 'text-green-500'
                            : stockMetrics.earningsGrowth < 0
                            ? 'text-red-500'
                            : ''
                        }`}
                      >
                        {(stockMetrics.earningsGrowth * 100).toFixed(2)}%
                      </div>
                    </div>
                  )}
                  {stockMetrics.revenueGrowth !== null && (
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground">
                        Revenue Growth
                      </div>
                      <div
                        className={`truncate font-medium ${
                          stockMetrics.revenueGrowth > 0
                            ? 'text-green-500'
                            : stockMetrics.revenueGrowth < 0
                            ? 'text-red-500'
                            : ''
                        }`}
                      >
                        {(stockMetrics.revenueGrowth * 100).toFixed(2)}%
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-xs text-muted-foreground">
                No metrics data available
              </div>
            )}
          </div>
        )}

        {/* Mobile Order Panel - Popup */}
        {showOrderPanel && (
          <div
            className="fixed z-50 w-[calc(100%-2rem)] max-w-md rounded-lg border border-slate-200 bg-white p-3 shadow-lg sm:hidden dark:border-slate-800 dark:bg-slate-950"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium">Place an order</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setShowOrderPanel(false)}
              >
                <X size={16} />
              </Button>
            </div>
            <div className="mt-1 grid gap-3">
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="symbol" className="text-xs">
                  Symbol
                </Label>
                <Input
                  id="symbol"
                  className="col-span-2 h-8 text-sm"
                  value={stockSymbol || ''}
                  disabled
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  className="col-span-2 h-8 text-sm"
                  value={currentPrice ? `₹${currentPrice}` : ''}
                  disabled
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <div className="relative col-span-2">
                  <Input
                    id="numOfStocks"
                    type="number"
                    className="pl-8 pr-8 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    placeholder="1"
                    min="1"
                  />
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => {
                      const input = document.getElementById(
                        'numOfStocks'
                      ) as HTMLInputElement;
                      const currentValue = Number(input.value) || 0;
                      input.value = String(Math.max(1, currentValue - 1));
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => {
                      const input = document.getElementById(
                        'numOfStocks'
                      ) as HTMLInputElement;
                      const currentValue = Number(input.value) || 0;
                      input.value = String(currentValue + 1);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                className="h-8 flex-1 bg-green-600 text-xs hover:bg-green-700"
                onClick={() => placeOrder('BUY')}
              >
                Buy
              </Button>
              <Button
                className="h-8 flex-1 bg-red-600 text-xs hover:bg-red-700"
                onClick={() => placeOrder('SELL')}
              >
                Sell
              </Button>
            </div>
          </div>
        )}

        {/* Add a backdrop for the popups */}
        {(showMetricsPanel || showOrderPanel) && (
          <div
            className="fixed inset-0 z-40 bg-black/50 sm:hidden"
            onClick={() => {
              setShowMetricsPanel(false);
              setShowOrderPanel(false);
            }}
          />
        )}

        {/* Main Content Area - Updated for responsiveness */}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 md:grid-rows-[auto_1fr] lg:grid-cols-[1fr_3fr] lg:grid-rows-none">
          {/* Left Column - Metrics and Order Form - Hidden on mobile, visible on tablet and up */}
          <div className="hidden flex-col gap-2 overflow-y-auto sm:flex md:flex-row lg:flex-col">
            {/* Metrics Panel - Added max-height and overflow handling */}
            <div className="rounded-lg border border-slate-200 px-4 py-2 md:flex-1 lg:h-auto lg:max-h-[40%] lg:overflow-y-auto dark:border-slate-800">
              {isLoadingMetrics ? (
                <MetricsSkeleton />
              ) : stockMetrics ? (
                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap md:flex-col">
                  <div className="flex flex-wrap gap-4 sm:flex-1 md:w-full">
                    {stockMetrics.marketCap && (
                      <div className="min-w-[120px] flex-1">
                        <div className="text-sm text-muted-foreground">
                          Market Cap
                        </div>
                        <div className="font-medium">
                          ₹{(stockMetrics.marketCap / 10000000).toFixed(2)}Cr
                        </div>
                      </div>
                    )}
                    {stockMetrics.PE && (
                      <div className="min-w-[120px] flex-1">
                        <div className="text-sm text-muted-foreground">
                          P/E Ratio
                        </div>
                        <div className="font-medium">
                          {stockMetrics.PE.toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 sm:flex-1 md:w-full">
                    {stockMetrics.bookValue && (
                      <div className="min-w-[120px] flex-1">
                        <div className="text-sm text-muted-foreground">
                          Book Value
                        </div>
                        <div className="font-medium">
                          ₹{stockMetrics.bookValue.toFixed(2)}
                        </div>
                      </div>
                    )}
                    {stockMetrics.dividendYield && (
                      <div className="min-w-[120px] flex-1">
                        <div className="text-sm text-muted-foreground">
                          Dividend Yield
                        </div>
                        <div className="font-medium">
                          {(stockMetrics.dividendYield * 100).toFixed(2)}%
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 sm:flex-1 md:w-full">
                    {stockMetrics.earningsGrowth !== null && (
                      <div className="min-w-[120px] flex-1">
                        <div className="text-sm text-muted-foreground">
                          Earnings Growth
                        </div>
                        <div
                          className={`font-medium ${
                            stockMetrics.earningsGrowth > 0
                              ? 'text-green-500'
                              : stockMetrics.earningsGrowth < 0
                              ? 'text-red-500'
                              : ''
                          }`}
                        >
                          {(stockMetrics.earningsGrowth * 100).toFixed(2)}%
                        </div>
                      </div>
                    )}
                    {stockMetrics.revenueGrowth !== null && (
                      <div className="min-w-[120px] flex-1">
                        <div className="text-sm text-muted-foreground">
                          Revenue Growth
                        </div>
                        <div
                          className={`font-medium ${
                            stockMetrics.revenueGrowth > 0
                              ? 'text-green-500'
                              : stockMetrics.revenueGrowth < 0
                              ? 'text-red-500'
                              : ''
                          }`}
                        >
                          {(stockMetrics.revenueGrowth * 100).toFixed(2)}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-sm text-muted-foreground">
                  No metrics data available
                </div>
              )}
            </div>

            {/* Order Form Section */}
            <div className="flex flex-1 flex-col rounded-lg border border-slate-200 px-4 py-2 lg:max-h-[60%] lg:overflow-y-auto dark:border-slate-800">
              <b className="text-lg font-semibold">Place an order</b>
              <div className="mt-2 grid gap-2">
                <div className="grid grid-cols-3 items-center gap-2">
                  <Label htmlFor="symbol">Symbol</Label>
                  <Input
                    id="symbol"
                    className="col-span-2"
                    value={stockSymbol || ''}
                    disabled
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    className="col-span-2"
                    value={currentPrice ? `₹${currentPrice}` : ''}
                    disabled
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <div className="relative col-span-2">
                    <Input
                      id="numOfStocks"
                      type="number"
                      className="pl-8 pr-8 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      placeholder="1"
                      min="1"
                    />
                    <button
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      onClick={() => {
                        const input = document.getElementById(
                          'numOfStocks'
                        ) as HTMLInputElement;
                        const currentValue = Number(input.value) || 0;
                        input.value = String(Math.max(1, currentValue - 1));
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      onClick={() => {
                        const input = document.getElementById(
                          'numOfStocks'
                        ) as HTMLInputElement;
                        const currentValue = Number(input.value) || 0;
                        input.value = String(currentValue + 1);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
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

          {/* Chart Section - Full Height */}
          <div className="flex min-h-0 flex-col rounded-lg border border-slate-200 p-1 sm:p-2 md:p-4 dark:border-slate-800">
            {/* Chart Controls - Updated for better mobile responsiveness */}
            <div className="mb-3 flex flex-col gap-1 sm:gap-2">
              {/* Period Selection Buttons - More compact on mobile */}
              <div className="flex items-center">
                <div className="hide-scrollbar flex flex-nowrap gap-0.5 overflow-x-auto sm:gap-1">
                  {periods.map((period) => (
                    <Button
                      key={period}
                      variant={
                        selectedPeriod === period ? 'default' : 'outline'
                      }
                      className="h-6 min-w-[28px] px-0.5 py-0 text-[9px] sm:h-8 sm:min-w-[40px] sm:px-2 sm:py-1 sm:text-sm md:min-w-[48px]"
                      onClick={() => setSelectedPeriod(period)}
                      disabled={isLoadingChart}
                    >
                      {periodDisplayMap[period]}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Second row with MA Controls and Chart Type on mobile */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Moving Average Controls */}
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 sm:gap-2">
                    <input
                      type="checkbox"
                      checked={show50MA}
                      onChange={(e) => setShow50MA(e.target.checked)}
                      className="h-3 w-3 rounded border-gray-300 sm:h-4 sm:w-4 md:h-5 md:w-5"
                    />
                    <span className="text-[9px] sm:text-sm md:text-base">
                      50 MA
                    </span>
                  </label>
                  <label className="flex items-center gap-1 sm:gap-2">
                    <input
                      type="checkbox"
                      checked={show200MA}
                      onChange={(e) => setShow200MA(e.target.checked)}
                      className="h-3 w-3 rounded border-gray-300 sm:h-4 sm:w-4 md:h-5 md:w-5"
                    />
                    <span className="text-[9px] sm:text-sm md:text-base">
                      200 MA
                    </span>
                  </label>
                </div>

                {/* Chart Type Selection */}
                <div className="flex gap-1">
                  <Button
                    variant={
                      chartType === 'candlestick' ? 'default' : 'outline'
                    }
                    className="h-6 px-1 py-0 text-[9px] sm:h-8 sm:px-3 sm:py-1 sm:text-sm"
                    onClick={() => setChartType('candlestick')}
                    disabled={isLoadingChart}
                  >
                    Candle
                  </Button>
                  <Button
                    variant={chartType === 'line' ? 'default' : 'outline'}
                    className="h-6 px-1 py-0 text-[9px] sm:h-8 sm:px-3 sm:py-1 sm:text-sm"
                    onClick={() => setChartType('line')}
                    disabled={isLoadingChart}
                  >
                    Line
                  </Button>
                </div>
              </div>
            </div>

            {/* Chart Container - Adjust height for mobile */}
            <div className="min-h-[280px] flex-1 overflow-hidden sm:min-h-0">
              {isLoadingChart ? (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : stockHistory.length > 0 ? (
                <div className="h-full w-full">
                  <Chart
                    options={{
                      chart: {
                        type: chartType,
                        height: '100%',
                        width: '100%',
                        toolbar: {
                          show: false
                        },
                        animations: {
                          enabled: false
                        }
                      },
                      responsive: [
                        {
                          breakpoint: 480,
                          options: {
                            chart: {
                              height: 300
                            },
                            xaxis: {
                              labels: {
                                rotate: -45,
                                style: {
                                  fontSize: '11px',
                                  fontWeight: '500'
                                },
                                offsetY: 12,
                                trim: true,
                                maxHeight: 60
                              },
                              tickAmount: 5
                            },
                            yaxis: {
                              labels: {
                                style: {
                                  fontSize: '11px'
                                },
                                formatter: function (val: number) {
                                  if (typeof val === 'number') {
                                    return '₹' + val.toFixed(0);
                                  }
                                  return val;
                                },
                                align: 'left',
                                offsetX: -10
                              },
                              tickAmount: 5,
                              axisTicks: {
                                show: false,
                                color: axisColor,
                                offsetX: -5
                              }
                            },
                            grid: {
                              padding: {
                                left: 5,
                                right: 5
                              }
                            },
                            legend: {
                              fontSize: '11px',
                              position: 'bottom',
                              offsetY: 0,
                              height: 30
                            }
                          }
                        }
                      ],
                      grid: {
                        padding: {
                          top: 0,
                          right: 0,
                          bottom: 0,
                          left: 0
                        },
                        xaxis: {
                          lines: {
                            show: false
                          }
                        },
                        yaxis: {
                          lines: {
                            show: true
                          }
                        }
                      },
                      xaxis: {
                        type: 'datetime',
                        labels: {
                          formatter: function (val) {
                            return new Date(val).toLocaleDateString();
                          },
                          style: {
                            colors: axisColor,
                            fontSize: '11px'
                          },
                          offsetX: 0,
                          offsetY: -5
                        },
                        axisBorder: {
                          color: axisColor,
                          offsetX: 0
                        },
                        axisTicks: {
                          color: axisColor,
                          offsetX: 0
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
                          },
                          style: {
                            colors: [axisColor],
                            fontSize: '11px'
                          },
                          align: 'left',
                          offsetX: 0
                        },
                        forceNiceScale: true,
                        decimalsInFloat: 2,
                        axisBorder: {
                          show: false,
                          color: axisColor,
                          offsetX: 0
                        },
                        axisTicks: {
                          show: false,
                          color: axisColor,
                          offsetX: 0
                        }
                      },
                      tooltip:
                        chartType === 'candlestick'
                          ? {
                              custom: function ({
                                seriesIndex,
                                dataPointIndex,
                                w
                              }) {
                                const o =
                                  w.globals.seriesCandleO[seriesIndex][
                                    dataPointIndex
                                  ];
                                const h =
                                  w.globals.seriesCandleH[seriesIndex][
                                    dataPointIndex
                                  ];
                                const l =
                                  w.globals.seriesCandleL[seriesIndex][
                                    dataPointIndex
                                  ];
                                const c =
                                  w.globals.seriesCandleC[seriesIndex][
                                    dataPointIndex
                                  ];
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
                          : {
                              custom: function ({
                                series,
                                seriesIndex,
                                dataPointIndex,
                                w
                              }) {
                                const price =
                                  series[seriesIndex][dataPointIndex];
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
                                  '<div class="text-muted-foreground dark:text-slate-400">Price: <span class="text-foreground dark:text-slate-200">₹' +
                                  price?.toFixed(2) +
                                  '</span></div>' +
                                  '</div>'
                                );
                              }
                            },
                      stroke: {
                        width: chartType === 'candlestick' ? 1 : 2,
                        curve: 'straight'
                      }
                    }}
                    series={[
                      {
                        name: 'Price',
                        data:
                          chartType === 'candlestick'
                            ? stockHistory
                            : lineChartData,
                        type: chartType,
                        color:
                          chartType !== 'candlestick' ? '#2563eb' : undefined
                      },
                      ...(show50MA
                        ? [
                            {
                              name: '50 MA',
                              data: ma50Data,
                              type: 'line',
                              color: '#22c55e' // green-500
                            }
                          ]
                        : []),
                      ...(show200MA
                        ? [
                            {
                              name: '200 MA',
                              data: ma200Data,
                              type: 'line',
                              color: '#ef4444' // red-500
                            }
                          ]
                        : [])
                    ]}
                    type={chartType}
                    height="100%"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
