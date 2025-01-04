'use client';

import { ColumnDef } from '@tanstack/react-table';

export interface Order {
  id: string;
  userId: string;
  stockPrice: number;
  stockSymbol: string;
  numOfStocks: number;
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
        currency: 'USD'
      }).format(amount);
      return formatted;
    }
  },
  {
    accessorKey: 'orderType',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('orderType') as string;
      return (
        <div className={type === 'BUY' ? 'text-green-600' : 'text-red-600'}>
          {type}
        </div>
      );
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => {
      return new Date(row.getValue('createdAt')).toLocaleDateString();
    }
  }
];
