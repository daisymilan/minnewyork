
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const B2BMenuItem = () => {
  const navigate = useNavigate();

  const handleB2BClick = () => {
    navigate('/b2b');
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
