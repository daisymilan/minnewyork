
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { leadsApi, type ProcessingStatus, type Lead } from '@/services/leadsApi';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { ProcessingStatus as ProcessingStatusComponent } from './ProcessingStatus';
import { IntegrationResults } from './IntegrationResults';

interface LeadsUploaderProps {
  onUploadSuccess: () => void;
  onLeadsProcessed?: (leads: Lead[]) => void;
}

export const LeadsUploader: React.FC<LeadsUploaderProps> = ({ 
  onUploadSuccess, 
  onLeadsProcessed 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus | null>(null);
  const [currentFile, setCurrentFile] = useState<string>('');
  const [processedLeads, setProcessedLeads] = useState<Lead[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid Excel file (.xlsx, .xls) or CSV file');
      return;
    }

    setCurrentFile(file.name);
    setIsUploading(true);
    setProcessedLeads([]);
    setProcessingStatus(null);

    try {
      console.log('Uploading file to N8N webhook:', file.name);
      const result = await leadsApi.uploadToN8N(file);
      
      if (result.status === 'processing' && result.session_id) {
        toast.success(`File uploaded successfully! Processing through N8N workflow...`);
        
        // Set initial processing status
        setProcessingStatus({
          session_id: result.session_id,
          status: 'processing',
          progress: { processed_leads: 0, total_leads: 0, percentage: 0 },
          current_step: 'File uploaded and extracted',
          workflow_steps: [
            'File uploaded and extracted',
            'Headers cleaned',
            'Duplicates removed',
            'Processing contacts',
            'Adding to HubSpot',
            'Adding to Klaviyo',
            'Creating WooCommerce customers'
          ]
        });

        // Start polling for status updates
        const cleanup = leadsApi.startStatusPolling(
          result.session_id,
          (status) => {
            console.log('Status update:', status);
            setProcessingStatus(status);
            
            if (status.status === 'completed') {
              if (status.leads) {
                setProcessedLeads(status.leads);
                onLeadsProcessed?.(status.leads);
                toast.success(`Successfully processed ${status.leads.length} leads!`);
              }
              onUploadSuccess();
            } else if (status.status === 'error') {
              toast.error(status.error || 'Processing failed');
            }
          }
        );
      } else {
        toast.error(result.message || 'Failed to upload leads');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('An error occurred while uploading the file');
      setProcessingStatus(null);
    } finally {
      setIsUploading(false);
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="flex items-center space-x-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <Button
          onClick={handleFileSelect}
          disabled={isUploading || processingStatus?.status === 'processing'}
          className="bg-luxury-gold text-luxury-black hover:bg-luxury-gold/80"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-luxury-black mr-2"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Leads
            </>
          )}
        </Button>
        
        <div className="text-sm text-luxury-cream/60 flex items-center">
          <FileSpreadsheet className="mr-1 h-4 w-4" />
          .xlsx, .xls, .csv files supported
        </div>
      </div>

      {/* Processing Status */}
      {processingStatus && (
        <ProcessingStatusComponent
          status={processingStatus.status}
          filename={currentFile}
          progress={processingStatus.progress?.percentage || 0}
          totalLeads={processingStatus.progress?.total_leads}
          processedLeads={processingStatus.progress?.processed_leads}
          error={processingStatus.error}
          workflowSteps={processingStatus.workflow_steps}
          currentStep={processingStatus.current_step}
        />
      )}

      {/* Integration Results */}
      {processingStatus?.status === 'completed' && processingStatus.processing_summary && (
        <IntegrationResults
          results={{
            hubspot_contacts_created: processingStatus.processing_summary.hubspot_contacts_created,
            klaviyo_contacts_added: processingStatus.processing_summary.klaviyo_contacts_added,
            woocommerce_customers_created: processingStatus.processing_summary.woocommerce_customers_created,
            duplicates_removed: processingStatus.processing_summary.duplicates_removed,
            invalid_emails: processingStatus.processing_summary.invalid_emails
          }}
          totalProcessed={processingStatus.processing_summary.total_processed}
        />
      )}

      {/* Processed Leads Summary */}
      {processedLeads.length > 0 && (
        <div className="bg-luxury-black/50 border border-luxury-gold/20 rounded-lg p-4">
          <h4 className="text-luxury-gold font-medium mb-2">Processed Leads Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-red-400 font-bold text-xl">
                {processedLeads.filter(l => l.priority === 'high').length}
              </div>
              <div className="text-luxury-cream/60">High Priority</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-400 font-bold text-xl">
                {processedLeads.filter(l => l.priority === 'medium').length}
              </div>
              <div className="text-luxury-cream/60">Medium Priority</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-bold text-xl">
                {processedLeads.filter(l => l.priority === 'research').length}
              </div>
              <div className="text-luxury-cream/60">Research Needed</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 font-bold text-xl">
                {processedLeads.filter(l => l.priority === 'low').length}
              </div>
              <div className="text-luxury-cream/60">Low Priority</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
