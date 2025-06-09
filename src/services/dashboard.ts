// Dashboard API service for comprehensive dashboard data
export interface DashboardOrder {
  id: string;
  customer_name: string;
  customer_email?: string;
  product_name: string;
  amount: number;
  status: string;
  date_created: string;
  region?: string;
  items_count?: number;
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
      
      console.log('📦 Raw orders response:', result);
      
      // Check if there's an error in the response
      if (result.error) {
        console.log('📦 Orders API returned error:', result.error);
        return {
          orders: [],
          summary: {
            total_orders: 0,
            total_revenue: 0,
            orders_by_region: {}
          }
        };
      }
      
      // Handle the actual webhook structure - it's an array with one object
      let ordersData = result;
      if (Array.isArray(result) && result.length > 0) {
        ordersData = result[0];
      }
      
      if (ordersData.orders && Array.isArray(ordersData.orders)) {
        // Map the n8n order structure to our dashboard interface
        const mappedOrders: DashboardOrder[] = ordersData.orders.map((order: any) => ({
          id: order.order_number || order.id.toString(),
          customer_name: order.customer_name || 'Unknown Customer',
          customer_email: order.customer_email,
          product_name: `Order #${order.order_number || order.id}`, // Since product name isn't in the response
          amount: parseFloat(order.total) || 0,
          status: order.status || 'unknown',
          date_created: order.date_created || new Date().toISOString(),
          region: order.customer_country || 'Unknown',
          items_count: order.items_count || 1
        }));
        
        const summary = {
          total_orders: ordersData.count || ordersData.orders.length,
          total_revenue: ordersData.orders.reduce((sum: number, order: any) => sum + (parseFloat(order.total) || 0), 0),
          orders_by_region: {} // Could be calculated if needed
        };
        
        console.log('📦 Processed orders:', mappedOrders);
        return {
          orders: mappedOrders,
          summary
        };
      }
      
      // Return empty data if parsing fails
      return {
        orders: [],
        summary: {
          total_orders: 0,
          total_revenue: 0,
          orders_by_region: {}
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard orders:', error);
      return {
        orders: [],
        summary: {
          total_orders: 0,
          total_revenue: 0,
          orders_by_region: {}
        }
      };
    }
  },

  async getProducts(): Promise<{ products: DashboardProduct[]; insights: any }> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/dashboard/products');
      const result = await response.json();
      
      console.log('📦 Raw products response:', result);
      
      // Handle the new response structure - it's an array with one object containing products
      let productsData = result;
      if (Array.isArray(result) && result.length > 0) {
        productsData = result[0];
      }
      
      if (productsData.products && Array.isArray(productsData.products)) {
        // Map the actual product structure to our dashboard interface
        const mappedProducts: DashboardProduct[] = productsData.products.map((product: any) => ({
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          stock_quantity: product.stock_quantity,
          status: product.status,
          sales_count: product.sales_count || 0
        }));
        
        // Calculate insights from the actual product data
        const totalProducts = productsData.count || productsData.products.length;
        const lowStockProducts = productsData.products.filter((p: any) => 
          p.stock_status === 'outofstock' || (p.manage_stock && p.stock_quantity <= 5)
        ).length;
        
        console.log('📦 Processed products:', mappedProducts.length);
        console.log('📦 Low stock alerts:', lowStockProducts);
        
        return {
          products: mappedProducts,
          insights: {
            total_products: totalProducts,
            low_stock_alerts: lowStockProducts
          }
        };
      }
      
      // Return empty data if parsing fails
      return {
        products: [],
        insights: {
          total_products: 0,
          low_stock_alerts: 0
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard products:', error);
      // Return fallback data instead of throwing
      return {
        products: [],
        insights: {
          total_products: 89,
          low_stock_alerts: 5
        }
      };
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
