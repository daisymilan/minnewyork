
// US Dashboard API service for US-specific dashboard data
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
  stock_status: string;
  status: string;
  sales_count?: number;
  sku?: string;
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

export const dashboardUSApi = {
  async getOverview(): Promise<DashboardOverview> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/dashboard/overview-us');
      const result = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      }
      
      // Return fallback data if API fails
      return {
        summary_cards: {
          revenue: 150000,
          orders: 687,
          customers: 456,
          products: 45
        },
        regional_breakdown: {
          'West Coast': 35,
          'East Coast': 30,
          'Central': 25,
          'South': 10
        },
        fulfillment_status: {
          'Processing': 12,
          'Shipped': 89,
          'Delivered': 586
        },
        recent_activity: []
      };
    } catch (error) {
      console.error('Error fetching US dashboard overview:', error);
      throw error;
    }
  },

  async getOrders(): Promise<{ orders: DashboardOrder[]; summary: any }> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/dashboard/orders-us');
      const result = await response.json();
      
      console.log('📦 Raw US orders response:', result);
      
      if (result.error) {
        console.log('📦 US Orders API returned error:', result.error);
        return {
          orders: [],
          summary: {
            total_orders: 0,
            total_revenue: 0,
            orders_by_region: {}
          }
        };
      }
      
      let ordersData = result;
      if (Array.isArray(result) && result.length > 0) {
        ordersData = result[0];
      }
      
      if (ordersData.orders && Array.isArray(ordersData.orders)) {
        const mappedOrders: DashboardOrder[] = ordersData.orders.map((order: any) => ({
          id: order.order_number || order.id.toString(),
          customer_name: order.customer_name || 'Unknown Customer',
          customer_email: order.customer_email,
          product_name: `Order #${order.order_number || order.id}`,
          amount: parseFloat(order.total) || 0,
          status: order.status || 'unknown',
          date_created: order.date_created || new Date().toISOString(),
          region: order.customer_state || 'Unknown',
          items_count: order.items_count || 1
        }));
        
        const summary = {
          total_orders: ordersData.count || ordersData.orders.length,
          total_revenue: ordersData.orders.reduce((sum: number, order: any) => sum + (parseFloat(order.total) || 0), 0),
          orders_by_region: {}
        };
        
        console.log('📦 Processed US orders:', mappedOrders);
        return {
          orders: mappedOrders,
          summary
        };
      }
      
      return {
        orders: [],
        summary: {
          total_orders: 0,
          total_revenue: 0,
          orders_by_region: {}
        }
      };
    } catch (error) {
      console.error('Error fetching US dashboard orders:', error);
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
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/dashboard/products-us');
      const result = await response.json();
      
      console.log('📦 Raw US products response:', result);
      
      let productsData = result;
      if (Array.isArray(result) && result.length > 0) {
        productsData = result[0];
      }
      
      if (productsData.products && Array.isArray(productsData.products)) {
        const mappedProducts: DashboardProduct[] = productsData.products.map((product: any) => ({
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          stock_quantity: product.stock_quantity,
          stock_status: product.stock_status,
          status: product.status,
          sales_count: product.sales_count || 0,
          sku: product.sku
        }));
        
        const totalProducts = productsData.count || productsData.products.length;
        const lowStockProducts = productsData.products.filter((p: any) => 
          p.stock_status === 'outofstock' || (p.manage_stock && p.stock_quantity <= 5)
        ).length;
        
        console.log('📦 Processed US products:', mappedProducts.length);
        console.log('📦 US Low stock alerts:', lowStockProducts);
        
        return {
          products: mappedProducts,
          insights: {
            total_products: totalProducts,
            low_stock_alerts: lowStockProducts
          }
        };
      }
      
      return {
        products: [],
        insights: {
          total_products: 0,
          low_stock_alerts: 0
        }
      };
    } catch (error) {
      console.error('Error fetching US dashboard products:', error);
      return {
        products: [],
        insights: {
          total_products: 45,
          low_stock_alerts: 2
        }
      };
    }
  },

  async getCustomers(): Promise<{ customers: DashboardCustomer[]; insights: any }> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/dashboard/customers-us');
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
          total_customers: 456,
          customer_segments: { 'VIP': 23, 'Premium': 78 }
        }
      };
    } catch (error) {
      console.error('Error fetching US dashboard customers:', error);
      throw error;
    }
  },

  async getAnalytics(): Promise<DashboardAnalytics> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/dashboard/analytics-us');
      const result = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      }
      
      return {
        revenue_chart: {
          labels: ['Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5'],
          datasets: [{
            label: 'Revenue',
            data: [65, 72, 78, 85, 92]
          }]
        },
        kpis: {
          total_revenue: 150000,
          total_orders: 687,
          total_customers: 456,
          growth_rate: 6.5,
          conversion_rate: 2.8,
          average_order_value: 218
        }
      };
    } catch (error) {
      console.error('Error fetching US dashboard analytics:', error);
      throw error;
    }
  },

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
      console.error('Error fetching all US dashboard data:', error);
      throw error;
    }
  }
};
