
export interface GrokChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'voice' | 'fragrance' | 'business';
}

export interface GrokChatRequest {
  message: string;
  userId: string;
  userRole: string;
  context?: string;
  conversationHistory?: GrokChatMessage[];
}

export interface GrokVoiceRequest {
  transcript: string;
  userId: string;
  userRole: string;
  context?: string;
  confidence?: number;
}

export interface GrokFragranceRequest {
  query: string;
  customerId: string;
  preferences?: {
    fragranceFamily?: string;
    preferredNotes?: string[];
    occasion?: string;
    intensity?: 'light' | 'moderate' | 'strong';
    budget?: string;
  };
  purchaseHistory?: any[];
}

export interface GrokBusinessRequest {
  query: string;
  userRole: string;
  dataScope?: 'sales' | 'marketing' | 'inventory' | 'customers';
  timePeriod?: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

export interface GrokResponse {
  success: boolean;
  type: 'chat' | 'voice' | 'fragrance_expert' | 'business_intelligence';
  response?: string;
  recommendations?: string;
  insights?: string;
  userInfo?: any;
  usage?: any;
  timestamp: string;
  error?: string;
}
