
import React, { useState, useCallback } from 'react';
import { FileUpload } from './FileUpload';
import { ProcessingStatus } from './ProcessingStatus';
import { IntegrationResults } from './IntegrationResults';
import { LeadsSection } from './LeadsSection';
import { leadsApi, type Lead, type ProcessingStatus as Status } from '@/services/leadsApi';
import { toast } from '@/components/ui/sonner';

const B2BDashboard = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<Status | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [currentFile, setCurrentFile] = useState<string>('');

  // File upload configuration
  const acceptedFormats = ['.csv', '.xlsx', '.xls', '.json'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleFileUpload = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0]; // Process first file
    setCurrentFile(file.name);
    setIsUploading(true);
    setLeads([]);
    setProcessingStatus(null);

    try {
      console.log('Starting file upload:', file.name);
      
      // Upload to N8N
      const uploadResponse = await leadsApi.uploadToN8N(file);
      
      if (uploadResponse.status === 'error') {
        toast.error(uploadResponse.message);
        setIsUploading(false);
        return;
      }

      if (uploadResponse.session_id) {
        toast.success('File uploaded successfully. Processing...');
        
        // Start polling for status updates
        const cleanup = leadsApi.startStatusPolling(
          uploadResponse.session_id,
          (status) => {
            console.log('Status update:', status);
            setProcessingStatus(status);
            
            if (status.status === 'completed' && status.leads) {
              setLeads(status.leads);
              toast.success(`Successfully processed ${status.leads.length} leads!`);
            } else if (status.status === 'error') {
              toast.error(status.error || 'Processing failed');
            }
          }
        );

        // Set initial processing status
        setProcessingStatus({
          session_id: uploadResponse.session_id,
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
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, []);

  // Group leads by priority
  const groupedLeads = {
    high: leads.filter(lead => lead.priority === 'high'),
    medium: leads.filter(lead => lead.priority === 'medium'),
    research: leads.filter(lead => lead.priority === 'research'),
    low: leads.filter(lead => lead.priority === 'low')
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              📊 B2B Lead Processing Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Upload lead files and watch them get processed through your N8N workflow
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📤 Upload Leads Section
            </h2>
            <FileUpload
              onUpload={handleFileUpload}
              acceptedFormats={acceptedFormats}
              maxFileSize={maxFileSize}
              isLoading={isUploading}
            />
          </div>

          {/* Processing Status */}
          {processingStatus && (
            <ProcessingStatus
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

          {/* Leads Display */}
          {leads.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Processed Leads</h2>
              
              <LeadsSection
                title="🔥 High Priority Leads"
                leads={groupedLeads.high}
                priority="high"
                isCollapsible={true}
              />
              
              <LeadsSection
                title="⚡ Medium Priority Leads"
                leads={groupedLeads.medium}
                priority="medium"
                isCollapsible={true}
              />
              
              <LeadsSection
                title="🔍 Research Needed"
                leads={groupedLeads.research}
                priority="research"
                isCollapsible={true}
              />
              
              <LeadsSection
                title="📋 Low Priority Leads"
                leads={groupedLeads.low}
                priority="low"
                isCollapsible={true}
              />
            </div>
          )}

          {/* Empty State */}
          {!processingStatus && leads.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Ready to Process Leads
              </h3>
              <p className="text-gray-600">
                Upload your CSV, Excel, or JSON files to get started with lead processing
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default B2BDashboard;
