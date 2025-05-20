
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '@/lib/types';
import { mockUsers } from '@/lib/mockData';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  login: (userId: string) => boolean;
  logout: () => void;
  isAllowed: (allowedRoles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userId: string) => {
    const foundUser = mockUsers.find(u => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
      toast({
        title: "Logged in successfully",
        description: `Welcome, ${foundUser.name}!`,
      });
      return true;
    }
    toast({
      variant: "destructive",
      title: "Login failed",
      description: "Invalid user credentials",
    });
    return false;
  };

  const logout = () => {
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const isAllowed = (allowedRoles: string[]) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAllowed }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
