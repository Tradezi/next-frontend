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
import { StockDetailsModal } from '@/components/stock-details-modal';
import { formatIndianNumber } from '@/lib/utils';
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
      <div className="space-y-4 sm:p-4 md:p-8 lg:p-2">
        <div className="flex items-center justify-between px-4 md:px-2">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
            Dashboard
          </h2>
        </div>

        <div className="mx-auto grid grid-cols-1 gap-4 px-4 sm:w-full md:grid-cols-2 md:px-2 lg:grid-cols-4">
          <Card className="overflow-hidden">
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
                <div className="truncate text-base font-bold sm:text-lg md:text-xl lg:text-2xl">
                  ₹{formatIndianNumber(investedAmount)}
                </div>
              ) : (
                <Skeleton className="h-8 w-[120px]" />
              )}
              <p className="text-xs text-muted-foreground md:text-sm">
                Total amount invested
              </p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
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
                <div className="truncate text-base font-bold sm:text-lg md:text-xl lg:text-2xl">
                  ₹{formatIndianNumber(currentPrice)}
                </div>
              ) : (
                <Skeleton className="h-8 w-[120px]" />
              )}
              <p className="text-xs text-muted-foreground md:text-sm">
                Current portfolio value
              </p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
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
                    className={`truncate text-base font-bold sm:text-lg md:text-xl lg:text-2xl ${
                      currentPrice >= investedAmount
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {currentPrice >= investedAmount ? `+` : `-`}₹
                    {formatIndianNumber(
                      Math.abs(currentPrice - investedAmount)
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground md:text-sm">
                    {currentPrice >= investedAmount ? `+` : `-`}
                    {isNaN(
                      ((currentPrice - investedAmount) / investedAmount) * 100
                    )
                      ? '0.00'
                      : Math.abs(
                          ((currentPrice - investedAmount) / investedAmount) *
                            100
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
          <Card className="overflow-hidden">
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
                <div className="truncate text-base font-bold sm:text-lg md:text-xl lg:text-2xl">
                  ₹{formatIndianNumber(user.balance)}
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
          <div className="min-w-full px-4 sm:px-2">
            <div className="max-w-[calc(100vw-2rem)] md:max-w-none">
              {orders.length === 0 ? (
                <div className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-md border border-border py-12 text-center">
                  <p className="mb-4 text-lg text-muted-foreground">
                    You don't have any stocks in your portfolio yet.
                  </p>
                  <Button
                    onClick={() => (window.location.href = '/market')}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Go to Stock Market to Buy Stocks
                  </Button>
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </div>

      <StockDetailsModal
        isOpen={!!selectedOrder}
        onClose={() => {
          setSelectedOrder(null);
          setStockHistory([]);
        }}
        stockSymbol={selectedOrder?.stockSymbol}
        currentPrice={selectedOrder?.currentPrice}
        companyName={selectedOrder?.companyName}
        api={api}
      />
    </PageContainer>
  );
}
