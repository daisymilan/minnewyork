
import { useState, useCallback } from 'react';

export interface WarehouseInventoryResponse {
  success: boolean;
  message: string;
  summary?: {
    total_products: number;
    in_stock: number;
    out_of_stock: number;
    low_stock: number;
    manage_stock_enabled: number;
    last_sync: string;
  };
  inventory?: any[];
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

export const useWarehouse = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = 'https://minnewyorkofficial.app.n8n.cloud/webhook';

  const testConnection = useCallback(async (): Promise<ConnectionTestResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/test/connection`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Connection test failed');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection test failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  const getWooCommerceInventory = useCallback(async (): Promise<WarehouseInventoryResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/inventory/woocommerce`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to get WooCommerce inventory');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get WooCommerce inventory';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  const syncAllOrders = useCallback(async (): Promise<SyncAllResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/inventory/sync-all`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to sync orders');
      }
      
      return result;
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  const routeOrder = useCallback(async (orderData: any): Promise<OrderRoutingResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/orders/route-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to route order');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to route order';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  return {
    loading,
    error,
    testConnection,
    getWooCommerceInventory,
    syncAllOrders,
    routeOrder
  };
};
