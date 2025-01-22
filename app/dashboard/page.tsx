'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { columns, Order } from './columns';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';

interface User {
  name: string;
  email: string;
  balance: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [investedAmount, setInvestedAmount] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  useEffect(() => {
    axios
      .get('/api/user/details', {
        withCredentials: true,
        headers: {
          Accept: 'application/json'
        }
      })
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
    axios
      .get('/api/order/user/total', {
        withCredentials: true,
        headers: {
          Accept: 'application/json'
        }
      })
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

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {user ? (
              `Hi ${user.name}, Welcome back 👋`
            ) : (
              <Skeleton className="h-8 w-[300px]" />
            )}
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Invested Amount
              </CardTitle>
              <svg
                fill="#000000"
                viewBox="-96 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M308 96c6.627 0 12-5.373 12-12V44c0-6.627-5.373-12-12-12H12C5.373 32 0 37.373 0 44v44.748c0 6.627 5.373 12 12 12h85.28c27.308 0 48.261 9.958 60.97 27.252H12c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h158.757c-6.217 36.086-32.961 58.632-74.757 58.632H12c-6.627 0-12 5.373-12 12v53.012c0 3.349 1.4 6.546 3.861 8.818l165.052 152.356a12.001 12.001 0 0 0 8.139 3.182h82.562c10.924 0 16.166-13.408 8.139-20.818L116.871 319.906c76.499-2.34 131.144-53.395 138.318-127.906H308c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12h-58.69c-3.486-11.541-8.28-22.246-14.252-32H308z"></path>
                </g>
              </svg>
            </CardHeader>
            <CardContent>
              {investedAmount !== undefined ? (
                <div className="text-2xl font-bold">
                  ₹{investedAmount.toFixed(2)}
                </div>
              ) : (
                <Skeleton className="h-8 w-[120px]" />
              )}
              <p className="text-xs text-muted-foreground">
                Total amount invested
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Value
              </CardTitle>
              <svg
                fill="#000000"
                viewBox="-96 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M308 96c6.627 0 12-5.373 12-12V44c0-6.627-5.373-12-12-12H12C5.373 32 0 37.373 0 44v44.748c0 6.627 5.373 12 12 12h85.28c27.308 0 48.261 9.958 60.97 27.252H12c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h158.757c-6.217 36.086-32.961 58.632-74.757 58.632H12c-6.627 0-12 5.373-12 12v53.012c0 3.349 1.4 6.546 3.861 8.818l165.052 152.356a12.001 12.001 0 0 0 8.139 3.182h82.562c10.924 0 16.166-13.408 8.139-20.818L116.871 319.906c76.499-2.34 131.144-53.395 138.318-127.906H308c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12h-58.69c-3.486-11.541-8.28-22.246-14.252-32H308z"></path>
                </g>
              </svg>
            </CardHeader>
            <CardContent>
              {currentPrice !== undefined ? (
                <div className="text-2xl font-bold">
                  ₹{currentPrice.toFixed(2)}
                </div>
              ) : (
                <Skeleton className="h-8 w-[120px]" />
              )}
              <p className="text-xs text-muted-foreground">
                Current portfolio value
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profit/Loss</CardTitle>
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
                    className={`text-2xl font-bold ${
                      currentPrice >= investedAmount
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {currentPrice >= investedAmount ? `+` : `-`}₹
                    {Math.abs(currentPrice - investedAmount).toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
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
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
              <svg
                fill="#000000"
                viewBox="-96 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M308 96c6.627 0 12-5.373 12-12V44c0-6.627-5.373-12-12-12H12C5.373 32 0 37.373 0 44v44.748c0 6.627 5.373 12 12 12h85.28c27.308 0 48.261 9.958 60.97 27.252H12c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h158.757c-6.217 36.086-32.961 58.632-74.757 58.632H12c-6.627 0-12 5.373-12 12v53.012c0 3.349 1.4 6.546 3.861 8.818l165.052 152.356a12.001 12.001 0 0 0 8.139 3.182h82.562c10.924 0 16.166-13.408 8.139-20.818L116.871 319.906c76.499-2.34 131.144-53.395 138.318-127.906H308c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12h-58.69c-3.486-11.541-8.28-22.246-14.252-32H308z"></path>
                </g>
              </svg>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="text-2xl font-bold">
                  ₹{user.balance.toFixed(2)}
                </div>
              ) : (
                <Skeleton className="h-8 w-[120px]" />
              )}
              <p className="text-xs text-muted-foreground">
                Current account balance
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <DataTable columns={columns} data={orders} searchKey="stockSymbol" />
        </div>
      </div>
    </PageContainer>
  );
}
