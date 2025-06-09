
import React, { useState } from 'react';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { orderRoutingApi } from '@/services/orderRouting';
import { toast } from '@/components/ui/sonner';

const OrderRoutingManager = () => {
  const [testing, setTesting] = useState({
    connection: false,
    stockSync: false,
    orderRouting: false
  });

  const testConnections = async () => {
    setTesting(prev => ({ ...prev, connection: true }));
    try {
      const results = await Promise.allSettled([
        orderRoutingApi.getInventoryStatus(),
        orderRoutingApi.getRoutingStats(),
        orderRoutingApi.getWarehouseOverview()
      ]);
      
      const successCount = results.filter(r => r.status === 'fulfilled').length;
      toast.success(`${successCount}/3 connections successful`);
    } catch (error) {
      toast.error('Connection test failed');
    } finally {
      setTesting(prev => ({ ...prev, connection: false }));
    }
  };

  const forceStockSync = async () => {
    setTesting(prev => ({ ...prev, stockSync: true }));
    try {
      // This would trigger the stock sync webhook in your n8n workflow
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/stock/sync', {
        method: 'POST'
      });
      
      if (response.ok) {
        toast.success('Stock sync initiated');
      } else {
        throw new Error('Sync failed');
      }
    } catch (error) {
      toast.error('Failed to trigger stock sync');
    } finally {
      setTesting(prev => ({ ...prev, stockSync: false }));
    }
  };

  const testOrderRouting = async () => {
    setTesting(prev => ({ ...prev, orderRouting: true }));
    try {
      const testOrder = {
        billing: { country: 'US' },
        id: 'TEST-' + Date.now(),
        line_items: [{ sku: 'TEST-SKU', quantity: 1 }]
      };
      
      const response = await orderRoutingApi.routeOrder(testOrder);
      toast.success(`Test order routed to: ${response.routed_to}`);
    } catch (error) {
      toast.error('Order routing test failed');
    } finally {
      setTesting(prev => ({ ...prev, orderRouting: false }));
    }
  };

  return (
    <LuxuryCard className="p-6">
      <h3 className="text-lg font-display text-luxury-gold mb-4">Order Routing Controls</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LuxuryButton
          onClick={testConnections}
          disabled={testing.connection}
          variant="outline"
          className="w-full"
        >
          {testing.connection ? 'Testing...' : 'Test Connections'}
        </LuxuryButton>
        
        <LuxuryButton
          onClick={forceStockSync}
          disabled={testing.stockSync}
          variant="outline"
          className="w-full"
        >
          {testing.stockSync ? 'Syncing...' : 'Force Stock Sync'}
        </LuxuryButton>
        
        <LuxuryButton
          onClick={testOrderRouting}
          disabled={testing.orderRouting}
          variant="outline"
          className="w-full"
        >
          {testing.orderRouting ? 'Testing...' : 'Test Order Routing'}
        </LuxuryButton>
      </div>
      
      <div className="mt-4 text-sm text-luxury-cream/60">
        <p>• Test Connections: Verify all provider APIs are responding</p>
        <p>• Force Stock Sync: Manually trigger inventory synchronization</p>
        <p>• Test Order Routing: Send a test order through the routing system</p>
      </div>
    </LuxuryCard>
  );
};

export default OrderRoutingManager;
