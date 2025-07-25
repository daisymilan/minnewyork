
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import VoiceCommandButton from '@/components/ui/voice-command-button';
import useVoiceCommand from '@/hooks/useVoiceCommand';
import { toast } from '@/components/ui/sonner';

interface DashboardHeaderProps {
  className?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ className }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Voice command setup
  const commands = {
    'show sales': () => toast.info('Displaying sales metrics'),
    'show inventory': () => toast.info('Displaying inventory data'),
    'create report': () => toast.info('Creating new report'),
    'show dubai inventory': () => toast.info('Displaying Dubai inventory levels'),
    'help': () => toast.info('Available commands: show sales, show inventory, create report'),
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
    <header className={`py-4 px-6 bg-white border-b border-gray-200 flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-sans text-black">MiN NEW YORK</h1>
        
        {/* Role badge */}
        {user && (
          <div className="bg-primary/10 text-primary py-1 px-3 rounded-full text-xs">
            {user.role}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative max-w-md hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-gray-50 border border-gray-300 rounded-full py-2 px-4 text-sm text-black focus:outline-none focus:border-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        
        {/* Voice command button */}
        <VoiceCommandButton 
          isListening={isListening} 
          onClick={toggleVoiceCommand}
        />
        
        {/* Notifications */}
        <button className="relative p-1 rounded-full hover:bg-gray-100">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        
        {/* User avatar */}
        {user && (
          <div className="flex items-center gap-2 text-sm">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              {user.name.charAt(0)}
            </div>
            <div className="hidden lg:block">
              <div className="text-black">{user.name}</div>
              <div className="text-xs text-gray-600">{user.role}</div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
