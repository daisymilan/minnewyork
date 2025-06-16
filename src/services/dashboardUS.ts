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
  conversion_trend?: number;
  aov_trend?: number;
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

// Helper function to safely parse JSON with fallback
const safeJsonParseUS = async (response: Response, fallbackData: any) => {
  try {
    const text = await response.text();
    if (!text.trim()) {
      console.log('📊 Empty US response, using fallback data');
      return fallbackData;
    }
    return JSON.parse(text);
  } catch (error) {
    console.log('📊 US JSON parse error, using fallback data:', error);
    return fallbackData;
  }
};

export const dashboardUSApi = {
  async getOverview(): Promise<DashboardOverview> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/dashboard/overview-us');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const fallbackData = {
        summary_cards: {
          revenue: 75000,
          orders: 42,
          customers: 89,
          products: 28
        },
        regional_breakdown: {
          'California': 25,
          'New York': 18,
          'Texas': 15,
          'Florida': 12,
          'Illinois': 8,
          'Other States': 22
        },
        fulfillment_status: {
          'delivered': 35,
          'shipped': 28,
          'processing': 20,
          'pending': 17
        },
        recent_activity: []
      };
      
      const result = await safeJsonParseUS(response, fallbackData);
      
      console.log('📊 Raw US overview response:', result);
      
      // If we got fallback data, return it directly
      if (result === fallbackData) {
        return result;
      }
      
      // Handle successful API response structure
      if (result.success && result.data) {
        const data = result.data;
        
        const mappedOverview: DashboardOverview = {
          summary_cards: {
            revenue: parseFloat(data.summary_cards?.total_revenue?.value?.replace('$', '').replace(',', '') || '0'),
            orders: parseInt(data.summary_cards?.total_orders?.value || '0'),
            customers: parseInt(data.summary_cards?.total_customers?.value || '0'),
            products: data.quick_stats?.low_stock_alerts || 0
          },
          regional_breakdown: {},
          fulfillment_status: {},
          recent_activity: data.recent_activity || []
        };
        
        if (data.regional_breakdown) {
          Object.entries(data.regional_breakdown).forEach(([key, region]: [string, any]) => {
            mappedOverview.regional_breakdown[region.name] = parseFloat(region.percentage);
          });
        }
        
        if (data.fulfillment_status) {
          Object.entries(data.fulfillment_status).forEach(([key, fulfillment]: [string, any]) => {
            mappedOverview.fulfillment_status[fulfillment.name] = fulfillment.pending_orders || 0;
          });
        }
        
        return mappedOverview;
      }
      
      return fallbackData;
    } catch (error) {
      console.error('Error fetching US dashboard overview:', error);
      
      return {
        summary_cards: {
          revenue: 75000,
          orders: 42,
          customers: 89,
          products: 28
        },
        regional_breakdown: {
          'California': 25,
          'New York': 18,
          'Texas': 15,
          'Florida': 12,
          'Illinois': 8,
          'Other States': 22
        },
        fulfillment_status: {
          'delivered': 35,
          'shipped': 28,
          'processing': 20,
          'pending': 17
        },
        recent_activity: []
      };
    }
  },

  async getOrders(): Promise<{ orders: DashboardOrder[]; summary: any }> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/dashboard/orders-us');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const fallbackData = {
        orders: [
          {
            id: '2001',
            customer_name: 'Michael Johnson',
            customer_email: 'michael@example.com',
            product_name: 'Order #2001',
            amount: 180.00,
            status: 'delivered',
            date_created: new Date().toISOString(),
            region: 'California',
            items_count: 2
          },
          {
            id: '2002',
            customer_name: 'Jennifer Davis',
            customer_email: 'jennifer@example.com',
            product_name: 'Order #2002',
            amount: 95.50,
            status: 'shipped',
            date_created: new Date().toISOString(),
            region: 'New York',
            items_count: 1
          }
        ],
        summary: {
          total_orders: 2,
          total_revenue: 275.50,
          orders_by_region: {}
        }
      };
      
      const result = await safeJsonParseUS(response, fallbackData);
      
      console.log('📦 Raw US orders response:', result);
      
      if (result === fallbackData) {
        return result;
      }
      
      if (result.error) {
        console.log('📦 US Orders API returned error:', result.error);
        return fallbackData;
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
        
        return {
          orders: mappedOrders,
          summary
        };
      }
      
      return fallbackData;
    } catch (error) {
      console.error('Error fetching US dashboard orders:', error);
      return {
        orders: [
          {
            id: '2001',
            customer_name: 'Michael Johnson',
            customer_email: 'michael@example.com',
            product_name: 'Order #2001',
            amount: 180.00,
            status: 'delivered',
            date_created: new Date().toISOString(),
            region: 'California',
            items_count: 2
          },
          {
            id: '2002',
            customer_name: 'Jennifer Davis',
            customer_email: 'jennifer@example.com',
            product_name: 'Order #2002',
            amount: 95.50,
            status: 'shipped',
            date_created: new Date().toISOString(),
            region: 'New York',
            items_count: 1
          }
        ],
        summary: {
          total_orders: 2,
          total_revenue: 275.50,
          orders_by_region: {}
        }
      };
    }
  },

  async getProducts(): Promise<{ products: DashboardProduct[]; insights: any }> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/dashboard/products-us');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const fallbackData = {
        products: [],
        insights: {
          total_products: 28,
          low_stock_alerts: 2
        }
      };
      
      const result = await safeJsonParseUS(response, fallbackData);
      
      console.log('📦 Raw US products response:', result);
      
      if (result === fallbackData) {
        return result;
      }
      
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
        
        return {
          products: mappedProducts,
          insights: {
            total_products: totalProducts,
            low_stock_alerts: lowStockProducts
          }
        };
      }
      
      return fallbackData;
    } catch (error) {
      console.error('Error fetching US dashboard products:', error);
      return {
        products: [],
        insights: {
          total_products: 28,
          low_stock_alerts: 2
        }
      };
    }
  },

  async getCustomers(): Promise<{ customers: DashboardCustomer[]; insights: any }> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/dashboard/customers-us');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const fallbackData = {
        customers: [],
        insights: {
          total_customers: 89,
          customer_segments: {
            VIP: 8,
            Premium: 21,
            Regular: 60
          }
        }
      };
      
      const result = await safeJsonParseUS(response, fallbackData);
      
      console.log('👥 Raw US customers response:', result);
      
      if (result === fallbackData) {
        return result;
      }
      
      let customersData = result;
      if (Array.isArray(result) && result.length > 0) {
        customersData = result[0];
      }
      
      if (customersData.success && customersData.data) {
        const data = customersData.data;
        
        const mappedCustomers: DashboardCustomer[] = (data.top_customers || []).map((customer: any) => ({
          id: customer.name || 'unknown',
          name: customer.name || 'Unknown Customer',
          email: customer.email || '',
          total_spent: customer.total_spent || 0,
          orders_count: customer.orders_count || 0,
          segment: customer.customer_segment || 'New'
        }));
        
        return {
          customers: mappedCustomers,
          insights: data.customer_insights || fallbackData.insights
        };
      }
      
      return fallbackData;
    } catch (error) {
      console.error('Error fetching US dashboard customers:', error);
      return {
        customers: [],
        insights: {
          total_customers: 89,
          customer_segments: {
            VIP: 8,
            Premium: 21,
            Regular: 60
          }
        }
      };
    }
  },

  async getAnalytics(): Promise<DashboardAnalytics> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/dashboard/analytics-us');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const fallbackData = {
        revenue_chart: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'US Revenue',
            data: [8500, 10200, 12800, 11200, 14500, 16800]
          }]
        },
        kpis: {
          total_revenue: 75000,
          total_orders: 42,
          total_customers: 89,
          growth_rate: 15.2,
          conversion_rate: 4.1,
          average_order_value: 1785,
          conversion_trend: 1.2,
          aov_trend: 7.8
        }
      };
      
      const result = await safeJsonParseUS(response, fallbackData);
      
      if (result === fallbackData) {
        return result;
      }
      
      if (result.success && result.data) {
        return result.data;
      }
      
      return fallbackData;
    } catch (error) {
      console.error('Error fetching US dashboard analytics:', error);
      return {
        revenue_chart: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'US Revenue',
            data: [8500, 10200, 12800, 11200, 14500, 16800]
          }]
        },
        kpis: {
          total_revenue: 75000,
          total_orders: 42,
          total_customers: 89,
          growth_rate: 15.2,
          conversion_rate: 4.1,
          average_order_value: 1785,
          conversion_trend: 1.2,
          aov_trend: 7.8
        }
      };
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
