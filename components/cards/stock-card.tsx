import { formatIndianNumber } from '@/lib/utils';
import { Card, CardContent } from '@/components/cards/card';
import { Skeleton } from '@/components/ui/skeleton';

interface StockMetadata {
  symbol: string;
  comapny_name: string;
  currentPrice?: number;
}

interface StockCardProps {
  stock: StockMetadata;
  onClick?: (stock: StockMetadata) => void;
}

export function StockCard({ stock, onClick }: StockCardProps) {
  return (
    <Card
      className="mb-2 cursor-pointer overflow-hidden bg-card transition-colors hover:bg-muted/50"
      onClick={() => onClick?.(stock)}
    >
      <CardContent className="p-2">
        <div className="flex flex-col space-y-1">
          {/* First row: Stock Symbol */}
          <div className="flex items-center justify-between">
            <h3 className="text-md font-medium tracking-wide text-gray-200">
              {stock.symbol}
            </h3>
            <span className="text-md">
              {stock.currentPrice
                ? `₹${formatIndianNumber(stock.currentPrice)}`
                : 'Loading...'}
            </span>
          </div>

          {/* Second row: Company Name */}
          <div className="-mt-0.5 flex items-center text-[11px] text-gray-400">
            <span>{stock.comapny_name}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StockCardSkeleton() {
  return (
    <Card className="mb-2 overflow-hidden bg-card p-2">
      <CardContent className="p-2">
        <div className="flex flex-col space-y-1">
          {/* First row: Stock Symbol and Price */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-[80px]" />
            <Skeleton className="h-5 w-[70px]" />
          </div>

          {/* Second row: Company Name */}
          <div className="-mt-0.5 flex items-center">
            <Skeleton className="h-3 w-[150px]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
