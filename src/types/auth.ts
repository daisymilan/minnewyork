
export interface User {
  id: string;
  email: string;
  role: UserRole;
  permissions: string[];
  name?: string;
  avatar?: string;
}

export type UserRole = 
  | 'CEO' 
  | 'CCO' 
  | 'Commercial Director'
  | 'GCC Regional'
  | 'Marketing Director'
  | 'Production Manager'
  | 'Customer Support'
  | 'Social Media Manager'
  | 'Guest';

export interface SignInRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpRequest {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}

export interface VoiceLoginRequest {
  voiceCommand: string;
  voiceSignature?: string;
}

export interface AuthResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
  expiresAt?: number;
  error?: string;
  errorCode?: string;
}

export interface VoiceAuthResponse {
  success: boolean;
  voiceAuth: boolean;
  detectedRole?: UserRole;
  confidence?: number;
  message: string;
  error?: string;
}
