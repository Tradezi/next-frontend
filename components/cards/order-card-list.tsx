import { Order } from '@/app/(application)/dashboard/columns';
import { OrderCard, OrderCardSkeleton } from './order-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface OrderCardListProps {
  orders: Order[];
  isLoading: boolean;
  onOrderClick: (order: Order) => void;
}

export function OrderCardList({
  orders,
  isLoading,
  onOrderClick
}: OrderCardListProps) {
  if (isLoading) {
    return (
      <div className="h-full w-full overflow-hidden rounded-lg border border-border bg-card p-2">
        {[1, 2, 3].map((i) => (
          <OrderCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center rounded-lg border border-none bg-card py-8 text-center">
        <p className="mb-4 text-sm text-muted-foreground">
          You don&apos;t have any stocks in your portfolio yet.
        </p>
        <Button asChild size="sm">
          <Link href="/market">Explore the stock market</Link>
        </Button>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full w-full rounded-lg border border-none bg-card p-2">
      <div>
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} onClick={onOrderClick} />
        ))}
      </div>
    </ScrollArea>
  );
}
