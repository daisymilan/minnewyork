
import { useState, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { GrokChatMessage, GrokResponse, GrokFragranceRequest, GrokBusinessRequest } from '@/types/grok';

export const useGrok = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<GrokChatMessage[]>([]);
  const abortController = useRef<AbortController | null>(null);

  const baseUrl = 'https://minnewyorkofficial.app.n8n.cloud/webhook';

  const sendChatMessage = useCallback(async (message: string, context?: string): Promise<GrokResponse> => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    setError(null);
    
    // Cancel any previous request
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    try {
      const userMessage: GrokChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date(),
        type: 'text'
      };

      setConversationHistory(prev => [...prev, userMessage]);

      const response = await fetch(`${baseUrl}/grok/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          userId: user.id,
          userRole: user.role,
          context: context || 'general',
          conversationHistory: conversationHistory.slice(-10) // Last 10 messages for context
        }),
        signal: abortController.current.signal
      });

      const result: GrokResponse = await response.json();

      if (result.success && result.response) {
        const assistantMessage: GrokChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.response,
          timestamp: new Date(),
          type: 'text'
        };

        setConversationHistory(prev => [...prev, assistantMessage]);
      }

      return result;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error('Request cancelled');
      }
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
      abortController.current = null;
    }
  }, [user, conversationHistory, baseUrl]);

  const sendVoiceCommand = useCallback(async (transcript: string, confidence: number = 0.95): Promise<GrokResponse> => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/grok/voice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          userId: user.id,
          userRole: user.role,
          context: 'voice_command',
          confidence
        })
      });

      const result: GrokResponse = await response.json();

      if (result.success && result.response) {
        const voiceMessage: GrokChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: transcript,
          timestamp: new Date(),
          type: 'voice'
        };

        const assistantMessage: GrokChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.response,
          timestamp: new Date(),
          type: 'voice'
        };

        setConversationHistory(prev => [...prev, voiceMessage, assistantMessage]);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process voice command';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user, baseUrl]);

  const getFragranceRecommendations = useCallback(async (request: Omit<GrokFragranceRequest, 'customerId'>): Promise<GrokResponse> => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/grok/fragrance-recommendation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...request,
          customerId: user.id
        })
      });

      const result: GrokResponse = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get fragrance recommendations';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user, baseUrl]);

  const getBusinessInsights = useCallback(async (request: Omit<GrokBusinessRequest, 'userRole'>): Promise<GrokResponse> => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/grok/business-insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...request,
          userRole: user.role
        })
      });

      const result: GrokResponse = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get business insights';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user, baseUrl]);

  const clearConversation = useCallback(() => {
    setConversationHistory([]);
    setError(null);
  }, []);

  const cancelRequest = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
    }
  }, []);

  return {
    conversationHistory,
    loading,
    error,
    sendChatMessage,
    sendVoiceCommand,
    getFragranceRecommendations,
    getBusinessInsights,
    clearConversation,
    cancelRequest
  };
};
