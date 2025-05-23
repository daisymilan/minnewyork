
// Marketing API service for abandoned cart and reorder reminders
export interface AbandonedCart {
  customer_email: string;
  cart_value: number;
  abandoned_at: string;
  products: string[];
}

export interface ReorderReminder {
  customer_email: string;
  last_order_date: string;
  suggested_products: string[];
}

export const marketingApi = {
  async triggerAbandonedCartReminder(cartData: AbandonedCart): Promise<boolean> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/marketing/abandoned-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartData),
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error sending abandoned cart reminder:', error);
      return false;
    }
  },

  async triggerReorderReminder(reminderData: ReorderReminder): Promise<boolean> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/marketing/reorder-reminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reminderData),
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error sending reorder reminder:', error);
      return false;
    }
  }
};
