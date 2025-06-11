
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { LuxuryCard } from '@/components/ui/luxury-card';
import VoiceCommandButton from '@/components/ui/voice-command-button';
import useVoiceCommand from '@/hooks/useVoiceCommand';
import { toast } from '@/components/ui/sonner';

const Login = () => {
  const [email, setEmail] = useState('ceo@min.com');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithVoice } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login(email, password);
    
    if (success) {
      navigate('/dashboard');
    }
    
    setIsLoading(false);
  };
  
  const handleVoiceLogin = async () => {
    setIsLoading(true);
    
    const success = await loginWithVoice();
    
    if (success) {
      navigate('/dashboard');
    }
    
    setIsLoading(false);
  };
  
  // Voice command hook setup
  const commands = {
    'login': handleVoiceLogin,
    'sign in': handleVoiceLogin,
  };
  
  const { isListening, startListening, stopListening } = useVoiceCommand({
    commands,
  });
  
  const toggleVoiceCommand = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-white p-4 font-sans">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 -rotate-12 w-96 h-96 bg-gold-gradient rounded-full opacity-[0.03] blur-3xl"></div>
        <div className="absolute left-0 bottom-0 rotate-12 w-96 h-96 bg-gold-gradient rounded-full opacity-[0.03] blur-3xl"></div>
      </div>
      
      <div className="text-center mb-10 z-10">
        <h1 className="text-4xl md:text-5xl font-sans font-bold text-black mb-2">
          MiN NEW YORK
        </h1>
      </div>
      
      <LuxuryCard className="w-full max-w-md bg-white border border-gray-200 z-10 p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-sans text-black">Welcome Back</h2>
          <p className="text-gray-600 text-sm mt-1">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="youremail@min.com"
              className="w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-black focus:outline-none focus:border-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-black focus:outline-none focus:border-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <LuxuryButton
            type="submit"
            className="w-full"
            gradient
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </LuxuryButton>
        </form>
        
        <div className="mt-6 flex items-center justify-center">
          <div className="flex-1 h-[1px] bg-gray-300"></div>
          <span className="px-4 text-xs text-gray-600">Or</span>
          <div className="flex-1 h-[1px] bg-gray-300"></div>
        </div>
        
        <div className="mt-6 flex flex-col items-center">
          <p className="text-sm text-gray-700 mb-3">Sign in with voice recognition</p>
          
          <VoiceCommandButton
            isListening={isListening}
            onClick={isLoading ? undefined : toggleVoiceCommand}
          />
          
          <p className="mt-3 text-xs text-gray-600">
            {isListening ? "Say 'login' or 'sign in'" : "Click to start voice recognition"}
          </p>
        </div>
        
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
        
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>For demo: use any of the following emails with any password</p>
          <p className="mt-1">ceo@min.com, cco@min.com, marketing@min.com, support@min.com</p>
        </div>
      </LuxuryCard>
    </div>
  );
};

export default Login;
