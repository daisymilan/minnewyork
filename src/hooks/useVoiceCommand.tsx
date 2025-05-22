
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/sonner';

type CommandAction = () => void;
type VoiceCommands = Record<string, CommandAction>;

interface UseVoiceCommandOptions {
  commands: VoiceCommands;
  continuous?: boolean;
  lang?: string;
}

interface UseVoiceCommandReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  supported: boolean;
}

const useVoiceCommand = ({
  commands,
  continuous = false,
  lang = 'en-US'
}: UseVoiceCommandOptions): UseVoiceCommandReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(true);
  
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported in this browser');
      setSupported(false);
      return;
    }
  }, []);
  
  const processTranscript = useCallback(
    (text: string) => {
      setTranscript(text);
      
      // Match command patterns
      const commandEntries = Object.entries(commands);
      for (const [phrase, action] of commandEntries) {
        if (text.toLowerCase().includes(phrase.toLowerCase())) {
          action();
          toast.info(`Processed command: "${phrase}"`, {
            position: "top-right"
          });
          return true;
        }
      }
      
      return false;
    },
    [commands]
  );
  
  const startListening = useCallback(() => {
    if (!supported) {
      toast.error('Voice commands not supported in this browser');
      return;
    }
    
    try {
      // Use the browser's SpeechRecognition API
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionAPI();
      
      recognition.continuous = continuous;
      recognition.interimResults = true;
      recognition.lang = lang;
      
      recognition.onstart = () => {
        setIsListening(true);
        toast.info('Voice recognition active', {
          position: "top-right"
        });
      };
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const lastResult = event.results[event.results.length - 1];
        const text = lastResult[0].transcript;
        
        // Process final results only
        if (lastResult.isFinal) {
          processTranscript(text);
        }
      };
      
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event);
        setIsListening(false);
        toast.error(`Voice recognition error: ${event.error}`);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
      
      // Store the recognition instance for cleanup
      (window as any).__recognition = recognition;
    } catch (error) {
      console.error('Error starting voice recognition', error);
      toast.error('Failed to start voice recognition');
    }
  }, [continuous, lang, processTranscript, supported]);
  
  const stopListening = useCallback(() => {
    if ((window as any).__recognition) {
      (window as any).__recognition.stop();
      setIsListening(false);
      toast.info('Voice recognition stopped', {
        position: "top-right"
      });
    }
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if ((window as any).__recognition) {
        (window as any).__recognition.stop();
      }
    };
  }, []);
  
  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    supported
  };
};

export default useVoiceCommand;
