
import { useEffect } from 'react';
import { toast } from '@/components/ui/sonner';

// US-specific webhook event listeners - now only triggered on page refresh
export const useWebhookEventsUS = () => {
  useEffect(() => {
    // Remove automatic polling - webhooks will only be called on page refresh
    // The React Query hooks will handle data fetching when components mount
    
    console.log('📡 US Dashboard API Integration Active');
    console.log('US Dashboard endpoints (triggered on page refresh only):');
    console.log('- GET /webhook/dashboard/overview-us');
    console.log('- GET /webhook/dashboard/orders-us'); 
    console.log('- GET /webhook/dashboard/products-us');
    console.log('- GET /webhook/dashboard/customers-us');
    console.log('- GET /webhook/dashboard/analytics-us');
    console.log('');
    console.log('US Real-time webhooks (triggered by actions):');
    console.log('- POST /webhook/woo/webhook/order-created-us (WooCommerce events)');
    console.log('- POST /webhook/woo/webhook/customer-created-us (WooCommerce events)');

    return () => {
      console.log('US Webhook event handlers cleaned up');
    };
  }, []);
};
