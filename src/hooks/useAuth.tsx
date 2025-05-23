
import React, { useState, useCallback, useContext, createContext, ReactNode } from 'react';
import { toast } from '@/components/ui/sonner';
import { 
  User, 
  UserRole, 
  SignInRequest, 
  SignUpRequest, 
  VoiceLoginRequest, 
  AuthResponse, 
  VoiceAuthResponse 
} from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: SignInRequest) => Promise<AuthResponse>;
  signUp: (userData: SignUpRequest) => Promise<AuthResponse>;
  voiceLogin: (voiceData: VoiceLoginRequest) => Promise<VoiceAuthResponse>;
  signOut: () => void;
  error: string | null;
}

// Mock users for demonstration
const mockUsers: Record<string, User> = {
  'ceo@min.com': {
    id: '1',
    name: 'Chad Murawczyk',
    email: 'ceo@min.com',
    role: 'CEO',
    avatar: '/avatar-ceo.png',
    permissions: ['all']
  },
  'cco@min.com': {
    id: '2',
    name: 'Sarah Johnson',
    email: 'cco@min.com',
    role: 'CCO',
    avatar: '/avatar-cco.png',
    permissions: ['reports', 'marketing', 'sales']
  },
  'marketing@min.com': {
    id: '3',
    name: 'Michael Chen',
    email: 'marketing@min.com',
    role: 'Marketing Director',
    avatar: '/avatar-marketing.png',
    permissions: ['marketing']
  },
  'support@min.com': {
    id: '4',
    name: 'Emily Rodriguez',
    email: 'support@min.com',
    role: 'Customer Support',
    avatar: '/avatar-support.png',
    permissions: ['support']
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = useCallback(async (credentials: SignInRequest): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the N8N webhook for sign in
      const n8nWebhookUrl = 'https://minnewyorkofficial.app.n8n.cloud/webhook/auth/signin';
      
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      
      // For demo purposes, we'll continue using the mock users
      if (mockUsers[credentials.email]) {
        const userData = mockUsers[credentials.email];
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success(`Welcome back, ${userData.name}`);
        
        return { 
          success: true, 
          user: userData,
          accessToken: 'mock-token-' + Date.now(),
          refreshToken: 'mock-refresh-' + Date.now(),
          expiresAt: Date.now() + 3600000
        };
      }
      
      throw new Error('User not found');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (userData: SignUpRequest): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Directly use the full webhook URL with proper CORS handling
      const n8nWebhookUrl = 'https://minnewyorkofficial.app.n8n.cloud/webhook/auth/signup';
      
      console.log("Sending signup request to:", n8nWebhookUrl);
      console.log("Signup data:", userData);
      
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        // Add mode: 'no-cors' to handle CORS issues
        mode: 'no-cors'
      });
      
      // When using no-cors mode, we can't actually read the response
      // So we'll assume success and notify the user about potential issues
      toast.success('Account creation request sent successfully');
      
      // Return a success object since we can't read the actual response with no-cors
      return { 
        success: true,
        message: "Account creation request was sent. Please check if your account was created."
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error during registration';
      console.error("Signup error:", errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const voiceLogin = useCallback(async (voiceData: VoiceLoginRequest): Promise<VoiceAuthResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the N8N webhook for voice login
      const n8nWebhookUrl = 'https://minnewyorkofficial.app.n8n.cloud/webhook/auth/voice-login';
      
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(voiceData),
      });
      
      if (!response.ok) {
        throw new Error('Voice authentication failed');
      }
      
      // For demo purposes, continue using the CEO mock user
      if (mockUsers['ceo@min.com']) {
        const userData = mockUsers['ceo@min.com'];
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success(`Voice authentication successful. Welcome, ${userData.name}`);
        
        return { 
          success: true, 
          voiceAuth: true, 
          detectedRole: 'CEO',
          confidence: 0.95,
          message: 'Voice authentication successful' 
        };
      }
      
      throw new Error('Voice authentication failed');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Voice authentication failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return { 
        success: false, 
        voiceAuth: false,
        message: errorMessage,
        error: errorMessage 
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    toast.info('You have been logged out');
  }, []);
  
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

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    voiceLogin,
    signOut,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
