import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import ThemeToggle from '@/components/layout/ThemeToggle/theme-toggle';
import Link from 'next/link';
import Cookies from 'js-cookie';

import { MenuIcon, User, LogOut, ChevronUp } from 'lucide-react';

export default function DropdownMenuMobile() {
  const handleLogout = () => {
    // Remove cookies
    Cookies.remove('user');
    // Redirect to home/login page
    window.location.href = '/';
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-background">
          <MenuIcon size={28} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="/about">About Us</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Log Out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
