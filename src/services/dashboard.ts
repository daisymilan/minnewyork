
// Dashboard API service for comprehensive dashboard data
export interface DashboardOrder {
  id: string;
  customer_name: string;
  product_name: string;
  amount: number;
  status: string;
  date_created: string;
  region?: string;
}

export interface DashboardProduct {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  status: string;
  sales_count?: number;
}

export interface DashboardCustomer {
  id: string;
  name: string;
  email: string;
  total_spent: number;
  orders_count: number;
  segment?: string;
}

export interface DashboardKPIs {
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  growth_rate: number;
  conversion_rate?: number;
  average_order_value?: number;
}

export interface DashboardOverview {
  summary_cards: {
    revenue: number;
    orders: number;
    customers: number;
    products: number;
  };
  regional_breakdown: {
    [key: string]: number;
  };
  fulfillment_status: {
    [key: string]: number;
  };
  recent_activity: any[];
}

export interface DashboardAnalytics {
  revenue_chart: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
    }>;
  };
  kpis: DashboardKPIs;
}

export const dashboardApi = {
  async getOverview(): Promise<DashboardOverview> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/dashboard/overview');
      const result = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      }
      
      // Return fallback data if API fails
      return {
        summary_cards: {
          revenue: 283450,
          orders: 1254,
          customers: 892,
          products: 89
        },
        regional_breakdown: {
          'North America': 42,
          'Europe': 28,
          'Middle East': 18,
          'Asia': 12
        },
        fulfillment_status: {
          'Processing': 23,
          'Shipped': 156,
          'Delivered': 1075
        },
        recent_activity: []
      };
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      throw error;
    }
  },

  async getOrders(): Promise<{ orders: DashboardOrder[]; summary: any }> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/dashboard/orders');
      const result = await response.json();
      
      if (result.success && result.data) {
        return {
          orders: result.data.recent_orders || result.data.orders || [],
          summary: result.data.summary || {}
        };
      }
      
      // Return fallback data
      return {
        orders: [
          {
            id: 'ORD-7346',
            customer_name: 'Emma Wilson',
            product_name: 'Moon Dance',
            amount: 195.00,
            status: 'delivered',
            date_created: new Date().toISOString(),
            region: 'USA'
          }
        ],
        summary: {
          total_orders: 156,
          total_revenue: 12345.67,
          orders_by_region: { 'USA': 68, 'Europe': 52, 'GCC': 36 }
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard orders:', error);
      throw error;
    }
  },

  async getProducts(): Promise<{ products: DashboardProduct[]; insights: any }> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/dashboard/products');
      const result = await response.json();
      
      if (result.success && result.data) {
        return {
          products: result.data.top_products || result.data.products || [],
          insights: result.data.inventory_insights || {}
        };
      }
      
      return {
        products: [],
        insights: {
          total_products: 89,
          low_stock_alerts: 5
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard products:', error);
      throw error;
    }
  },

  async getCustomers(): Promise<{ customers: DashboardCustomer[]; insights: any }> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/dashboard/customers');
      const result = await response.json();
      
      if (result.success && result.data) {
        return {
          customers: result.data.top_customers || result.data.customers || [],
          insights: result.data.customer_insights || {}
        };
      }
      
      return {
        customers: [],
        insights: {
          total_customers: 1234,
          customer_segments: { 'VIP': 45, 'Premium': 156 }
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard customers:', error);
      throw error;
    }
  },

  async getAnalytics(): Promise<DashboardAnalytics> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/dashboard/analytics');
      const result = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      }
      
      return {
        revenue_chart: {
          labels: ['Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5'],
          datasets: [{
            label: 'Revenue',
            data: [120, 135, 142, 158, 175]
          }]
        },
        kpis: {
          total_revenue: 283450,
          total_orders: 1254,
          total_customers: 892,
          growth_rate: 8.9,
          conversion_rate: 3.2,
          average_order_value: 226
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      throw error;
    }
  },

  // Utility function to fetch all dashboard data at once
  async getAllDashboardData() {
    try {
      const [overview, orders, products, customers, analytics] = await Promise.all([
        this.getOverview(),
        this.getOrders(),
        this.getProducts(),
        this.getCustomers(),
        this.getAnalytics()
      ]);

      return {
        overview,
        orders,
        products,
        customers,
        analytics
      };
    } catch (error) {
      console.error('Error fetching all dashboard data:', error);
      throw error;
    }
  }
};
