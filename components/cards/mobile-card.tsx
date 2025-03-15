import { formatIndianNumber } from '@/lib/utils';
import { Card, CardContent } from '@/components/cards/card';
import { Skeleton } from '@/components/ui/skeleton';

interface MobileCardProps {
  investedAmount?: number;
  currentPrice?: number;
  pnlValue?: number;
  pnlPercentage?: number;
  userBalance?: number;
}

export function MobileCard({
  investedAmount,
  currentPrice,
  pnlValue,
  pnlPercentage,
  userBalance
}: MobileCardProps) {
  return (
    <Card className="mx-4 w-full overflow-hidden">
      <CardContent className="p-2">
        <div className="flex flex-col space-y-0">
          {/* First Row - Total Invested and Current Value */}
          <div className="grid grid-cols-2 gap-2 pb-2">
            {/* Total Invested */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Invested
              </h3>
              {investedAmount !== undefined ? (
                <div className="truncate text-base font-bold">
                  ₹{formatIndianNumber(investedAmount)}
                </div>
              ) : (
                <Skeleton className="h-6 w-[100px]" />
              )}
            </div>

            {/* Current Value */}
            <div>
              <h3 className="text-right text-sm font-medium text-muted-foreground">
                Current
              </h3>
              {currentPrice !== undefined ? (
                <div className="truncate text-right text-base font-bold">
                  ₹{formatIndianNumber(currentPrice)}
                </div>
              ) : (
                <Skeleton className="ml-auto h-6 w-[100px]" />
              )}
            </div>
          </div>

          {/* Horizontal Rule */}
          <div className="h-px bg-border" />

          {/* Second Row - P&L with Value and Percentage */}
          <div className="flex flex-row items-start justify-between pt-2">
            <h3 className="text-sm font-medium text-muted-foreground">P&L</h3>
            {currentPrice !== undefined && investedAmount !== undefined ? (
              <div className="flex items-center space-x-2">
                <div
                  className={`truncate text-base font-bold ${
                    currentPrice >= investedAmount
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {currentPrice >= investedAmount ? `+` : `-`}₹
                  {formatIndianNumber(Math.abs(currentPrice - investedAmount))}
                </div>
                <div
                  className={`truncate text-sm font-medium ${
                    currentPrice >= investedAmount
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  ({currentPrice >= investedAmount ? `+` : `-`}
                  {isNaN(
                    ((currentPrice - investedAmount) / investedAmount) * 100
                  )
                    ? '0.00'
                    : Math.abs(
                        ((currentPrice - investedAmount) / investedAmount) * 100
                      ).toFixed(2)}
                  %)
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-[100px]" />
                <Skeleton className="h-5 w-[60px]" />
              </div>
            )}
          </div>

          {/* Third Row - Funds */}
          <div className="flex flex-row items-start justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Funds</h3>
            {userBalance !== undefined ? (
              <div className="truncate text-base font-bold">
                ₹{formatIndianNumber(userBalance)}
              </div>
            ) : (
              <Skeleton className="h-6 w-[100px]" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
