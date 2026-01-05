'use client';
import { useAuth, type Role } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';

export function DashboardLayout({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: Role[];
}) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
        if (!isAuthenticated) {
          router.push('/');
        } else if (user && user.role) {
          if (allowedRoles && !allowedRoles.includes(user.role)) {
            router.push(`/${user.role}/dashboard`);
          } else {
            setIsAuthorized(true);
          }
        }
    }, 200);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, router, allowedRoles]);

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <Skeleton className="h-8 w-32" />
          <div className="ml-auto flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Skeleton className="h-10 w-1/4" />
          <div className="grid gap-4 md:grid-cols-2 md:gap-8">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </main>
      </div>
    );
  }

  // This component is now only used for the candidate dashboard
  // Admin and Examiner have their own layouts with sidebars
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
         <h1 className="text-xl font-bold">ProctorLock</h1>
         {/* <UserNav /> */}
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
