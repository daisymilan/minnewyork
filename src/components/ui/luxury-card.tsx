
import React from 'react';
import { cn } from '@/lib/utils';

interface LuxuryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'glass';
  shimmer?: boolean;
  children: React.ReactNode;
}

export const LuxuryCard = React.forwardRef<HTMLDivElement, LuxuryCardProps>(
  ({ className, variant = 'default', shimmer = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg p-4 transition-all duration-300 animate-fade-in',
          {
            'bg-luxury-black border border-luxury-gold/20 hover:border-luxury-gold/40': variant === 'default',
            'border border-luxury-gold/30 bg-transparent hover:border-luxury-gold/60': variant === 'outlined',
            'backdrop-blur-md bg-black/40 border border-white/10': variant === 'glass',
            'bg-[linear-gradient(110deg,transparent_33%,rgba(212,175,55,0.1)_50%,transparent_67%)] bg-[length:300%_100%] animate-shimmer': shimmer,
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

LuxuryCard.displayName = 'LuxuryCard';
