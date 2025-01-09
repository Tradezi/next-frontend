'use client';

import { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { columns, Order } from './columns';
import { Skeleton } from '@/components/ui/skeleton';

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
    fetch('/api/user/details', {
      credentials: 'include',
      headers: {
        Accept: 'application/json'
      }
    })
      .then((response) => {
        if (!response.ok) throw new Error('Not authenticated');
        return response.json();
      })
      .then((data) => setUser(data))
      .catch((error) => {
        console.error('Auth error:', error);
      });
  }, []);

  useEffect(() => {
    fetch('/api/order/user/total', {
      credentials: 'include',
      headers: {
        Accept: 'application/json'
      }
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch order totals');
        return response.json();
      })
      .then((data) => {
        setOrders(data);
        const total = data.reduce((sum: number, order: Order) => {
          return sum + order.numOfStocks * order.stockPrice;
        }, 0);
        setInvestedAmount(total);
        const currentPrice = data.reduce((sum: number, order: Order) => {
          return sum + order.numOfStocks * order.currentPrice;
        }, 0);
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
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
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
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
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
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
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
