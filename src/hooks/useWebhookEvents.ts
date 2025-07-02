
import { useEffect } from 'react';
import { toast } from '@/components/ui/sonner';

// Webhook event listeners - dashboard webhooks run every 4 hours
export const useWebhookEvents = () => {
  useEffect(() => {
    console.log('📡 Dashboard API Integration Active');
    console.log('Dashboard endpoints (4-hour interval):');
    console.log('- GET /webhook/dashboard/overview');
    console.log('- GET /webhook/dashboard/orders'); 
    console.log('- GET /webhook/dashboard/products');
    console.log('- GET /webhook/dashboard/customers');
    console.log('- GET /webhook/dashboard/analytics');
    console.log('');
    console.log('WooCommerce endpoints (4-hour interval):');
    console.log('- GET /webhook/woo/orders');
    console.log('- GET /webhook/woo/products');
    console.log('- GET /webhook/woo/customers');
    console.log('');
    console.log('Real-time webhooks (triggered by actions):');
    console.log('- POST /webhook/woo/webhook/order-created (WooCommerce events)');
    console.log('- POST /webhook/woo/webhook/customer-created (WooCommerce events)');
    console.log('- POST /webhook/auth/signin (Login action)');
    console.log('- POST /webhook/auth/signup (Registration action)');
    console.log('- POST /webhook/auth/voice-login (Voice login action)');
    console.log('- POST /webhook/support/ticket-created (Support ticket creation)');
    console.log('- POST /webhook/support/chat-message (Support chat message)');

    return () => {
      console.log('Webhook event handlers cleaned up');
    };
  }, []);
};
