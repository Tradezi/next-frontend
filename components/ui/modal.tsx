'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ModalProps {
  title?: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function Modal({
  title,
  description,
  isOpen,
  onClose,
  children,
  className
}: ModalProps) {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent
        className={cn(
          'flex flex-col',
          'sm:max-w-[100vw]',
          'sm:w-[calc(100vw-2rem)] md:w-[calc(100vw-4rem)] lg:w-[calc(100vw-2rem)]',
          'sm:h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] lg:h-[calc(100vh-2rem)]',
          'mx-auto my-auto md:rounded-xl',
          'border-2 border-border bg-card shadow-lg',
          className
        )}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="h-[calc(100%-2rem)] sm:h-full">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
