'use client';
import React, { useState } from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { navItems } from '@/constants/data';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import Link from 'next/link';

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();

  const handleToggle = () => {
    toggle();
  };

  return (
    <aside
      className={cn(
        `relative hidden h-screen flex-none border-r bg-card transition-[width] duration-500 xl:block`,
        !isMinimized ? 'w-72' : 'w-16',
        className
      )}
    >
      <div className="flex h-16 items-center px-4 pt-4">
        <Link
          href={'/'}
          className="relative z-20 flex items-center overflow-hidden text-lg font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('h-6 w-6 shrink-0', isMinimized ? 'mx-0' : 'mr-0')}
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          <span className="ml-2 overflow-hidden whitespace-nowrap">
            Tradezi
          </span>
        </Link>
      </div>
      <ChevronLeft
        className={cn(
          'absolute -right-3 top-10 z-50  cursor-pointer rounded-full border bg-background text-3xl text-foreground',
          isMinimized && 'rotate-180'
        )}
        onClick={handleToggle}
      />
      <div className="space-y-4 py-4">
        <div
          className={cn(
            'px-3 py-2',
            isMinimized && 'flex flex-col items-center px-2'
          )}
        >
          <div className={cn('mt-3 space-y-1', isMinimized && 'w-full')}>
            <DashboardNav items={navItems} />
          </div>
        </div>
      </div>
    </aside>
  );
}
