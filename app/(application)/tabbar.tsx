'use client';
import { User, CandlestickChart, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const tabs = [
  { name: 'Portfolio', href: '/dashboard', icon: Briefcase },
  { name: 'Market', href: '/market', icon: CandlestickChart },
  { name: 'Profile', href: '/profile', icon: User }
];

const BottomTabBar = () => {
  const currentPath = usePathname();
  return (
    <div className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t bg-background py-1 shadow-md md:hidden ">
      {tabs.map(({ name, href, icon: Icon }) => {
        const isActive = currentPath === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center p-1 ${
              isActive
                ? 'text-primary'
                : 'hover:text-foreground-300 text-foreground '
            }`}
          >
            <Icon className="h-6 w-6" />
            <span className="text-xs">{name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export const BottomTabBarSkeleton = () => {
  return (
    <div className="h-12 w-full py-16">
      <span>Test</span>
    </div>
  );
};

export default BottomTabBar;
