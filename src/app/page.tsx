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
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [role, setRole] = useState<Role>('candidate');
  const [username, setUsername] = useState('candidate@example.com');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, role);
  };

  const handleRoleChange = (value: string) => {
    const newRole = value as Role;
    setRole(newRole);
    if (newRole) {
      setUsername(`${newRole}@example.com`);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 flex items-center gap-2 text-2xl font-bold">
        <Icons.Logo className="h-8 w-8 text-primary" />
        <span>ProctorLock</span>
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
                placeholder="m@example.com"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="grid gap-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type={showPassword ? "text" : "password"} required defaultValue="password" />
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
              <Select onValueChange={handleRoleChange} defaultValue="candidate">
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
            <Button type="submit" className="w-full">
              Sign in
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
