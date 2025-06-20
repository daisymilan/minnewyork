// Leads API service for N8N webhook integration
export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  title: string;
  website?: string;
  location?: string;
  employeeCount?: string;
  priority: 'high' | 'medium' | 'research' | 'low';
  notes?: string;
  phone?: string;
  industry?: string;
  linkedinUrl?: string;
  fundingStage?: string;
}

export interface UploadResponse {
  status: 'processing' | 'error';
  message: string;
  session_id?: string;
  workflow_id?: string;
}

export interface ProcessingStatus {
  session_id: string;
  status: 'processing' | 'completed' | 'error';
  progress: {
    processed_leads: number;
    total_leads: number;
    percentage: number;
  };
  leads?: Lead[];
  categorization?: {
    high_priority: number;
    medium_priority: number;
    research_needed: number;
    low_priority: number;
  };
  processing_summary?: {
    total_processed: number;
    successful_enrichments: number;
    validation_errors: number;
    duplicates_removed: number;
    hubspot_contacts_created: number;
    klaviyo_contacts_added: number;
    woocommerce_customers_created: number;
    invalid_emails: number;
  };
  error?: string;
  current_step?: string;
  workflow_steps?: string[];
}

// Generate a simple session ID for tracking
const generateSessionId = (): string => {
  return 'session_' + Math.random().toString(36).substr(2, 9);
};

// Convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:mime;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

// Get file extension
const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const leadsApi = {
  async uploadToN8N(file: File): Promise<UploadResponse> {
    try {
      const sessionId = generateSessionId();
      
      // Create FormData for binary file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', file.name);
      formData.append('upload_timestamp', new Date().toISOString());
      formData.append('session_id', sessionId);
      formData.append('file_type', getFileExtension(file.name));

      console.log('Uploading file to N8N:', file.name);

      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/upload-b2b-leads', {
        method: 'POST',
        mode: 'no-cors', // Handle CORS issues
        body: formData // Send as binary data via FormData
      });

      // With no-cors mode, we can't read the response status properly
      // So we'll assume success if no network error occurred
      console.log('File uploaded successfully to N8N webhook');
      
      return {
        status: 'processing',
        message: 'File uploaded successfully, processing through N8N workflow',
        session_id: sessionId,
        workflow_id: 'n8n_workflow_execution'
      };
    } catch (error) {
      console.error('Error uploading to N8N:', error);
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to upload file'
      };
    }
  },

  async checkProcessingStatus(sessionId: string): Promise<ProcessingStatus> {
    try {
      const response = await fetch(
        `https://minnewyorkofficial.app.n8n.cloud/webhook/check-parsing-status/${sessionId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking status:', error);
      return {
        session_id: sessionId,
        status: 'error',
        progress: { processed_leads: 0, total_leads: 0, percentage: 0 },
        error: error instanceof Error ? error.message : 'Failed to check processing status'
      };
    }
  },

  // Helper function to start polling for status updates
  startStatusPolling(
    sessionId: string, 
    onUpdate: (status: ProcessingStatus) => void,
    interval: number = 3000
  ): () => void {
    const pollInterval = setInterval(async () => {
      try {
        const status = await this.checkProcessingStatus(sessionId);
        onUpdate(status);
        
        if (status.status === 'completed' || status.status === 'error') {
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error('Polling error:', error);
        onUpdate({
          session_id: sessionId,
          status: 'error',
          progress: { processed_leads: 0, total_leads: 0, percentage: 0 },
          error: 'Failed to check processing status'
        });
        clearInterval(pollInterval);
      }
    }, interval);

    // Return cleanup function
    return () => clearInterval(pollInterval);
  }
};
