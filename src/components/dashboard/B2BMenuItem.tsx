
import React from 'react';
import { Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const B2BMenuItem = () => {
  const navigate = useNavigate();

  const handleB2BKingClick = () => {
    navigate('/b2bking');
  };

  return (
    <a 
      onClick={handleB2BKingClick}
      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-luxury-gold/10 hover:text-luxury-gold cursor-pointer"
    >
      <Building2 className="h-5 w-5 text-luxury-gold/80" />
      <span>B2BKing Dashboard</span>
    </a>
  );
};
