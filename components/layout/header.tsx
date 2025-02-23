import ThemeToggle from '@/components/layout/ThemeToggle/theme-toggle';
import { cn } from '@/lib/utils';
import { MobileSidebar } from './mobile-sidebar';
import { UserNav } from './user-nav';

export default function Header() {
  return (
    <header className="sticky inset-x-0 top-0 w-full">
      <nav className="flex items-center justify-between px-4 py-2">
        <div className={cn('block xl:hidden')}>
          <MobileSidebar />
        </div>
        <div className="ml-auto flex items-center gap-2">
          {/* <UserNav /> */}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
