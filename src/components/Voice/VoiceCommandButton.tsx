
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import useVoiceCommand from '@/hooks/useVoiceCommand';

interface VoiceCommandButtonProps {
  onCommand: (command: string) => void;
  disabled?: boolean;
  className?: string;
}

export const VoiceCommandButton: React.FC<VoiceCommandButtonProps> = ({
  onCommand,
  disabled = false,
  className
}) => {
  const [isRecording, setIsRecording] = useState(false);
  
  // Set up voice command hooks
  const commands = {
    'login as CEO': () => onCommand('CEO'),
    'login as CCO': () => onCommand('CCO'),
    'login as Commercial Director': () => onCommand('Commercial Director'),
    'login as Marketing Director': () => onCommand('Marketing Director'),
    'login as Customer Support': () => onCommand('Customer Support'),
  };
  
  const { isListening, startListening, stopListening } = useVoiceCommand({
    commands,
  });
  
  const toggleRecording = () => {
    if (isListening) {
      stopListening();
      setIsRecording(false);
    } else {
      startListening();
      setIsRecording(true);
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <Button
        type="button"
        variant="outline"
        size="lg"
        disabled={disabled}
        onClick={toggleRecording}
        className={`w-16 h-16 rounded-full border-2 ${
          isRecording 
            ? 'border-red-500 bg-red-500/10 animate-pulse' 
            : 'border-gold-500 bg-gold-500/10'
        } ${className}`}
      >
        {isRecording ? (
          <MicOff className="h-8 w-8 text-red-500" />
        ) : (
          <Mic className="h-8 w-8 text-gold-500" />
        )}
      </Button>
      <span className="text-xs text-gray-400 mt-2">
        {isRecording ? 'Listening...' : 'Click to speak'}
      </span>
    </div>
  );
};
