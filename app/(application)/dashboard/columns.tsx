'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Skeleton } from '@/components/ui/skeleton';

export interface Order {
  id: string;
  userId: string;
  stockPrice: number;
  stockSymbol: string;
  companyName: string;
  numOfStocks: number;
  currentPrice: number;
  orderType: string;
  createdAt: string;
}

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'stockSymbol',
    header: 'Symbol'
  },
  {
    accessorKey: 'numOfStocks',
    header: 'Quantity'
  },
  {
    accessorKey: 'stockPrice',
    header: 'Price',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('stockPrice') as string);
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'INR'
      }).format(amount);
      return formatted;
    }
  },
  {
    accessorKey: 'investedAmount',
    header: 'Invested Amount',
    cell: ({ row }) => {
      const stockPrice = parseFloat(row.getValue('stockPrice') as string);
      const numOfStocks = parseFloat(row.getValue('numOfStocks') as string);
      const investedAmount = stockPrice * numOfStocks;
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'INR'
      }).format(investedAmount);
      return formatted;
    }
  },
  {
    accessorKey: 'profitAndLoss',
    header: 'Profit & Loss',
    cell: ({ row }) => {
      const stockPrice = Number(row.getValue('stockPrice'));
      const numOfStocks = Number(row.getValue('numOfStocks'));
      const currentPrice = Number(row.original.currentPrice);

      const investedAmount = stockPrice * numOfStocks;
      const currentValue = currentPrice * numOfStocks;
      const profitAndLoss = currentValue - investedAmount;

      const formatted = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
      }).format(profitAndLoss);

      const color = profitAndLoss < 0 ? 'text-red-600' : 'text-green-600';
      return <span className={color}>{formatted}</span>;
    }
  },
  {
    accessorKey: '%P&L',
    header: '%P&L',
    cell: ({ row }) => {
      const stockPrice = Number(row.getValue('stockPrice'));
      const numOfStocks = Number(row.getValue('numOfStocks'));
      const currentPrice = Number(row.original.currentPrice);

      const investedAmount = stockPrice * numOfStocks;
      const currentValue = currentPrice * numOfStocks;
      const profitAndLoss = currentValue - investedAmount;
      const profitAndLossPercentage = (profitAndLoss / investedAmount) * 100;

      const formatted = `${
        profitAndLossPercentage >= 0 ? '+' : ''
      }${profitAndLossPercentage.toFixed(2)}%`;

      const color =
        profitAndLossPercentage < 0 ? 'text-red-600' : 'text-green-600';
      return <span className={color}>{formatted}</span>;
    }
  }
];
