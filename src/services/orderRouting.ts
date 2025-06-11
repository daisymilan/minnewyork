import { DashboardWarehouse } from '@/types';

export interface WarehouseOverviewResponse {
  success: boolean;
  message: string;
  total_warehouses: number;
  active_warehouses: number;
  total_capacity: string;
  warehouses: DashboardWarehouse[];
  timestamp: string;
}

export interface OrderRoutingResponse {
  success: boolean;
  message: string;
  order_id: string;
  target_warehouse: string;
  shipping_country: string;
  routed_to: string;
  timestamp: string;
}

export interface SyncAllResponse {
  success: boolean;
  message: string;
  orders_found: number;
  routing_analysis: {
    USA: number;
    UAE: number;
    KSA: number;
    FRANCE: number;
    UNKNOWN: number;
  };
  orders: any[];
  timestamp: string;
}

export interface ConnectionTestResponse {
  success: boolean;
  message: string;
  woocommerce_connection: {
    status: string;
    api_url: string;
    test_result: string;
    products_count: number;
  };
  warehouse_apis: {
    USA: string;
    OTO_GCC: string;
    DSL_FRANCE: string;
  };
  next_steps: string[];
  timestamp: string;
}

export const orderRoutingApi = {
  async getWarehouseOverview(): Promise<WarehouseOverviewResponse> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/warehouse/overview');
      const result = await response.json();
      
      console.log('🏭 Raw warehouse overview response:', result);
      
      if (result.success) {
        return result;
      }
      
      throw new Error('Failed to fetch warehouse overview');
    } catch (error) {
      console.error('Error fetching warehouse overview:', error);
      throw error;
    }
  },

  async getWarehouseOverviewUS() {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/warehouse/overview-us');
      const result = await response.json();
      
      console.log('🏭 Raw US warehouse overview response:', result);
      
      if (result.success) {
        return result;
      }
      
      throw new Error('Failed to fetch US warehouse overview');
    } catch (error) {
      console.error('Error fetching US warehouse overview:', error);
      throw error;
    }
  },

  async testConnection(): Promise<ConnectionTestResponse> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/test/connection');
      const result = await response.json();
      
      console.log('⚙️ Raw connection test response:', result);
      
      if (result.success) {
        return result;
      }
      
      throw new Error('Failed to test connection');
    } catch (error) {
      console.error('Error testing connection:', error);
      throw error;
    }
  },

  async syncAllOrders(): Promise<SyncAllResponse> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/inventory/sync-all');
      const result = await response.json();
      
      console.log('🔄 Raw sync all orders response:', result);
      
      if (result.success) {
        return result;
      }
      
      throw new Error('Failed to sync all orders');
    } catch (error) {
      console.error('Error syncing all orders:', error);
      throw error;
    }
  },

  async routeOrder(orderData: any): Promise<OrderRoutingResponse> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/orders/route-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });
      const result = await response.json();
      
      console.log('🚚 Raw route order response:', result);
      
      if (result.success) {
        return result;
      }
      
      throw new Error('Failed to route order');
    } catch (error) {
      console.error('Error routing order:', error);
      throw error;
    }
  }
};
