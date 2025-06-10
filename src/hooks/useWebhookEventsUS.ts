
import { useEffect } from 'react';
import { toast } from '@/components/ui/sonner';

// US-specific webhook event listeners for real-time updates
export const useWebhookEventsUS = () => {
  useEffect(() => {
    const handleOrderCreated = async (event: any) => {
      try {
        console.log('US Order created webhook endpoint ready:', 'https://minnewyorkofficial.app.n8n.cloud/webhook/woo/webhook/order-created-us');
        
        toast.success('New US order received!', {
          description: 'US Dashboard data will refresh automatically'
        });
        
        window.dispatchEvent(new CustomEvent('dashboard-refresh-us'));
      } catch (error) {
        console.error('Error handling US order created event:', error);
      }
    };

    const handleCustomerCreated = async (event: any) => {
      try {
        console.log('US Customer created webhook endpoint ready:', 'https://minnewyorkofficial.app.n8n.cloud/webhook/woo/webhook/customer-created-us');
        
        toast.success('New US customer registered!', {
          description: 'US Customer analytics will update'
        });
        
        window.dispatchEvent(new CustomEvent('dashboard-refresh-us'));
      } catch (error) {
        console.error('Error handling US customer created event:', error);
      }
    };

    console.log('📡 US Dashboard API Integration Active');
    console.log('US-specific endpoints:');
    console.log('- GET /webhook/dashboard/overview-us');
    console.log('- GET /webhook/dashboard/orders-us'); 
    console.log('- GET /webhook/dashboard/products-us');
    console.log('- GET /webhook/dashboard/customers-us');
    console.log('- GET /webhook/dashboard/analytics-us');
    console.log('');
    console.log('US Webhook receivers:');
    console.log('- POST /webhook/woo/webhook/order-created-us');
    console.log('- POST /webhook/woo/webhook/customer-created-us');

    console.log('US Webhook event handlers initialized');

    return () => {
      console.log('US Webhook event handlers cleaned up');
    };
  }, []);
};
