import { formatIndianNumber } from '@/lib/utils';
import { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/cards/card';
import { Skeleton } from '@/components/ui/skeleton';

interface WebCardProps {
  title: string;
  value?: number;
  description: string;
  icon?: ReactNode;
}

export function WebCard({ title, value, description, icon }: WebCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium sm:text-sm">
          {title}
        </CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        {value !== undefined ? (
          <div className="truncate text-base font-bold sm:text-lg md:text-xl lg:text-2xl">
            ₹{formatIndianNumber(value)}
          </div>
        ) : (
          <Skeleton className="h-8 w-[120px]" />
        )}
        <p className="text-xs text-muted-foreground md:text-sm">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
