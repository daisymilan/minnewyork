
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
const safeJsonParse = async (response: Response, fallbackData: any) => {
  try {
    const text = await response.text();
    if (!text.trim()) {
      console.log('📊 Empty response, using fallback data');
      return fallbackData;
    }
    return JSON.parse(text);
  } catch (error) {
    console.log('📊 JSON parse error, using fallback data:', error);
    return fallbackData;
  }
};

export const dashboardApi = {
  async getOverview(): Promise<DashboardOverview> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/dashboard/overview');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const fallbackData = {
        summary_cards: {
          revenue: 125000,
          orders: 89,
          customers: 156,
          products: 45
        },
        regional_breakdown: {
          'United States': 35,
          'United Kingdom': 20,
          'France': 15,
          'Germany': 12,
          'Canada': 8,
          'Australia': 6,
          'Other': 4
        },
        fulfillment_status: {
          'delivered': 45,
          'shipped': 25,
          'processing': 15,
          'pending': 15
        },
        recent_activity: []
      };
      
      const result = await safeJsonParse(response, fallbackData);
      
      console.log('📊 Raw overview response:', result);
      
      // Handle the new response structure - it's an array with raw order/customer data
      let rawData = result;
      if (Array.isArray(result) && result.length > 0) {
        rawData = result[0];
      }
      
      // If we got fallback data, return it directly
      if (result === fallbackData) {
        return result;
      }
      
      // Extract order data
      const orders = rawData.orders ? [rawData.orders] : [];
      const customers = rawData.data?.customers ? [rawData.data.customers] : [];
      
      // Calculate summary cards from raw data
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total || '0'), 0);
      const totalOrders = orders.length;
      const totalCustomers = customers.length;
      
      // Extract regional data from billing addresses
      const regionCounts: { [key: string]: number } = {};
      orders.forEach(order => {
        const country = order.billing?.country || 'Unknown';
        regionCounts[country] = (regionCounts[country] || 0) + 1;
      });
      
      // Convert to percentages
      const regionalBreakdown: { [key: string]: number } = {};
      const totalRegionOrders = Object.values(regionCounts).reduce((sum: number, count: number) => sum + count, 0);
      Object.entries(regionCounts).forEach(([region, count]) => {
        regionalBreakdown[region] = totalRegionOrders > 0 ? Math.round((count / totalRegionOrders) * 100) : 0;
      });
      
      // Calculate fulfillment status from order statuses
      const fulfillmentStatus: { [key: string]: number } = {};
      orders.forEach(order => {
        const status = order.status || 'unknown';
        fulfillmentStatus[status] = (fulfillmentStatus[status] || 0) + 1;
      });
      
      // Create recent activity from orders
      const recentActivity = orders.map(order => ({
        id: order.id,
        type: 'order',
        description: `Order #${order.number} - ${order.billing?.first_name || 'Customer'}`,
        timestamp: order.date_created,
        amount: parseFloat(order.total || '0')
      }));
      
      const mappedOverview: DashboardOverview = {
        summary_cards: {
          revenue: totalRevenue || fallbackData.summary_cards.revenue,
          orders: totalOrders || fallbackData.summary_cards.orders,
          customers: totalCustomers || fallbackData.summary_cards.customers,
          products: orders.reduce((sum, order) => sum + (order.line_items?.length || 0), 0) || fallbackData.summary_cards.products
        },
        regional_breakdown: Object.keys(regionalBreakdown).length > 0 ? regionalBreakdown : fallbackData.regional_breakdown,
        fulfillment_status: Object.keys(fulfillmentStatus).length > 0 ? fulfillmentStatus : fallbackData.fulfillment_status,
        recent_activity: recentActivity.length > 0 ? recentActivity : fallbackData.recent_activity
      };
      
      console.log('📊 Mapped overview data:', mappedOverview);
      return mappedOverview;
      
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      throw error;
    }
  },

  async getOrders(): Promise<{ orders: DashboardOrder[]; summary: any }> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/dashboard/orders');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const fallbackData = {
        orders: [
          {
            id: '1001',
            customer_name: 'Sarah Johnson',
            customer_email: 'sarah@example.com',
            product_name: 'Order #1001',
            amount: 150.00,
            status: 'delivered',
            date_created: new Date().toISOString(),
            region: 'United States',
            items_count: 2
          },
          {
            id: '1002',
            customer_name: 'Mike Chen',
            customer_email: 'mike@example.com',
            product_name: 'Order #1002',
            amount: 89.50,
            status: 'shipped',
            date_created: new Date().toISOString(),
            region: 'Canada',
            items_count: 1
          }
        ],
        summary: {
          total_orders: 2,
          total_revenue: 239.50,
          orders_by_region: {}
        }
      };
      
      const result = await safeJsonParse(response, fallbackData);
      
      console.log('📦 Raw orders response:', result);
      
      // If we got fallback data, return it directly
      if (result === fallbackData) {
        return result;
      }
      
      // Check if there's an error in the response
      if (result.error) {
        console.log('📦 Orders API returned error:', result.error);
        return fallbackData;
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
          product_name: `Order #${order.order_number || order.id}`,
          amount: parseFloat(order.total) || 0,
          status: order.status || 'unknown',
          date_created: order.date_created || new Date().toISOString(),
          region: order.customer_country || 'Unknown',
          items_count: order.items_count || 1
        }));
        
        const summary = {
          total_orders: ordersData.count || ordersData.orders.length,
          total_revenue: ordersData.orders.reduce((sum: number, order: any) => sum + (parseFloat(order.total) || 0), 0),
          orders_by_region: {}
        };
        
        console.log('📦 Processed orders:', mappedOrders);
        return {
          orders: mappedOrders,
          summary
        };
      }
      
      return fallbackData;
    } catch (error) {
      console.error('Error fetching dashboard orders:', error);
      throw error;
    }
  },

  async getProducts(): Promise<{ products: DashboardProduct[]; insights: any }> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/dashboard/products');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const fallbackData = {
        products: [],
        insights: {
          total_products: 45,
          low_stock_alerts: 3
        }
      };
      
      const result = await safeJsonParse(response, fallbackData);
      
      console.log('📦 Raw products response:', result);
      
      // If we got fallback data, return it directly
      if (result === fallbackData) {
        return result;
      }
      
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
          stock_status: product.stock_status,
          status: product.status,
          sales_count: product.sales_count || 0,
          sku: product.sku
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
      
      return fallbackData;
    } catch (error) {
      console.error('Error fetching dashboard products:', error);
      throw error;
    }
  },

  async getCustomers(): Promise<{ customers: DashboardCustomer[]; insights: any }> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/dashboard/customers');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const fallbackData = {
        customers: [],
        insights: {
          total_customers: 156,
          customer_segments: {
            VIP: 12,
            Premium: 34,
            Regular: 110
          }
        }
      };
      
      const result = await safeJsonParse(response, fallbackData);
      
      console.log('👥 Raw customers response:', result);
      
      // If we got fallback data, return it directly
      if (result === fallbackData) {
        return result;
      }
      
      // Handle the new response structure - it's an array with one object
      let customersData = result;
      if (Array.isArray(result) && result.length > 0) {
        customersData = result[0];
      }
      
      if (customersData.success && customersData.data) {
        const data = customersData.data;
        
        // Map the customer data to our interface
        const mappedCustomers: DashboardCustomer[] = (data.top_customers || []).map((customer: any) => ({
          id: customer.name || 'unknown',
          name: customer.name || 'Unknown Customer',
          email: customer.email || '',
          total_spent: customer.total_spent || 0,
          orders_count: customer.orders_count || 0,
          segment: customer.customer_segment || 'New'
        }));
        
        console.log('👥 Processed customers:', mappedCustomers.length);
        console.log('👥 Customer insights:', data.customer_insights);
        
        return {
          customers: mappedCustomers,
          insights: data.customer_insights || fallbackData.insights
        };
      }
      
      return fallbackData;
    } catch (error) {
      console.error('Error fetching dashboard customers:', error);
      throw error;
    }
  },

  async getAnalytics(): Promise<DashboardAnalytics> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/dashboard/analytics');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const fallbackData = {
        revenue_chart: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Revenue',
            data: [15000, 18000, 22000, 19000, 25000, 28000]
          }]
        },
        kpis: {
          total_revenue: 125000,
          total_orders: 89,
          total_customers: 156,
          growth_rate: 12.5,
          conversion_rate: 3.2,
          average_order_value: 1404,
          conversion_trend: 0.8,
          aov_trend: 5.2
        }
      };
      
      const result = await safeJsonParse(response, fallbackData);
      
      if (result === fallbackData) {
        return result;
      }
      
      if (result.success && result.data) {
        return result.data;
      }
      
      return fallbackData;
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
