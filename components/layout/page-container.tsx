import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PageContainer({
  children,
  scrollable = false
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className="h-[calc(100dvh-52px)]">
          <div className="h-full py-2 sm:px-2 md:p-4 md:px-8">{children}</div>
        </ScrollArea>
      ) : (
        <div className="h-full py-2 sm:px-2 md:p-4 md:px-8">{children}</div>
      )}
    </>
  );
}
