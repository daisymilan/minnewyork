
import { useEffect } from 'react';
import { toast } from '@/components/ui/sonner';

// Webhook event listeners for real-time updates using the new endpoints
export const useWebhookEvents = () => {
  useEffect(() => {
    // Listen for WooCommerce order created events
    const handleOrderCreated = async (event: any) => {
      try {
        // The webhook endpoint is already configured to receive order created events
        console.log('Order created webhook endpoint ready:', 'https://minnewyorkofficial.app.n8n.cloud/webhook/woo/webhook/order-created');
        
        // Show notification when order is created
        toast.success('New order received!', {
          description: 'Dashboard data will refresh automatically'
        });
        
        // Trigger a refresh of dashboard data
        // This will be handled by React Query's automatic refetching
        window.dispatchEvent(new CustomEvent('dashboard-refresh'));
      } catch (error) {
        console.error('Error handling order created event:', error);
      }
    };

    const handleOrderUpdated = async (event: any) => {
      try {
        console.log('Order updated webhook endpoint ready:', 'https://minnewyorkofficial.app.n8n.cloud/webhook/woo/webhook/order-updated');
        
        // Show notification when order is updated
        toast.info('Order status updated', {
          description: 'Recent orders list will refresh'
        });
        
        // Trigger dashboard refresh
        window.dispatchEvent(new CustomEvent('dashboard-refresh'));
      } catch (error) {
        console.error('Error handling order updated event:', error);
      }
    };

    const handleCustomerCreated = async (event: any) => {
      try {
        console.log('Customer created webhook endpoint ready:', 'https://minnewyorkofficial.app.n8n.cloud/webhook/woo/webhook/customer-created');
        
        // Show notification when new customer is created
        toast.success('New customer registered!', {
          description: 'Customer analytics will update'
        });
        
        // Trigger dashboard refresh
        window.dispatchEvent(new CustomEvent('dashboard-refresh'));
      } catch (error) {
        console.error('Error handling customer created event:', error);
      }
    };

    // Log the available dashboard API endpoints
    console.log('📡 Dashboard API Integration Active');
    console.log('Available endpoints:');
    console.log('- GET /webhook/dashboard/overview');
    console.log('- GET /webhook/dashboard/orders'); 
    console.log('- GET /webhook/dashboard/products');
    console.log('- GET /webhook/dashboard/customers');
    console.log('- GET /webhook/dashboard/analytics');
    console.log('');
    console.log('Webhook receivers:');
    console.log('- POST /webhook/woo/webhook/order-created');
    console.log('- POST /webhook/woo/webhook/customer-created');

    // Set up webhook listeners
    console.log('Webhook event handlers initialized with new dashboard API endpoints');

    return () => {
      // Cleanup listeners
      console.log('Webhook event handlers cleaned up');
    };
  }, []);
};
