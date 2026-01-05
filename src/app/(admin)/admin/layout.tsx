'use client';
import { useAuth, type Role } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { Home, Users, FileText, Settings, School, BarChart3, LogOut } from 'lucide-react';
import { Icons } from '@/components/icons';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { LogoutConfirmationDialog } from '@/components/logout-confirmation-dialog';

const navItems = [
  { href: '/admin/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/admin/tests', icon: FileText, label: 'Tests' },
  { href: '/admin/candidates', icon: Users, label: 'Candidates' },
  { href: '/admin/colleges', icon: School, label: 'Colleges & Institutes' },
  { href: '/admin/reports', icon: BarChart3, label: 'Reports' },
];

function AdminSidebar({ onLogoutClick }: { onLogoutClick: () => void }) {
    const pathname = usePathname();
    const { toggleSidebar } = useSidebar();
    return (
        <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenuButton
            asChild
            className="group-data-[collapsible=icon]:hidden"
          >
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <Icons.Logo className="h-6 w-6" />
              <span className="font-semibold">ProctorLock</span>
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton
            asChild
            className="hidden group-data-[collapsible=icon]:flex"
            tooltip="ProctorLock"
          >
             <Link href="/admin/dashboard" className="flex items-center gap-2">
              <Icons.Logo className="h-6 w-6" />
            </Link>
          </SidebarMenuButton>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
             <SidebarMenuItem>
                <SidebarMenuButton onClick={toggleSidebar}>
                    <SidebarTrigger />
                    <span>Collapse</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/admin/settings')}
                tooltip="Settings"
              >
                <Link href="/admin/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton onClick={onLogoutClick} tooltip="Log Out">
                  <LogOut />
                  <span>Log Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem className="mt-4">
                  <div className="flex items-center justify-center group-data-[collapsible=icon]:hidden">
                      <ThemeToggle />
                  </div>
                  <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center">
                       <ThemeToggle />
                  </div>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
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
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Skeleton className="h-40" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
        <AdminSidebar onLogoutClick={() => setIsLogoutDialogOpen(true)} />
        <div className="flex flex-1 flex-col">
            <main className="flex-1 p-4 md:gap-8 md:p-8">
            {children}
            </main>
        </div>
        <LogoutConfirmationDialog
            open={isLogoutDialogOpen}
            onOpenChange={setIsLogoutDialogOpen}
        />
    </SidebarProvider>
  );
}
