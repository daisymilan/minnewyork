
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, X } from 'lucide-react';

interface VoiceRecorderProps {
  onTranscript: (transcript: string, confidence: number) => void;
  onCancel: () => void;
  disabled?: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscript,
  onCancel,
  disabled = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);

        if (finalTranscript) {
          const confidence = event.results[event.results.length - 1][0].confidence || 0.95;
          onTranscript(finalTranscript.trim(), confidence);
          stopRecording();
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript]);

  const startRecording = () => {
    if (recognitionRef.current && !disabled) {
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleCancel = () => {
    stopRecording();
    onCancel();
  };

  if (!('webkitSpeechRecognition' in window)) {
    return (
      <div className="text-center py-4">
        <p className="text-luxury-cream/60 text-sm">
          Voice recognition is not supported in this browser.
        </p>
        <Button
          onClick={onCancel}
          variant="ghost"
          className="mt-2 text-luxury-cream/60"
        >
          Use Text Input
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center space-x-4">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            disabled={disabled}
            className="w-16 h-16 rounded-full bg-luxury-gold hover:bg-luxury-gold/80 text-luxury-black"
          >
            <Mic className="w-8 h-8" />
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white animate-pulse"
          >
            <X className="w-8 h-8" />
          </Button>
        )}
      </div>

      {isRecording && (
        <div className="space-y-2">
          <p className="text-luxury-cream text-sm">🎤 Listening...</p>
          {transcript && (
            <p className="text-luxury-cream/70 text-sm italic">"{transcript}"</p>
          )}
        </div>
      )}

      <div className="flex items-center justify-center space-x-2">
        <Button
          onClick={handleCancel}
          variant="ghost"
          size="sm"
          className="text-luxury-cream/60 hover:text-luxury-cream"
        >
          Cancel
        </Button>
        {isRecording && (
          <Button
            onClick={stopRecording}
            variant="ghost"
            size="sm"
            className="text-luxury-gold hover:text-luxury-gold/80"
          >
            Stop Recording
          </Button>
        )}
      </div>
    </div>
  );
};
