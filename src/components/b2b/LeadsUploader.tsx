
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { b2bKingApi } from '@/services/b2bking';
import { Upload, FileSpreadsheet } from 'lucide-react';

interface LeadsUploaderProps {
  onUploadSuccess: () => void;
}

export const LeadsUploader: React.FC<LeadsUploaderProps> = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
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

    setIsUploading(true);

    try {
      const result = await b2bKingApi.uploadLeads(file);
      
      if (result.success) {
        toast.success(`Successfully imported ${result.leads_imported || 0} leads`);
        onUploadSuccess();
      } else {
        toast.error(result.message || 'Failed to upload leads');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('An error occurred while uploading the file');
    } finally {
      setIsUploading(false);
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
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
        disabled={isUploading}
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
  );
};
