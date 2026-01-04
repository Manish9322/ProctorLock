'use client';
import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

export type Role = 'candidate' | 'examiner' | 'admin' | null;

interface AuthContextType {
  user: { name: string; role: Role } | null;
  login: (name: string, role: Role) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ name: string; role: Role } | null>(null);
  const router = useRouter();

  const login = (name: string, role: Role) => {
    // In a real app, you'd perform authentication and get a JWT here.
    // For this mock, we'll just set the user state.
    const newUser = { name, role };
    setUser(newUser);
    if (role === 'candidate') {
      router.push('/candidate/dashboard');
    } else if (role === 'examiner') {
      router.push('/examiner/dashboard');
    } else if (role === 'admin') {
      router.push('/admin/dashboard');
    }
  };

  const logout = () => {
    setUser(null);
    router.push('/');
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: !!user,
    }),
    [user]
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
