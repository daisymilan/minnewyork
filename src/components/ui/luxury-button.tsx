
import React from 'react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';

interface LuxuryButtonProps extends ButtonProps {
  gradient?: boolean;
  glowing?: boolean;
}

export const LuxuryButton = React.forwardRef<HTMLButtonElement, LuxuryButtonProps>(
  ({ className, gradient = false, glowing = false, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          'font-display tracking-wide transition-all duration-300',
          {
            'bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-black': !gradient && !props.variant,
            'bg-gold-gradient hover:brightness-110 text-luxury-black': gradient,
            'shadow-[0_0_10px_rgba(212,175,55,0.5)]': glowing,
          },
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

LuxuryButton.displayName = 'LuxuryButton';
