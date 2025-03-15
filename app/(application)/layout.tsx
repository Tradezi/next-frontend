import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Metadata } from 'next';
import {
  Home,
  Search,
  Bell,
  User,
  CandlestickChart,
  Briefcase
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BottomTabBar, { BottomTabBarSkeleton } from './tabbar';

export const metadata: Metadata = {
  title: 'Dashboard | Tradezi',
  description: 'Dashboard for Tradezi'
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex overflow-y-hidden">
      <Sidebar />
      <main className="h-[calc(100vh-64px)] w-full overflow-y-hidden">
        <Header sentiment={true} />
        {children}
        <BottomTabBar />
      </main>
    </div>
  );
}
