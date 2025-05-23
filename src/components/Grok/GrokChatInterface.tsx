
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, Send, X, Brain, User } from 'lucide-react';
import { useGrok } from '@/hooks/useGrok';
import { useAuth } from '@/hooks/useAuth';
import { VoiceRecorder } from './VoiceRecorder';

export const GrokChatInterface: React.FC = () => {
  const { user } = useAuth();
  const { conversationHistory, loading, error, sendChatMessage, sendVoiceCommand, clearConversation, cancelRequest } = useGrok();
  const [message, setMessage] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory]);

  const handleSendMessage = async () => {
    if (!message.trim() || loading) return;

    try {
      await sendChatMessage(message.trim());
      setMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleVoiceCommand = async (transcript: string, confidence: number) => {
    try {
      await sendVoiceCommand(transcript, confidence);
    } catch (err) {
      console.error('Failed to process voice command:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-full bg-luxury-black border-luxury-gold/20">
      <CardHeader className="border-b border-luxury-gold/20">
        <div className="flex items-center justify-between">
          <CardTitle className="text-luxury-cream flex items-center space-x-2">
            <Brain className="w-6 h-6 text-luxury-gold" />
            <span>GROK AI Assistant</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {loading && (
              <Button
                variant="ghost"
                size="sm"
                onClick={cancelRequest}
                className="text-red-400 hover:text-red-300"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearConversation}
              className="text-luxury-cream/60 hover:text-luxury-cream"
            >
              Clear
            </Button>
          </div>
        </div>
        {user && (
          <p className="text-sm text-luxury-cream/60">
            Authenticated as {user.role} • {user.email}
          </p>
        )}
      </CardHeader>

      <CardContent className="flex flex-col h-full p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {conversationHistory.length === 0 && (
              <div className="text-center py-8">
                <Brain className="w-16 h-16 text-luxury-gold mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-luxury-cream mb-2">Welcome to GROK AI</h3>
                <p className="text-luxury-cream/60 max-w-md mx-auto">
                  Your intelligent assistant for MiN NEW YORK. Ask me about business insights, 
                  fragrance recommendations, or use voice commands to navigate the platform.
                </p>
              </div>
            )}

            {conversationHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${
                  msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-luxury-gold/20 flex items-center justify-center">
                  {msg.role === 'user' ? (
                    <User className="w-4 h-4 text-luxury-gold" />
                  ) : (
                    <Brain className="w-4 h-4 text-luxury-gold" />
                  )}
                </div>

                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-luxury-gold text-luxury-black'
                      : 'bg-luxury-black/60 border border-luxury-gold/20 text-luxury-cream'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {msg.timestamp.toLocaleTimeString()}
                    {msg.type === 'voice' && ' 🎤'}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-luxury-gold/20 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-luxury-gold animate-pulse" />
                </div>
                <div className="bg-luxury-black/60 border border-luxury-gold/20 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-luxury-gold rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-luxury-gold rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-luxury-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <span className="text-luxury-cream text-sm ml-2">GROK is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t border-luxury-gold/20 p-4">
          {isVoiceMode ? (
            <VoiceRecorder
              onTranscript={handleVoiceCommand}
              onCancel={() => setIsVoiceMode(false)}
              disabled={loading}
            />
          ) : (
            <div className="flex items-center space-x-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask GROK anything..."
                disabled={loading}
                className="flex-1 bg-luxury-black/60 border border-luxury-gold/20 rounded-md px-3 py-2 text-luxury-cream placeholder-luxury-cream/40 focus:outline-none focus:border-luxury-gold/40"
              />
              <Button
                onClick={() => setIsVoiceMode(true)}
                disabled={loading}
                variant="ghost"
                size="sm"
                className="text-luxury-gold hover:text-luxury-gold/80"
              >
                <Mic className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={loading || !message.trim()}
                className="bg-luxury-gold hover:bg-luxury-gold/80 text-luxury-black"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-luxury-black/30 border-t-luxury-black rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
