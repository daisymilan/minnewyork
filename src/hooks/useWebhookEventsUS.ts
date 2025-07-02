
import { useEffect } from 'react';
import { toast } from '@/components/ui/sonner';

// US-specific webhook event listeners - dashboard webhooks run every 4 hours
export const useWebhookEventsUS = () => {
  // Webhook events are now handled by 4-hour intervals in the service files
  // No longer triggering on component mount to avoid refresh-based calls
  
  useEffect(() => {
    // Only log once that the US webhook system is active, without triggering calls
    console.log('📡 US Webhook system initialized - running on 4-hour intervals');
    
    return () => {
      console.log('US Webhook event handlers cleaned up');
    };
  }, []);
};
