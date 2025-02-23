'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import { useSidebar } from '@/hooks/useSidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './ui/tooltip';

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

export function DashboardNav({
  items,
  setOpen,
  isMobileNav = false
}: DashboardNavProps) {
  const path = usePathname();
  const { isMinimized } = useSidebar();

  const handleItemClick = (item: NavItem) => {
    if (setOpen) setOpen(false);

    if (item.title.toLowerCase() === 'logout') {
      Cookies.remove('user');
      window.location.href = '/';
    }
  };

  if (!items?.length) {
    return null;
  }

  console.log('isActive', isMobileNav, isMinimized);

  return (
    <nav
      className={cn(
        'grid items-start gap-2 transition-all duration-500',
        isMinimized && 'px-2'
      )}
    >
      <TooltipProvider>
        {items.map((item, index) => {
          const Icon = Icons[item.icon || 'arrowRight'];
          return (
            item.href && (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.disabled ? '/' : item.href}
                    className={cn(
                      'flex items-center rounded-md py-2 text-sm font-medium transition-all duration-500 hover:bg-accent hover:text-accent-foreground',
                      path === item.href ? 'bg-accent' : 'transparent',
                      item.disabled && 'cursor-not-allowed opacity-80',
                      !isMinimized ? 'px-2' : 'w-full'
                    )}
                    onClick={() => handleItemClick(item)}
                  >
                    <div
                      className={cn(
                        'flex h-5 w-full items-center',
                        isMinimized && 'justify-center'
                      )}
                    >
                      <Icon className="size-5 flex-none" />
                      <span
                        className={cn(
                          'ml-2 overflow-hidden whitespace-nowrap',
                          isMinimized && 'hidden'
                        )}
                      >
                        {item.title}
                      </span>
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  align="center"
                  side="right"
                  sideOffset={8}
                  className={!isMinimized ? 'hidden' : 'inline-block'}
                >
                  {item.title}
                </TooltipContent>
              </Tooltip>
            )
          );
        })}
      </TooltipProvider>
    </nav>
  );
}
