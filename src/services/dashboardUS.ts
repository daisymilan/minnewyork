
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

// Cache for preserving US data between API calls
let usCacheData = {
  overview: null as DashboardOverview | null,
  orders: null as { orders: DashboardOrder[]; summary: any } | null,
  products: null as { products: DashboardProduct[]; insights: any } | null,
  customers: null as { customers: DashboardCustomer[]; insights: any } | null,
  analytics: null as DashboardAnalytics | null,
};

// Track when US data was last fetched
let usLastFetched = {
  overview: 0,
  orders: 0,
  products: 0,
  customers: 0,
  analytics: 0,
};

// 4 hours in milliseconds
const FOUR_HOURS = 4 * 60 * 60 * 1000;

// Helper function to check if US data needs to be refreshed
const shouldRefreshUS = (endpoint: keyof typeof usLastFetched): boolean => {
  const now = Date.now();
  const lastFetch = usLastFetched[endpoint];
  return now - lastFetch >= FOUR_HOURS;
};

// Helper function to safely parse JSON with US cached data preservation
const safeJsonParseUS = async (response: Response, fallbackData: any, cacheKey?: keyof typeof usCacheData) => {
  try {
    const text = await response.text();
    if (!text.trim()) {
      console.log('📊 Empty US response, using cached data if available');
      // Return cached data if available, otherwise fallback
      if (cacheKey && usCacheData[cacheKey]) {
        console.log(`📊 Using cached US ${cacheKey} data`);
        return usCacheData[cacheKey];
      }
      return fallbackData;
    }
    const result = JSON.parse(text);
    // Cache successful results
    if (cacheKey && result) {
      usCacheData[cacheKey] = result;
      usLastFetched[cacheKey] = Date.now();
      console.log(`📊 Cached US ${cacheKey} data`);
    }
    return result;
  } catch (error) {
    console.log('📊 US JSON parse error, using cached data if available:', error);
    // Return cached data if available, otherwise fallback
    if (cacheKey && usCacheData[cacheKey]) {
      console.log(`📊 Using cached US ${cacheKey} data due to parse error`);
      return usCacheData[cacheKey];
    }
    return fallbackData;
  }
};

export const dashboardUSApi = {
  async getOverview(): Promise<DashboardOverview> {
    // Check if we should use cached data
    if (!shouldRefreshUS('overview') && usCacheData.overview) {
      console.log('📊 Using cached US overview data (4-hour interval not reached)');
      return usCacheData.overview;
    }

    try {
      console.log('📊 Fetching US dashboard overview (4-hour interval)');
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
      
      const result = await safeJsonParseUS(response, fallbackData, 'overview');
      
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
      // Return cached data if available
      if (usCacheData.overview) {
        console.log('📊 Using cached US overview data due to error');
        return usCacheData.overview;
      }
      throw error;
    }
  },

  async getOrders(): Promise<{ orders: DashboardOrder[]; summary: any }> {
    // Check if we should use cached data
    if (!shouldRefreshUS('orders') && usCacheData.orders) {
      console.log('📦 Using cached US orders data (4-hour interval not reached)');
      return usCacheData.orders;
    }

    try {
      console.log('📦 Fetching US dashboard orders (4-hour interval)');
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
      
      const result = await safeJsonParseUS(response, fallbackData, 'orders');
      
      console.log('📦 Raw US orders response:', result);
      
      // If we got fallback data, return it directly
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
      // Return cached data if available  
      if (usCacheData.orders) {
        console.log('📦 Using cached US orders data due to error');
        return usCacheData.orders;
      }
      throw error;
    }
  },

  async getProducts(): Promise<{ products: DashboardProduct[]; insights: any }> {
    // Check if we should use cached data
    if (!shouldRefreshUS('products') && usCacheData.products) {
      console.log('📦 Using cached US products data (4-hour interval not reached)');
      return usCacheData.products;
    }

    try {
      console.log('📦 Fetching US dashboard products (4-hour interval)');
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
      
      const result = await safeJsonParseUS(response, fallbackData, 'products');
      
      console.log('📦 Raw US products response:', result);
      
      // If we got fallback data, return it directly
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
      // Return cached data if available
      if (usCacheData.products) {
        console.log('📦 Using cached US products data due to error');
        return usCacheData.products;
      }
      throw error;
    }
  },

  async getCustomers(): Promise<{ customers: DashboardCustomer[]; insights: any }> {
    // Check if we should use cached data
    if (!shouldRefreshUS('customers') && usCacheData.customers) {
      console.log('👥 Using cached US customers data (4-hour interval not reached)');
      return usCacheData.customers;
    }

    try {
      console.log('👥 Fetching US dashboard customers (4-hour interval)');
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
      
      const result = await safeJsonParseUS(response, fallbackData, 'customers');
      
      console.log('👥 Raw US customers response:', result);
      
      // If we got fallback data, return it directly
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
      // Return cached data if available
      if (usCacheData.customers) {
        console.log('👥 Using cached US customers data due to error');
        return usCacheData.customers;
      }
      throw error;
    }
  },

  async getAnalytics(): Promise<DashboardAnalytics> {
    // Check if we should use cached data
    if (!shouldRefreshUS('analytics') && usCacheData.analytics) {
      console.log('📊 Using cached US analytics data (4-hour interval not reached)');
      return usCacheData.analytics;
    }

    try {
      console.log('📊 Fetching US analytics data (4-hour interval)');
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
      
      const result = await safeJsonParseUS(response, fallbackData, 'analytics');
      
      if (result === fallbackData) {
        return result;
      }
      
      if (result.success && result.data) {
        const analyticsData = result.data;
        // Cache the successful result
        usCacheData.analytics = analyticsData;
        usLastFetched.analytics = Date.now();
        return analyticsData;
      }
      
      return fallbackData;
    } catch (error) {
      console.error('Error fetching US dashboard analytics:', error);
      // Return cached data if available
      if (usCacheData.analytics) {
        console.log('📊 Using cached US analytics data due to error');
        return usCacheData.analytics;
      }
      throw error;
    }
  },

  async getAllDashboardData() {
    try {
      console.log('📊 Fetching all US dashboard data (4-hour interval)');
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
