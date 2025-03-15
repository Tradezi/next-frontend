import { formatIndianNumber } from '@/lib/utils';
import { Card, CardContent } from '@/components/cards/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Order } from '@/app/(application)/dashboard/columns';

interface OrderCardProps {
  order: Order;
  onClick?: (order: Order) => void;
}

export function OrderCard({ order, onClick }: OrderCardProps) {
  const investedAmount = order.stockPrice * order.numOfStocks;
  const currentValue = order.currentPrice * order.numOfStocks;
  const profitAndLoss = currentValue - investedAmount;
  const profitAndLossPercentage = (profitAndLoss / investedAmount) * 100;

  return (
    <Card
      className="mb-2 cursor-pointer overflow-hidden bg-card transition-colors hover:bg-muted/50"
      onClick={() => onClick?.(order)}
    >
      <CardContent className="p-2">
        <div className="flex flex-col space-y-1">
          {/* First row: Quantity and Average Price */}
          <div className="flex items-center text-[11px] text-gray-400">
            <span>Qty. {order.numOfStocks}</span>
            <span className="mx-1.5">•</span>
            <span>Avg. ₹{formatIndianNumber(order.stockPrice)}</span>
            <div className="ml-auto">
              <span
                className={`${
                  profitAndLossPercentage >= 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {profitAndLossPercentage >= 0 ? '+' : ''}
                {profitAndLossPercentage.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Second row: Stock Symbol and P&L Value */}
          <div className="-mt-0.5 flex items-center justify-between">
            <h3 className="text-sm font-medium tracking-wide text-gray-200">
              {order.stockSymbol}
            </h3>
            <span
              className={`text-md ${
                profitAndLoss >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {profitAndLoss >= 0 ? '+' : ''}
              {formatIndianNumber(Math.abs(profitAndLoss))}
            </span>
          </div>

          {/* Third row: Invested Amount and LTP */}
          <div className="-mt-0.5 flex items-center text-[11px] text-gray-400">
            <span>Invested {formatIndianNumber(investedAmount)}</span>
            <div className="ml-auto">
              <span>
                LTP {formatIndianNumber(order.currentPrice)} (
                {(
                  ((order.currentPrice - order.stockPrice) / order.stockPrice) *
                  100
                ).toFixed(2)}
                %)
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OrderCardSkeleton() {
  return (
    <Card className="mb-2 overflow-hidden bg-card p-2">
      <CardContent className="p-2">
        <div className="flex flex-col space-y-1">
          {/* First row: Quantity and Average Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <Skeleton className="h-3 w-[40px]" />
              <Skeleton className="h-3 w-[60px]" />
            </div>
            <Skeleton className="h-3 w-[50px]" />
          </div>

          {/* Second row: Stock Symbol and P&L Value */}
          <div className="-mt-0.5 flex items-center justify-between">
            <Skeleton className="h-5 w-[80px]" />
            <Skeleton className="h-5 w-[70px]" />
          </div>

          {/* Third row: Invested Amount and LTP */}
          <div className="-mt-0.5 flex items-center justify-between">
            <Skeleton className="h-3 w-[90px]" />
            <Skeleton className="h-3 w-[120px]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
