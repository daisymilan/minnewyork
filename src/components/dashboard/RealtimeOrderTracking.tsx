
import React, { useState, useEffect } from 'react';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { useQuery } from '@tanstack/react-query';

interface RealtimeOrder {
  id: string;
  timestamp: string;
  customer: string;
  country: string;
  provider: string;
  status: 'routing' | 'success' | 'failed';
  amount: number;
}

const RealtimeOrderTracking = () => {
  const [recentOrders, setRecentOrders] = useState<RealtimeOrder[]>([]);

  // Listen for real-time order updates
  useEffect(() => {
    const handleOrderUpdate = (event: CustomEvent) => {
      console.log('Real-time order update:', event.detail);
      
      const newOrder: RealtimeOrder = {
        id: `ORD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        customer: 'Live Customer',
        country: event.detail?.country || 'Unknown',
        provider: event.detail?.provider || 'Unknown',
        status: 'success',
        amount: event.detail?.amount || 0
      };
      
      setRecentOrders(prev => [newOrder, ...prev.slice(0, 9)]);
    };

    window.addEventListener('dashboard-refresh' as any, handleOrderUpdate);
    window.addEventListener('order-routed' as any, handleOrderUpdate);
    
    return () => {
      window.removeEventListener('dashboard-refresh' as any, handleOrderUpdate);
      window.removeEventListener('order-routed' as any, handleOrderUpdate);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'failed': return 'text-red-500';
      case 'routing': return 'text-amber-500';
      default: return 'text-luxury-cream/60';
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'shipforus': return 'text-blue-400';
      case 'oto': return 'text-purple-400';
      case 'dsl': return 'text-green-400';
      default: return 'text-luxury-cream/60';
    }
  };

  return (
    <LuxuryCard className="p-6">
      <h3 className="text-lg font-display text-luxury-gold mb-4">Real-time Order Routing</h3>
      
      {recentOrders.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📦</div>
          <p className="text-luxury-cream/60">Waiting for new orders...</p>
          <p className="text-xs text-luxury-cream/40 mt-1">Orders will appear here as they're routed</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {recentOrders.map((order) => (
            <div 
              key={order.id} 
              className="bg-luxury-black/30 border border-luxury-gold/20 rounded-lg p-3 animate-fade-in"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-luxury-cream">
                      {order.id}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full bg-luxury-black/50 ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-xs text-luxury-cream/60">
                    {order.customer} • {order.country}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getProviderColor(order.provider)}`}>
                    {order.provider}
                  </div>
                  <div className="text-xs text-luxury-cream/60">
                    {new Date(order.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
              {order.amount > 0 && (
                <div className="text-xs text-luxury-gold">
                  ${order.amount.toFixed(2)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </LuxuryCard>
  );
};

export default RealtimeOrderTracking;
