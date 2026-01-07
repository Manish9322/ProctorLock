'use client';
import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
  useEffect,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import type { toast } from '@/hooks/use-toast';

export type Role = 'candidate' | 'examiner' | 'admin' | null;

interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: Role, toast: typeof toast) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isTokenExpired = (token: string): boolean => {
    try {
        const { exp } = jwtDecode(token) as { exp: number };
        if (!exp) return true;
        return Date.now() >= exp * 1000;
    } catch (e) {
        return true;
    }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

   useEffect(() => {
    try {
      const token = localStorage.getItem('proctorlock_token');
      if (token && !isTokenExpired(token)) {
        const decodedUser = jwtDecode(token) as User;
        setUser(decodedUser);
      } else {
        localStorage.removeItem('proctorlock_token');
      }
    } catch (error) {
        console.error("Failed to decode token on initial load", error);
        localStorage.removeItem('proctorlock_token');
    }
  }, []);

  const login = useCallback(async (email: string, password: string, role: Role, toast: typeof toast) => {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Login failed');
    }
    
    toast({
        title: 'Login Successful',
        description: 'You will be redirected shortly.',
    });

    const { token } = data;
    localStorage.setItem('proctorlock_token', token);

    const decodedUser = jwtDecode(token) as User;
    setUser(decodedUser);
    
    // Redirect based on role
    if (decodedUser.role === 'candidate') {
      router.push('/dashboard');
    } else if (decodedUser.role === 'examiner') {
      router.push('/examiner/dashboard');
    } else if (decodedUser.role === 'admin') {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('proctorlock_token');
    router.push('/');
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: !!user,
    }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
