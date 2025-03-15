'use client';
import React, { ReactNode } from 'react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';
import { X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AlertModal } from '@/components/modal/alert-modal';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface Props {
  children?: ReactNode;
  // any props that come into the component
  data: any;
}

const MarketSentiment = ({ children, ...props }: Props) => {
  const prices = props.data.data;
  const name = props.data.name;
  if (prices.length < 2) {
    return 'Not enough data to determine trend';
  }

  // Sort by date in ascending order
  prices.sort(
    (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const previous = prices[0]; // Oldest data
  const latest = prices[prices.length - 1]; //latest data

  const previousPrice: number = previous.price;
  const latestPrice: number = latest.price;
  const absoluteDifference: number = latestPrice - previousPrice;
  const priceChange: string = absoluteDifference.toFixed(2);
  const percentageChange: string = (
    (absoluteDifference / previousPrice) *
    100
  ).toFixed(2);

  const previousDate: any = new Date(previous.date);
  const latestDate: any = new Date(latest.date);
  const dayDifference: any = Math.abs(
    (latestDate - previousDate) / (1000 * 60 * 60 * 24)
  );

  const isPositive = absoluteDifference > 0;
  const isNegative = absoluteDifference < 0;

  return (
    <div className="mx-2 flex flex-nowrap items-center space-x-2 px-3 py-1 shadow-md md:space-x-4 md:p-4 md:text-xl">
      <span className="md:text-md text-nowrap text-sm">
        {name}: <span className="font-semibold ">{latestPrice}</span>
      </span>
      {isPositive && <ArrowUp className="text-green-500 md:h-4 md:w-4" />}
      {isNegative && <ArrowDown className="text-red-500 md:h-4 md:w-4" />}
      <span
        className={
          isPositive
            ? 'text-sm text-green-500'
            : isNegative
            ? 'text-sm text-red-500'
            : 'text-sm text-gray-500'
        }
      >
        {absoluteDifference > 0
          ? `+${priceChange} (${percentageChange}%)`
          : `${priceChange} (${percentageChange}%)`}
      </span>
    </div>
  );
};

export default MarketSentiment;
