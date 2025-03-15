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
      <nav className="flex items-center px-4 py-2">
        <div className="flex w-full items-center justify-center gap-2">
          {/* <UserNav /> */}
          <ScrollArea className="w-full justify-self-start whitespace-nowrap">
            <div className="flex w-96 flex-row space-x-4 p-2 md:w-full md:justify-center">
              <div className="flex flex-row ">
                {stockIndexes.map((stock) => (
                  <MarketSentiment data={stock} />
                ))}
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <div className="mx-4 justify-self-end">
            <div className={cn('block xl:hidden')}>
              <MobileSidebar />
              {/* <ThemeToggle /> */}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
