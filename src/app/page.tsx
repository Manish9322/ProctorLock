'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth, type Role } from '@/lib/auth';
import { Icons } from '@/components/icons';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useCheckDbConnectionMutation } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [role, setRole] = useState<Role>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [checkDbConnection, { isLoading: isDbLoading, isSuccess, isError, data, error }] = useCheckDbConnectionMutation();
  
  useEffect(() => {
    const testId = searchParams.get('testId');
    if (testId) {
        localStorage.setItem('proctorlock_test_enroll', testId);
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password, role);
      // The login function in useAuth will handle redirection on success
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: err.message || 'An unknown error occurred.',
      });
    } finally {
        setIsLoading(false);
    }
  };

  const handleRoleChange = (value: string) => {
    const newRole = value as Role;
    setRole(newRole);
  }

  const handleTestConnection = async () => {
    await checkDbConnection({});
  }

  useEffect(() => {
    if (isSuccess && data) {
      toast({
        title: 'Success',
        description: data.message,
      });
    }
    if (isError && error) {
        const errorData = (error as any).data;
        toast({
            variant: 'destructive',
            title: 'Error',
            description: errorData?.message || 'An unknown error occurred.',
        });
    }
  }, [isSuccess, isError, data, error, toast]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-4 left-4">
        <Button onClick={handleTestConnection} disabled={isDbLoading}>
          {isDbLoading ? 'Testing...' : 'Test DB Connection'}
        </Button>
      </div>
       <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 text-2xl font-bold">
            <Icons.Logo className="h-8 w-8 text-primary" />
            <span>ProctorLock</span>
        </div>
        <p className="text-muted-foreground text-sm mt-1">Secure Online Examination Platform</p>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Select your role to access your dashboard.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
              />
               <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-7 h-7 w-7"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">Toggle password visibility</span>
                </Button>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select onValueChange={handleRoleChange} value={role ?? ''}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="candidate">Candidate</SelectItem>
                  <SelectItem value="examiner">Examiner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading || !role}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Register
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
