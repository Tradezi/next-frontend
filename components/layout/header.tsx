'use client';
import ThemeToggle from '@/components/layout/ThemeToggle/theme-toggle';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { MobileSidebar } from './mobile-sidebar';
import { UserNav } from './user-nav';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import MarketSentiment from '@/components/market-sentiment';
import axios from 'axios';

interface StockIndex {
  name: String;
  data: any;
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

export default function Header() {
  const [stockIndexes, setStockIndex] = useState<StockIndex[]>([]);
  const [isLoadingSentiment, setSentimentLoading] = useState(true);
  const fetchMarketSentiment = async () => {
    setSentimentLoading(true);
    try {
      const response = await api.get('/stock/index/price');
      console.log(response.data);
      setStockIndex(response.data);
    } catch (error) {
      console.error('Error Fetching Market Sentiment', error);
      setStockIndex([]);
    } finally {
      setSentimentLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketSentiment();
  }, []);

  return (
    <header className="sticky inset-x-0 top-0 w-full">
      <nav className="flex flex-col px-2 py-2">
        <div
          className={cn(
            'block flex w-full flex-row justify-between px-4 py-2 xl:hidden'
          )}
        >
          <div className="flex flex-row">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn('h-6 w-6 shrink-0')}
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            <span className="ml-2 overflow-hidden whitespace-nowrap text-lg">
              Tradezi
            </span>
          </div>
          <div className="mx-4 justify-self-end">
            <div className={cn('block xl:hidden')}>
              <MobileSidebar />
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-center gap-2 py-1">
          <ScrollArea className="w-full justify-self-start whitespace-nowrap">
            <div className="flex w-96 flex-row space-x-4 px-2 md:w-full md:justify-center">
              <div className="flex flex-row ">
                {stockIndexes.map((stock, index) => (
                  <MarketSentiment key={index} data={stock} />
                ))}
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </nav>
    </header>
  );
}

{
  /* <UserNav /> */
}
{
  /* <ThemeToggle /> */
}
