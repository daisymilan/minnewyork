
import React from 'react';
import { cn } from "@/lib/utils";
import { LuxuryButton } from '@/components/ui/luxury-button';

interface VoiceCommandButtonProps {
  isListening: boolean;
  onClick: () => void;
  className?: string;
}

const VoiceCommandButton: React.FC<VoiceCommandButtonProps> = ({
  isListening,
  onClick,
  className
}) => {
  return (
    <div className={cn("relative", className)}>
      <LuxuryButton
        onClick={onClick}
        className={cn(
          "flex items-center gap-2 rounded-full min-w-[44px] min-h-[44px] justify-center p-2",
          isListening ? 'bg-luxury-black border-2 border-luxury-gold' : ''
        )}
        variant={isListening ? 'outline' : 'default'}
        size="sm"
      >
        {/* Microphone icon with animation when active */}
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
          className={isListening ? 'animate-pulse-gold' : ''}
        >
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
        
        {/* Voice waves animation when listening */}
        {isListening && (
          <div className="absolute -inset-1.5 rounded-full">
            {[...Array(3)].map((_, i) => (
              <span 
                key={i}
                className="absolute inset-0 rounded-full border border-luxury-gold opacity-80"
                style={{
                  animation: `ping ${1 + i * 0.5}s cubic-bezier(0, 0, 0.2, 1) infinite`,
                }}
              />
            ))}
          </div>
        )}
      </LuxuryButton>
    </div>
  );
};

export default VoiceCommandButton;
