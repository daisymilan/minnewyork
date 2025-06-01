
import React from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ProcessingStatusProps {
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  filename?: string;
  progress?: number;
  totalLeads?: number;
  processedLeads?: number;
  error?: string;
  workflowSteps?: string[];
  currentStep?: string;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  status,
  filename,
  progress = 0,
  totalLeads,
  processedLeads,
  error,
  workflowSteps = [],
  currentStep
}) => {
  if (status === 'idle') return null;

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin text-luxury-gold" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'uploading':
        return `Uploading ${filename}...`;
      case 'processing':
        return `Processing ${filename} through N8N workflow...`;
      case 'completed':
        return `✅ Successfully processed ${totalLeads} leads`;
      case 'error':
        return `❌ Error: ${error}`;
      default:
        return '';
    }
  };

  return (
    <div className="bg-luxury-black/50 border border-luxury-gold/20 rounded-lg p-6 space-y-4">
      <div className="flex items-center space-x-3">
        {getStatusIcon()}
        <div>
          <h3 className="font-medium text-luxury-cream">
            {status === 'processing' ? 'Processing Status' : 
             status === 'uploading' ? 'Upload Status' :
             status === 'completed' ? 'Processing Complete' : 'Error'}
          </h3>
          <p className="text-sm text-luxury-cream/60">{getStatusMessage()}</p>
        </div>
      </div>

      {(status === 'uploading' || status === 'processing') && (
        <div className="space-y-2">
          <div className="w-full bg-luxury-black/50 rounded-full h-2">
            <div 
              className="bg-luxury-gold h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-luxury-cream/50">
            <span>{progress}% complete</span>
            {processedLeads && totalLeads && (
              <span>{processedLeads} / {totalLeads} leads</span>
            )}
          </div>
        </div>
      )}

      {status === 'processing' && workflowSteps.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-luxury-cream">Workflow Progress:</h4>
          <div className="space-y-1">
            {workflowSteps.map((step, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                {step === currentStep ? (
                  <Loader2 className="h-3 w-3 animate-spin text-luxury-gold" />
                ) : workflowSteps.indexOf(currentStep || '') > index ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <div className="h-3 w-3 rounded-full border border-luxury-cream/30" />
                )}
                <span className={step === currentStep ? 'text-luxury-gold font-medium' : 'text-luxury-cream/60'}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
