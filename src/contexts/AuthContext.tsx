
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from "@/components/ui/sonner";

export type UserRole = 'CEO' | 'CCO' | 'Commercial Director' | 'GCC Regional Manager' | 
                       'Marketing Director' | 'Production Manager' | 'Customer Support' | 
                       'Social Media Manager' | 'Guest';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithVoice: () => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: Record<string, User> = {
  'ceo@min.com': {
    id: '1',
    name: 'Chad Murawczyk',
    email: 'ceo@min.com',
    role: 'CEO',
    avatar: '/avatar-ceo.png',
  },
  'cco@min.com': {
    id: '2',
    name: 'Sarah Johnson',
    email: 'cco@min.com',
    role: 'CCO',
    avatar: '/avatar-cco.png',
  },
  'marketing@min.com': {
    id: '3',
    name: 'Michael Chen',
    email: 'marketing@min.com',
    role: 'Marketing Director',
    avatar: '/avatar-marketing.png',
  },
  'support@min.com': {
    id: '4',
    name: 'Emily Rodriguez',
    email: 'support@min.com',
    role: 'Customer Support',
    avatar: '/avatar-support.png',
  },
  // Add more mock users as needed
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Use the N8N webhook for sign in
      const n8nWebhookUrl = 'https://minnewyorkofficial.app.n8n.cloud/webhook/auth/signin';
      
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        toast.error('Invalid email or password');
        return false;
      }
      
      // For demo purposes, we'll continue using the mock users
      if (mockUsers[email]) {
        setUser(mockUsers[email]);
        localStorage.setItem('user', JSON.stringify(mockUsers[email]));
        toast.success(`Welcome back, ${mockUsers[email].name}`);
        return true;
      }
      
      toast.error('Invalid email or password');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
      return false;
    }
  };
  
  const loginWithVoice = async (): Promise<boolean> => {
    try {
      // Use the N8N webhook for voice login
      const n8nWebhookUrl = 'https://minnewyorkofficial.app.n8n.cloud/webhook/auth/voice-login';
      
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        toast.error('Voice authentication failed');
        return false;
      }
      
      // For demo purposes, continue using the CEO mock user
      if (mockUsers['ceo@min.com']) {
        setUser(mockUsers['ceo@min.com']);
        localStorage.setItem('user', JSON.stringify(mockUsers['ceo@min.com']));
        toast.success(`Voice authentication successful. Welcome, ${mockUsers['ceo@min.com'].name}`);
        return true;
      }
      
      toast.error('Voice authentication failed');
      return false;
    } catch (error) {
      console.error('Voice login error:', error);
      toast.error('An error occurred during voice authentication');
      return false;
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('You have been logged out');
  };
  
  const hasPermission = (requiredRoles: UserRole[]): boolean => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };
  
  // Check if user is already logged in from localStorage
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user from localStorage', error);
      }
    }
  }, []);
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginWithVoice,
        logout,
        hasPermission,
      }}
    >
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
