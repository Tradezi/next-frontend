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
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import {
  MotionContainer,
  MotionItem,
  MotionHeading,
  MotionText,
  MotionTableContainer,
  MotionEmptyState,
  MotionButton
} from '@/components/animations/motion-wrapper';
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
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [investedAmount, setInvestedAmount] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [stockHistory, setStockHistory] = useState<CandleData[]>([]);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

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

  const fetchOrderTotals = async () => {
    setIsLoadingOrders(true);
    try {
      const response = await api.get('/order/user/total');
      setOrders(response.data);
      const total = response.data.reduce((sum: number, order: Order) => {
        return sum + order.numOfStocks * order.stockPrice;
      }, 0);
      setInvestedAmount(total);
      const currentPrice = response.data.reduce((sum: number, order: Order) => {
        return sum + order.numOfStocks * order.currentPrice;
      }, 0);
      setCurrentPrice(currentPrice);
    } catch (error) {
      console.error('Order totals error:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrderTotals();
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

  return (
    <PageContainer scrollable={true}>
      <div className="py-1 sm:px-4 md:space-y-4 md:p-8 lg:p-2">
        <MotionHeading className="flex items-center justify-between px-2">
          <h2 className="hidden text-2xl font-bold tracking-tight md:block">
            Dashboard
          </h2>
        </MotionHeading>

        {/* Mobile Card - Only visible on small screens */}
        <div className="block md:hidden">
          <Card className="mx-4 overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col space-y-0">
                {/* First Row - Total Invested and Current Value */}
                <div className="grid grid-cols-2 gap-2 pb-2">
                  {/* Total Invested */}
                  <div>
                    <h3 className="text-sm font-medium">Total Invested</h3>
                    {investedAmount !== undefined ? (
                      <div className="truncate text-base font-bold">
                        ₹{formatIndianNumber(investedAmount)}
                      </div>
                    ) : (
                      <Skeleton className="h-6 w-[100px]" />
                    )}
                  </div>

                  {/* Current Value */}
                  <div>
                    <h3 className="text-right text-sm font-medium">
                      Current Value
                    </h3>
                    {currentPrice !== undefined ? (
                      <div className="truncate text-right text-base font-bold">
                        ₹{formatIndianNumber(currentPrice)}
                      </div>
                    ) : (
                      <Skeleton className="ml-auto h-6 w-[100px]" />
                    )}
                  </div>
                </div>

                {/* Horizontal Rule */}
                <div className="h-px bg-border" />

                {/* Second Row - P&L with Value and Percentage */}
                <div className="flex flex-row items-start justify-between pt-2">
                  <h3 className="text-sm font-medium">P&L</h3>
                  {currentPrice !== undefined &&
                  investedAmount !== undefined ? (
                    <div className="flex items-center space-x-2">
                      <div
                        className={`truncate text-base font-bold ${
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
                      <div
                        className={`truncate text-sm font-medium ${
                          currentPrice >= investedAmount
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        ({currentPrice >= investedAmount ? `+` : `-`}
                        {isNaN(
                          ((currentPrice - investedAmount) / investedAmount) *
                            100
                        )
                          ? '0.00'
                          : Math.abs(
                              ((currentPrice - investedAmount) /
                                investedAmount) *
                                100
                            ).toFixed(2)}
                        %)
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-6 w-[100px]" />
                      <Skeleton className="h-5 w-[60px]" />
                    </div>
                  )}
                </div>

                {/* Third Row - Funds */}
                <div className="flex flex-row items-start justify-between">
                  <h3 className="text-sm font-medium">Funds</h3>
                  {user ? (
                    <div className="truncate text-base font-bold">
                      ₹{formatIndianNumber(user.balance)}
                    </div>
                  ) : (
                    <Skeleton className="h-6 w-[100px]" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Desktop Cards - Only visible on medium and larger screens */}
        <MotionContainer className="mx-auto hidden grid-cols-1 gap-4 px-4 sm:w-full md:grid md:grid-cols-2 md:px-2 lg:grid-cols-4">
          <MotionItem className="overflow-hidden">
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
          </MotionItem>
          <MotionItem className="overflow-hidden">
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
          </MotionItem>
          <MotionItem className="overflow-hidden">
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
          </MotionItem>
          <MotionItem className="overflow-hidden">
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
          </MotionItem>
        </MotionContainer>

        <MotionTableContainer className="mt-6 overflow-x-auto">
          <div className="min-w-full px-4 sm:px-2">
            <div className="max-w-[calc(100vw-2rem)] md:max-w-none">
              {isLoadingOrders ? (
                <div className="w-full rounded-md border border-border">
                  <div className="flex items-center justify-between border-b p-4">
                    <Skeleton className="h-8 w-[200px]" />
                    <Skeleton className="h-10 w-[250px]" />
                  </div>
                  <div className="p-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="flex justify-between border-b py-3 last:border-0"
                      >
                        <Skeleton className="h-6 w-[120px]" />
                        <Skeleton className="h-6 w-[80px]" />
                        <Skeleton className="h-6 w-[100px]" />
                        <Skeleton className="h-6 w-[90px]" />
                        <Skeleton className="h-6 w-[70px]" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : orders.length === 0 ? (
                <MotionEmptyState className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-md border border-border py-12 text-center">
                  <MotionText className="mb-4 text-lg text-muted-foreground">
                    You don&apos;t have any stocks in your portfolio yet.
                  </MotionText>
                  <MotionButton>
                    <Link
                      href="/market"
                      className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Explore the stock market
                    </Link>
                  </MotionButton>
                </MotionEmptyState>
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
        </MotionTableContainer>
      </div>

      <StockDetailsModal
        isOpen={!!selectedOrder}
        onClose={() => {
          setSelectedOrder(null);
          setStockHistory([]);
          fetchOrderTotals();
        }}
        stockSymbol={selectedOrder?.stockSymbol}
        currentPrice={selectedOrder?.currentPrice}
        companyName={selectedOrder?.companyName}
        api={api}
      />
    </PageContainer>
  );
}
