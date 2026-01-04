'use client';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { UserNav } from './user-nav';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '../ui/button';
import { Home, Users, FileText, Settings, PanelLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/admin/tests', icon: FileText, label: 'Tests' },
  { href: '/admin/candidates', icon: Users, label: 'Candidates' },
];

export function DashboardHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
       <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="#"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Icons.Logo className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">ProctorLock</span>
                </Link>
                {navItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn("flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
                      pathname.startsWith(item.href) && 'text-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
                 <Link
                    href="/admin/settings"
                    className={cn("flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
                       pathname.startsWith('/admin/settings') && 'text-foreground'
                    )}
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </Link>
              </nav>
            </SheetContent>
          </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-end">
        <UserNav />
      </div>
    </header>
  );
}
