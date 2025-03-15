'use client';
import { DashboardNav } from '@/components/dashboard-nav';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { navItems } from '@/constants/data';
import { MenuIcon, User, LogOut, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Cookies from 'js-cookie';
import axios from 'axios';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

// import { Playlist } from "../data/playlists";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  // playlists: Playlist[];
}

interface UserData {
  name: string;
  email: string;
  balance: number;
}

export function MobileSidebar({ className }: SidebarProps) {
  const [open, setOpen] = useState(false);
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

  const handleLogout = () => {
    // Remove cookies
    Cookies.remove('user');
    // Redirect to home/login page
    window.location.href = '/';
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon size={28} />
        </SheetTrigger>
        <SheetContent
          side="left"
          className={cn('w-[280px] !px-0', 'md:w-[350px]', 'lg:w-[300px]')}
        >
          <div className="flex h-full flex-col py-4">
            <div className="px-3 py-2">
              <div className="mb-2 flex items-center px-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-6 w-6"
                >
                  <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
                <span className="text-lg font-semibold tracking-tight">
                  Tradezi
                </span>
              </div>
              <div className="space-y-1">
                <DashboardNav
                  items={navItems}
                  isMobileNav={true}
                  setOpen={setOpen}
                />
              </div>
            </div>

            {userData && (
              <div className="mt-auto px-3 py-2">
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
                    sideOffset={-75}
                    className="w-[var(--radix-dropdown-menu-trigger-width)]"
                  >
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-500"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
