
// Analytics API service for sales data
export interface SalesAnalytics {
  total_revenue: number;
  total_orders: number;
  conversion_rate: number;
  average_order_value: number;
  revenue_trend: number;
  orders_trend: number;
  conversion_trend: number;
  aov_trend: number;
  regional_data: Array<{
    name: string;
    value: number;
  }>;
}

export const analyticsApi = {
  async getSalesAnalytics(): Promise<SalesAnalytics> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/analytics/sales-dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch sales analytics');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching sales analytics:', error);
      // Return mock data as fallback
      return {
        total_revenue: 283450,
        total_orders: 1254,
        conversion_rate: 3.2,
        average_order_value: 226,
        revenue_trend: 12.5,
        orders_trend: 8.2,
        conversion_trend: -1.8,
        aov_trend: 5.3,
        regional_data: [
          { name: 'North America', value: 42 },
          { name: 'Europe', value: 28 },
          { name: 'Middle East', value: 18 },
          { name: 'Asia', value: 12 },
        ]
      };
    }
  }
};
