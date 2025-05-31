
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

export const B2BMenuItem = () => {
  const handleB2BClick = () => {
    window.location.href = '/b2b';
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start text-luxury-cream hover:bg-luxury-gold/20"
      onClick={handleB2BClick}
    >
      <Upload className="mr-2 h-4 w-4" />
      B2B Leads Upload
    </Button>
  );
};
