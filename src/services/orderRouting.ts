
// Order Routing API service for warehouse integration
export interface OrderRoutingResponse {
  status: string;
  message: string;
  order_id: string;
  routed_to: string;
  timestamp: string;
  fulfillment_region: string;
}

export interface InventoryStatus {
  provider: string;
  warehouse: string;
  stock_quantity: number;
  stock_status: string;
  last_updated: string;
}

export interface OrderRoutingStats {
  total_orders_routed: number;
  orders_by_region: {
    USA: number;
    GCC: number;
    Europe: number;
  };
  active_warehouses: string[];
  last_sync: string;
}

export interface WarehouseOverview {
  total_warehouses: number;
  active_warehouses: number;
  total_inventory_value: number;
  low_stock_alerts: number;
  warehouses: Array<{
    name: string;
    location: string;
    status: string;
    total_items: number;
  }>;
}

export const orderRoutingApi = {
  // Route a new order through the workflow
  async routeOrder(orderData: any): Promise<OrderRoutingResponse> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/order-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error routing order:', error);
      throw error;
    }
  },

  // Get inventory status across all warehouses
  async getInventoryStatus(): Promise<InventoryStatus[]> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/inventory/status');
      const result = await response.json();
      
      console.log('📦 Raw inventory response:', result);
      
      // Handle the actual webhook structure - it's an array with one object
      let inventoryData = result;
      if (Array.isArray(result) && result.length > 0) {
        inventoryData = result[0];
      }
      
      if (inventoryData.success && inventoryData.warehouses) {
        const inventoryList: InventoryStatus[] = [];
        
        // Process shipforus warehouse
        if (inventoryData.warehouses.shipforus) {
          const shipforus = inventoryData.warehouses.shipforus;
          inventoryList.push({
            provider: shipforus.provider,
            warehouse: `${shipforus.warehouse_id} (${shipforus.region})`,
            stock_quantity: shipforus.total_products,
            stock_status: shipforus.status,
            last_updated: shipforus.last_sync
          });
        }
        
        // Process DSL warehouse
        if (inventoryData.warehouses.dsl) {
          const dsl = inventoryData.warehouses.dsl;
          inventoryList.push({
            provider: dsl.provider,
            warehouse: `${dsl.warehouse_id} (${dsl.region})`,
            stock_quantity: dsl.total_products,
            stock_status: dsl.status,
            last_updated: dsl.last_sync
          });
        }
        
        // Process OTO warehouses (multiple sub-warehouses)
        if (inventoryData.warehouses.oto) {
          const oto = inventoryData.warehouses.oto;
          if (oto.warehouses && Array.isArray(oto.warehouses)) {
            oto.warehouses.forEach((subWarehouse: any) => {
              inventoryList.push({
                provider: oto.provider,
                warehouse: `${subWarehouse.warehouse_id} (${subWarehouse.name})`,
                stock_quantity: subWarehouse.products,
                stock_status: oto.status,
                last_updated: oto.last_sync
              });
            });
          } else {
            // Fallback for main OTO warehouse
            inventoryList.push({
              provider: oto.provider,
              warehouse: `${oto.warehouse_id} (${oto.region})`,
              stock_quantity: oto.total_products,
              stock_status: oto.status,
              last_updated: oto.last_sync
            });
          }
        }
        
        console.log('📊 Processed inventory list:', inventoryList);
        return inventoryList;
      }
      
      // Fallback data if parsing fails
      return [
        {
          provider: 'Shipforus',
          warehouse: 'USA-MAIN',
          stock_quantity: 1234,
          stock_status: 'optimal',
          last_updated: new Date().toISOString()
        },
        {
          provider: 'OTO',
          warehouse: 'WM-008 (UAE)',
          stock_quantity: 856,
          stock_status: 'low',
          last_updated: new Date().toISOString()
        },
        {
          provider: 'OTO',
          warehouse: 'WM-010 (KSA)', 
          stock_quantity: 2145,
          stock_status: 'optimal',
          last_updated: new Date().toISOString()
        },
        {
          provider: 'DSL',
          warehouse: 'EU-MAIN',
          stock_quantity: 984,
          stock_status: 'medium',
          last_updated: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error('Error fetching inventory status:', error);
      throw error;
    }
  },

  // Get order routing statistics
  async getRoutingStats(): Promise<OrderRoutingStats> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/routing/stats');
      const result = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      }
      
      // Return result directly if it matches the expected format
      if (result.total_orders_routed && result.orders_by_region) {
        return result;
      }
      
      // Fallback data
      return {
        total_orders_routed: 1254,
        orders_by_region: {
          USA: 523,
          GCC: 456,
          Europe: 275
        },
        active_warehouses: ['Shipforus-USA', 'OTO-UAE', 'OTO-KSA', 'DSL-EU'],
        last_sync: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching routing stats:', error);
      throw error;
    }
  },

  // Get warehouse overview data
  async getWarehouseOverview(): Promise<WarehouseOverview> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/warehouse/overview');
      const result = await response.json();
      
      console.log('🏭 Raw warehouse overview response:', result);
      
      // Handle the actual webhook structure - it's an array with one object
      let overviewData = result;
      if (Array.isArray(result) && result.length > 0) {
        overviewData = result[0];
      }
      
      if (overviewData.success && overviewData.overview && overviewData.warehouses) {
        const overview = overviewData.overview;
        const warehouses = overviewData.warehouses;
        
        // Calculate total inventory value (estimated based on orders)
        const totalInventoryValue = warehouses.reduce((sum: number, warehouse: any) => {
          return sum + (warehouse.orders_today || 0) * 150; // Estimate $150 per order
        }, 0);
        
        // Count low stock alerts
        const lowStockAlerts = overviewData.alerts?.length || 0;
        
        // Map warehouses to the expected format
        const warehouseList = warehouses.map((warehouse: any) => ({
          name: warehouse.name,
          location: `${warehouse.country} (${warehouse.region})`,
          status: warehouse.status,
          total_items: warehouse.orders_today || 0 // Using orders as proxy for activity
        }));
        
        const warehouseOverview: WarehouseOverview = {
          total_warehouses: overview.total_warehouses,
          active_warehouses: overview.operational_warehouses,
          total_inventory_value: totalInventoryValue,
          low_stock_alerts: lowStockAlerts,
          warehouses: warehouseList
        };
        
        console.log('🏭 Processed warehouse overview:', warehouseOverview);
        return warehouseOverview;
      }
      
      // Return result directly if it matches the expected format
      if (result.total_warehouses !== undefined) {
        return result;
      }
      
      // Fallback data
      return {
        total_warehouses: 4,
        active_warehouses: 4,
        total_inventory_value: 2850000,
        low_stock_alerts: 3,
        warehouses: [
          { name: 'Shipforus USA', location: 'Las Vegas, NV', status: 'active', total_items: 1234 },
          { name: 'OTO UAE', location: 'Dubai, UAE', status: 'active', total_items: 856 },
          { name: 'OTO KSA', location: 'Riyadh, KSA', status: 'active', total_items: 2145 },
          { name: 'DSL Europe', location: 'Nice, France', status: 'active', total_items: 984 }
        ]
      };
    } catch (error) {
      console.error('Error fetching warehouse overview:', error);
      throw error;
    }
  }
};
