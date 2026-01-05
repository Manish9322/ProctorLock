import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchX } from 'lucide-react';
import { Icons } from '@/components/icons';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
       <div className="absolute top-8 left-8 flex items-center gap-2 text-xl font-bold">
        <Icons.Logo className="h-7 w-7 text-primary" />
        <span>ProctorLock</span>
      </div>
      <div className="flex flex-col items-center gap-4">
        <SearchX className="h-24 w-24 text-muted-foreground/50" strokeWidth={1} />
        <h1 className="text-8xl font-bold tracking-tighter text-primary">404</h1>
        <div className="max-w-md">
            <h2 className="text-2xl font-semibold tracking-tight">Page Not Found</h2>
            <p className="mt-2 text-muted-foreground">
                Oops! The page you were looking for doesn't exist. It might have been moved or deleted.
            </p>
        </div>
        <Button asChild className="mt-6">
          <Link href="/">Return to Homepage</Link>
        </Button>
      </div>
    </div>
  );
}
