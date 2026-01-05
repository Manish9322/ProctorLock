'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/lib/auth';
import { LogOut } from 'lucide-react';

interface LogoutConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogoutConfirmationDialog({
  open,
  onOpenChange,
}: LogoutConfirmationDialogProps) {
  const { logout } = useAuth();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
             <LogOut className="h-5 w-5" /> Are you sure you want to log out?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You will be returned to the login page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => logout()}>
            Log Out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
