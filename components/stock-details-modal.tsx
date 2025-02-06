'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import dynamic from 'next/dynamic';
import axios from 'axios';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface CandleData {
  x: Date;
  y: [number, number, number, number]; // [open, high, low, close]
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

  const periods: PeriodOption[] = [
    '1d',
    '5d',
    '1mo',
    '3mo',
    '6mo',
    '1y',
    '2y',
    '5y',
    'ytd',
    'max'
  ];

  const isDarkMode = document.documentElement.classList.contains('dark');
  const axisColor = isDarkMode ? '#94a3b8' : '#475569'; // slate-400 for dark, slate-600 for light

  useEffect(() => {
    if (stockSymbol && isOpen) {
      fetchStockHistory(stockSymbol);
    } else {
      setStockHistory([]);
    }
  }, [stockSymbol, isOpen, selectedPeriod]);

  const fetchStockHistory = async (symbol: string) => {
    setIsLoadingChart(true);
    try {
      const response = await api.get('/stock/history', {
        params: {
          symbol: symbol,
          period: selectedPeriod
        }
      });

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

  return (
    <Modal
      title={stockSymbol}
      description={companyName}
      isOpen={isOpen}
      onClose={onClose}
      className="h-full max-w-full"
    >
      <div className="-mt-4 grid h-[calc(100%-1rem)] grid-cols-[300px_1fr] gap-6">
        {/* Order Form Section - Left Side */}
        <div className="flex flex-col justify-start gap-6 rounded-lg border border-slate-200 p-6 dark:border-slate-800">
          <b className="text-xl font-semibold">Place an order</b>
          <div className="grid gap-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                className="col-span-2"
                value={stockSymbol || ''}
                disabled
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                className="col-span-2"
                value={currentPrice ? `₹${currentPrice}` : ''}
                disabled
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
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

          <div className="flex gap-2">
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

        {/* Chart Section - Right Side */}
        <div className="flex h-[calc(100vh-12rem)] min-h-0 flex-col rounded-lg border border-slate-200 p-6 dark:border-slate-800 ">
          {/* Chart Controls */}
          <div className="mb-4 flex items-center justify-between gap-4">
            {/* Period Selection Buttons */}
            <div className="flex flex-wrap gap-1">
              {periods.map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? 'default' : 'outline'}
                  className="px-2 py-1 text-xs"
                  onClick={() => setSelectedPeriod(period)}
                  disabled={isLoadingChart}
                >
                  {periodDisplayMap[period]}
                </Button>
              ))}
            </div>

            {/* Chart Type Selection */}
            <div className="flex gap-1">
              <Button
                variant={chartType === 'candlestick' ? 'default' : 'outline'}
                className="px-2 py-1 text-xs"
                onClick={() => setChartType('candlestick')}
                disabled={isLoadingChart}
              >
                Candlestick
              </Button>
              <Button
                variant={chartType === 'line' ? 'default' : 'outline'}
                className="px-2 py-1 text-xs"
                onClick={() => setChartType('line')}
                disabled={isLoadingChart}
              >
                Line
              </Button>
            </div>
          </div>

          {/* Chart Container */}
          <div className="min-h-0 flex-1">
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
                      toolbar: {
                        show: false
                      },
                      animations: {
                        enabled: false
                      }
                    },
                    grid: {
                      padding: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                      }
                    },
                    xaxis: {
                      type: 'datetime',
                      labels: {
                        formatter: function (val) {
                          return new Date(val).toLocaleDateString();
                        },
                        style: {
                          colors: axisColor
                        }
                      },
                      axisBorder: {
                        color: axisColor
                      },
                      axisTicks: {
                        color: axisColor
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
                          colors: [axisColor]
                        }
                      },
                      forceNiceScale: true,
                      decimalsInFloat: 2,
                      axisBorder: {
                        show: true,
                        color: axisColor
                      },
                      axisTicks: {
                        show: true,
                        color: axisColor
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
                              const price = series[seriesIndex][dataPointIndex];
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
                      color: chartType !== 'candlestick' ? '#2563eb' : undefined // blue-600
                    }
                  ]}
                  type={chartType}
                  height="100%"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Modal>
  );
}
