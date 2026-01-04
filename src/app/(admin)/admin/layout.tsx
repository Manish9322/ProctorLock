'use client';
import { useAuth, type Role } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { DashboardHeader } from '@/components/dashboard/header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const allowedRoles: Role[] = ['admin'];

  useEffect(() => {
    // Give it a moment to get user from context
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
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
             <Skeleton className="h-8 w-32" />
             <div className="ml-auto flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
             </div>
          </header>
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Skeleton className="h-40" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AdminSidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <DashboardHeader />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
