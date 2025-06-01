
import React from 'react';
import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const B2BMenuItem = () => {
  const navigate = useNavigate();

  const handleB2BClick = () => {
    navigate('/b2b');
  };

  return (
    <a 
      onClick={handleB2BClick}
      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-luxury-gold/10 hover:text-luxury-gold cursor-pointer"
    >
      <Upload className="h-5 w-5 text-luxury-gold/80" />
      <span>B2B Leads Upload</span>
    </a>
  );
};
