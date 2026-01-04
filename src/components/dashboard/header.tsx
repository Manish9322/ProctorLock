'use client';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { UserNav } from './user-nav';

export function DashboardHeader() {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Icons.Logo className="h-6 w-6" />
          <span className="sr-only">ProctorLock</span>
        </Link>
        <h1 className="text-lg font-semibold">ProctorLock</h1>
      </nav>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
          {/* Future search bar could go here */}
        </div>
        <UserNav />
      </div>
    </header>
  );
}
