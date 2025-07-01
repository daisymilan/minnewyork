
import { useEffect } from 'react';
import { toast } from '@/components/ui/sonner';

// Webhook event listeners - now only triggered on page refresh
export const useWebhookEvents = () => {
  useEffect(() => {
    // Remove automatic polling - webhooks will only be called on page refresh
    // The React Query hooks will handle data fetching when components mount
    
    console.log('📡 Dashboard API Integration Active');
    console.log('Dashboard endpoints (triggered on page refresh only):');
    console.log('- GET /webhook/dashboard/overview');
    console.log('- GET /webhook/dashboard/orders'); 
    console.log('- GET /webhook/dashboard/products');
    console.log('- GET /webhook/dashboard/customers');
    console.log('- GET /webhook/dashboard/analytics');
    console.log('');
    console.log('Real-time webhooks (triggered by actions):');
    console.log('- POST /webhook/woo/webhook/order-created (WooCommerce events)');
    console.log('- POST /webhook/woo/webhook/customer-created (WooCommerce events)');
    console.log('- POST /webhook/auth/signin (Login action)');
    console.log('- POST /webhook/auth/signup (Registration action)');
    console.log('- POST /webhook/auth/voice-login (Voice login action)');

    return () => {
      console.log('Webhook event handlers cleaned up');
    };
  }, []);
};
