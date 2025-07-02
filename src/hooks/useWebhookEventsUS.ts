
import { useEffect } from 'react';
import { toast } from '@/components/ui/sonner';

// US-specific webhook event listeners - dashboard webhooks run every 4 hours
export const useWebhookEventsUS = () => {
  useEffect(() => {
    console.log('📡 US Dashboard API Integration Active');
    console.log('US Dashboard endpoints (4-hour interval):');
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
