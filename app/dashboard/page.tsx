'use client';

import { useState, useEffect } from 'react';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { columns, Order } from './columns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface User {
  email: string;
  balance: number;
}

export default function page() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

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
      .then((data) => setOrders(data))
      .catch((error) => {
        console.error('Order totals error:', error);
      });
  }, []);

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Hi {user && user.email}, Welcome back 👋
          </h2>
        </div>
        <Tabs defaultValue="portfolio" className="space-y-4">
          <TabsList>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
          </TabsList>
          <TabsContent value="portfolio" className="space-y-4">
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
                  <div className="text-2xl font-bold">$45,231.89</div>
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
                  <div className="text-2xl font-bold">$52,350.00</div>
                  <p className="text-xs text-muted-foreground">
                    Current portfolio value
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
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
                  <div className="text-2xl font-bold text-green-600">
                    +$7,118.11
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +15.7% overall return
                  </p>
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
                  <div className="text-2xl font-bold">
                    ${user ? user.balance.toFixed(2) : 'Loading...'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Current account balance
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-6">
              <DataTable
                columns={columns}
                data={orders}
                searchKey="stockSymbol"
              />
            </div>
          </TabsContent>
          <TabsContent value="market" className="space-y-4">
            <div className="mb-4 flex justify-end">
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
                            document.getElementById(
                              'symbol'
                            ) as HTMLInputElement
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
                            // Refresh orders list
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
                data={orders}
                searchKey="stockSymbol"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
