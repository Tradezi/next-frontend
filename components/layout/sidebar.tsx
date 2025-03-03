'use client';
import React, { useState, useEffect } from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { navItems } from '@/constants/data';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  User,
  LogOut,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import Link from 'next/link';
import Cookies from 'js-cookie';
import axios from 'axios';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

type SidebarProps = {
  className?: string;
};

interface UserData {
  name: string;
  email: string;
  balance: number;
}

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // First try to get user data from cookie
    const userCookie = Cookies.get('user');
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUserData(parsedUser);
      } catch (error) {
        console.error('Error parsing user cookie:', error);
      }
    } else {
      // If no cookie, try to fetch from API
      const api = axios.create({
        baseURL:
          process.env.NEXT_PUBLIC_FLASK_BACKEND_URL ||
          'https://backend.tradezi.co.in',
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      });

      // Add cookie header on client side
      if (typeof window !== 'undefined') {
        api.interceptors.request.use((config) => {
          config.headers.Cookie = document.cookie;
          return config;
        });
      }

      api
        .get('/user/details')
        .then((response) => {
          setUserData(response.data);
          // Also set the cookie for future use
          Cookies.set('user', JSON.stringify(response.data), { expires: 7 });
        })
        .catch((error) => {
          console.error('Failed to fetch user data:', error);
        });
    }
  }, []);

  const handleToggle = () => {
    toggle();
  };

  const handleLogout = () => {
    // Remove cookies
    Cookies.remove('user');
    // Redirect to home/login page
    window.location.href = '/';
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
      <div className="flex h-[calc(100%-4rem)] flex-col justify-between py-4">
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

        {userData && (
          <div
            className={cn('mt-auto', isMinimized ? 'px-2 py-3' : 'px-3 py-2')}
          >
            {isMinimized ? (
              <DropdownMenu onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center rounded-md p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                  <User className="h-5 w-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                  <div className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    <div className="overflow-hidden">
                      <p className="truncate">{userData.name}</p>
                    </div>
                  </div>
                  <ChevronUp
                    className={cn(
                      'h-4 w-4 transition-transform duration-200',
                      dropdownOpen && 'rotate-180'
                    )}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="w-[var(--radix-dropdown-menu-trigger-width)]"
                >
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
