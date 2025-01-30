'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { columns, Order } from './columns';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface User {
  name: string;
  email: string;
  balance: number;
}

interface CandleData {
  x: Date;
  y: [number, number, number, number]; // [open, high, low, close]
}

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

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [investedAmount, setInvestedAmount] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [stockHistory, setStockHistory] = useState<CandleData[]>([]);
  const [isLoadingChart, setIsLoadingChart] = useState(false);

  useEffect(() => {
    api
      .get('/user/details')
      .then((response) => {
        setUser(response.data);
        // Set cookie with user data
        Cookies.set('user', JSON.stringify(response.data), { expires: 7 }); // expires in 7 days
      })
      .catch((error) => {
        console.error('Auth error:', error);
        // Delete user cookie
        Cookies.remove('user');
        window.location.href = '/';
      });
  }, []);

  useEffect(() => {
    api
      .get('/order/user/total')
      .then((response) => {
        setOrders(response.data);
        const total = response.data.reduce((sum: number, order: Order) => {
          return sum + order.numOfStocks * order.stockPrice;
        }, 0);
        setInvestedAmount(total);
        const currentPrice = response.data.reduce(
          (sum: number, order: Order) => {
            return sum + order.numOfStocks * order.currentPrice;
          },
          0
        );
        setCurrentPrice(currentPrice);
      })
      .catch((error) => {
        console.error('Order totals error:', error);
      });
  }, []);

  const fetchStockHistory = async (symbol: string) => {
    setIsLoadingChart(true);
    try {
      const response = await api.get('/stock/history', {
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

  const placeOrder = async (type: 'BUY' | 'SELL') => {
    const quantity = (
      document.getElementById('numOfStocks') as HTMLInputElement
    ).value;
    if (!selectedOrder?.stockSymbol || !quantity) {
      alert('Please enter quantity.');
      return;
    }
    try {
      await api.post('/order/create', {
        symbol: selectedOrder.stockSymbol,
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
      <div className="space-y-4 p-2 sm:p-2 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
            {user ? (
              ` Welcome ${user.name}`
            ) : (
              <Skeleton className="h-8 w-[100px]" />
            )}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium sm:text-sm">
                Invested Amount
              </CardTitle>
              <svg
                fill="currentColor"
                viewBox="-96 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-muted-foreground"
              >
                <g id="SVGRepo_iconCarrier">
                  <path d="M308 96c6.627 0 12-5.373 12-12V44c0-6.627-5.373-12-12-12H12C5.373 32 0 37.373 0 44v44.748c0 6.627 5.373 12 12 12h85.28c27.308 0 48.261 9.958 60.97 27.252H12c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h158.757c-6.217 36.086-32.961 58.632-74.757 58.632H12c-6.627 0-12 5.373-12 12v53.012c0 3.349 1.4 6.546 3.861 8.818l165.052 152.356a12.001 12.001 0 0 0 8.139 3.182h82.562c10.924 0 16.166-13.408 8.139-20.818L116.871 319.906c76.499-2.34 131.144-53.395 138.318-127.906H308c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12h-58.69c-3.486-11.541-8.28-22.246-14.252-32H308z"></path>
                </g>
              </svg>
            </CardHeader>
            <CardContent>
              {investedAmount !== undefined ? (
                <div className="text-lg font-bold sm:text-xl md:text-2xl">
                  ₹{investedAmount.toFixed(2)}
                </div>
              ) : (
                <Skeleton className="h-8 w-[120px]" />
              )}
              <p className="text-xs text-muted-foreground md:text-sm">
                Total amount invested
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium sm:text-sm">
                Current Value
              </CardTitle>
              <svg
                fill="currentColor"
                viewBox="-96 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-muted-foreground"
              >
                <g id="SVGRepo_iconCarrier">
                  <path d="M308 96c6.627 0 12-5.373 12-12V44c0-6.627-5.373-12-12-12H12C5.373 32 0 37.373 0 44v44.748c0 6.627 5.373 12 12 12h85.28c27.308 0 48.261 9.958 60.97 27.252H12c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h158.757c-6.217 36.086-32.961 58.632-74.757 58.632H12c-6.627 0-12 5.373-12 12v53.012c0 3.349 1.4 6.546 3.861 8.818l165.052 152.356a12.001 12.001 0 0 0 8.139 3.182h82.562c10.924 0 16.166-13.408 8.139-20.818L116.871 319.906c76.499-2.34 131.144-53.395 138.318-127.906H308c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12h-58.69c-3.486-11.541-8.28-22.246-14.252-32H308z"></path>
                </g>
              </svg>
            </CardHeader>
            <CardContent>
              {currentPrice !== undefined ? (
                <div className="text-lg font-bold sm:text-xl md:text-2xl">
                  ₹{currentPrice.toFixed(2)}
                </div>
              ) : (
                <Skeleton className="h-8 w-[120px]" />
              )}
              <p className="text-xs text-muted-foreground md:text-sm">
                Current portfolio value
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium sm:text-sm">
                Profit/Loss
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              {currentPrice !== undefined && investedAmount !== undefined ? (
                <>
                  <div
                    className={`text-lg font-bold sm:text-xl md:text-2xl ${
                      currentPrice >= investedAmount
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {currentPrice >= investedAmount ? `+` : `-`}₹
                    {Math.abs(currentPrice - investedAmount).toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground md:text-sm">
                    {currentPrice >= investedAmount ? `+` : `-`}
                    {Math.abs(
                      ((currentPrice - investedAmount) / investedAmount) * 100
                    ).toFixed(2)}
                    % overall return
                  </p>
                </>
              ) : (
                <>
                  <Skeleton className="h-8 w-[120px]" />
                  <Skeleton className="mt-1 h-4 w-[80px]" />
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium sm:text-sm">
                Balance
              </CardTitle>
              <svg
                fill="currentColor"
                viewBox="-96 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-muted-foreground"
              >
                <g id="SVGRepo_iconCarrier">
                  <path d="M308 96c6.627 0 12-5.373 12-12V44c0-6.627-5.373-12-12-12H12C5.373 32 0 37.373 0 44v44.748c0 6.627 5.373 12 12 12h85.28c27.308 0 48.261 9.958 60.97 27.252H12c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h158.757c-6.217 36.086-32.961 58.632-74.757 58.632H12c-6.627 0-12 5.373-12 12v53.012c0 3.349 1.4 6.546 3.861 8.818l165.052 152.356a12.001 12.001 0 0 0 8.139 3.182h82.562c10.924 0 16.166-13.408 8.139-20.818L116.871 319.906c76.499-2.34 131.144-53.395 138.318-127.906H308c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12h-58.69c-3.486-11.541-8.28-22.246-14.252-32H308z"></path>
                </g>
              </svg>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="text-lg font-bold sm:text-xl md:text-2xl">
                  ₹{user.balance.toFixed(2)}
                </div>
              ) : (
                <Skeleton className="h-8 w-[120px]" />
              )}
              <p className="text-xs text-muted-foreground md:text-sm">
                Current account balance
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 overflow-x-auto">
          <div className="min-w-full px-0 sm:px-2">
            <div className="max-w-[calc(100vw-2rem)] md:max-w-none">
              <DataTable
                columns={columns}
                data={orders}
                searchKey="stockSymbol"
                onRowClick={(order) => {
                  setSelectedOrder(order);
                  if (order) {
                    fetchStockHistory(order.stockSymbol);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={`Place an order for ${selectedOrder?.stockSymbol}`}
        description={`Current Price: ₹${selectedOrder?.currentPrice?.toFixed(
          2
        )}`}
        isOpen={!!selectedOrder}
        onClose={() => {
          setSelectedOrder(null);
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
          <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-3">
            <Label htmlFor="symbol" className="sm:text-right">
              Symbol
            </Label>
            <Input
              id="symbol"
              className="col-span-1 sm:col-span-2"
              value={selectedOrder?.stockSymbol || ''}
              disabled
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-3">
            <Label htmlFor="quantity" className="sm:text-right">
              Quantity
            </Label>
            <Input
              id="numOfStocks"
              type="number"
              className="col-span-1 sm:col-span-2"
              placeholder="1"
            />
          </div>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
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
