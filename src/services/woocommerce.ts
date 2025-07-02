
// WooCommerce API service for orders, products, and customers
export interface Order {
  id: string;
  customer_name: string;
  product_name: string;
  amount: number;
  status: string;
  date_created: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  status: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  total_spent: number;
  orders_count: number;
}

export const woocommerceApi = {
  async getOrders(): Promise<Order[]> {
    try {
      console.log('🛒 Fetching WooCommerce orders (triggered by page refresh)');
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/woo/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      
      // Check if the response is an array of orders
      if (Array.isArray(data)) {
        return data;
      }
      
      // If the API returns a workflow message or non-array response, return mock data
      console.log('API returned non-array response:', data);
      return [
        {
          id: 'ORD-7346',
          customer_name: 'Emma Wilson',
          product_name: 'Moon Dance',
          amount: 195.00,
          status: 'delivered',
          date_created: new Date().toISOString()
        },
        {
          id: 'ORD-7345',
          customer_name: 'James Taylor',
          product_name: 'Long Board',
          amount: 240.00,
          status: 'shipped',
          date_created: new Date().toISOString()
        },
        {
          id: 'ORD-7344',
          customer_name: 'Sarah Johnson',
          product_name: 'Velvet Dreams',
          amount: 175.00,
          status: 'processing',
          date_created: new Date().toISOString()
        },
        {
          id: 'ORD-7343',
          customer_name: 'Michael Brown',
          product_name: 'Golden Hour',
          amount: 220.00,
          status: 'refunded',
          date_created: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Return mock data as fallback
      return [
        {
          id: 'ORD-7346',
          customer_name: 'Emma Wilson',
          product_name: 'Moon Dance',
          amount: 195.00,
          status: 'delivered',
          date_created: new Date().toISOString()
        },
        {
          id: 'ORD-7345',
          customer_name: 'James Taylor',
          product_name: 'Long Board',
          amount: 240.00,
          status: 'shipped',
          date_created: new Date().toISOString()
        }
      ];
    }
  },

  async getProducts(): Promise<Product[]> {
    try {
      console.log('📦 Fetching WooCommerce products (triggered by page refresh)');
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/woo/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      
      // Ensure we return an array
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  async getCustomers(): Promise<Customer[]> {
    try {
      console.log('👥 Fetching WooCommerce customers (triggered by page refresh)');
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/woo/customers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      
      const data = await response.json();
      
      // Ensure we return an array
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  }
};
