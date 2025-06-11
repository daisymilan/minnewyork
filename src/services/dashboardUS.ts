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

export const dashboardUSApi = {
  async getOverview(): Promise<DashboardOverview> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/dashboard/overview-us');
      const result = await response.json();
      
      console.log('📊 Raw US overview response:', result);
      
      // Handle the new response structure - it's an array with one object
      let overviewData = result;
      if (Array.isArray(result) && result.length > 0) {
        overviewData = result[0];
      }
      
      if (overviewData.success && overviewData.data) {
        const data = overviewData.data;
        
        // Map the new structure to our expected interface
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
        
        // Map regional breakdown to percentage values
        if (data.regional_breakdown) {
          Object.entries(data.regional_breakdown).forEach(([key, region]: [string, any]) => {
            mappedOverview.regional_breakdown[region.name] = parseFloat(region.percentage);
          });
        }
        
        // Map fulfillment status
        if (data.fulfillment_status) {
          Object.entries(data.fulfillment_status).forEach(([key, fulfillment]: [string, any]) => {
            mappedOverview.fulfillment_status[fulfillment.name] = fulfillment.pending_orders || 0;
          });
        }
        
        console.log('📊 Mapped US overview data:', mappedOverview);
        return mappedOverview;
      }
      
      throw new Error('Invalid API response structure');
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
        throw new Error(result.error);
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
      
      throw new Error('No US orders data available');
    } catch (error) {
      console.error('Error fetching US dashboard orders:', error);
      throw error;
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
      
      throw new Error('No US products data available');
    } catch (error) {
      console.error('Error fetching US dashboard products:', error);
      throw error;
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
      
      throw new Error('No US customers data available');
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
      
      throw new Error('No US analytics data available');
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
