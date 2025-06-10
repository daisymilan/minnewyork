
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import KpiCard from '@/components/dashboard/KpiCard';
import KpiDetailsModal from '@/components/dashboard/KpiDetailsModal';
import WarehouseDetailsSheet from '@/components/dashboard/WarehouseDetailsSheet';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { dashboardUSApi } from '@/services/dashboardUS';
import { useWebhookEventsUS } from '@/hooks/useWebhookEventsUS';

const DashboardUS = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [warehouseDetailsOpen, setWarehouseDetailsOpen] = useState(false);
  const [kpiDetailsOpen, setKpiDetailsOpen] = useState(false);
  const [selectedKpiType, setSelectedKpiType] = useState<'revenue' | 'orders' | 'conversion' | 'averageOrder' | null>(null);
  
  // Initialize US webhook event listeners
  useWebhookEventsUS();
  
  // Fetch US dashboard data using the new US API endpoints
  const { data: overviewData, isLoading: overviewLoading } = useQuery({
    queryKey: ['dashboardOverviewUS'],
    queryFn: dashboardUSApi.getOverview,
    refetchInterval: 30000,
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['dashboardOrdersUS'],
    queryFn: dashboardUSApi.getOrders,
    refetchInterval: 60000,
  });

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['dashboardAnalyticsUS'],
    queryFn: dashboardUSApi.getAnalytics,
    refetchInterval: 30000,
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['dashboardProductsUS'],
    queryFn: dashboardUSApi.getProducts,
    refetchInterval: 120000,
  });
  
  // US KPI data
  const kpiData = analyticsLoading ? null : analyticsData ? {
    revenue: {
      value: analyticsData.kpis.total_revenue,
      trend: analyticsData.kpis.growth_rate,
      type: 'currency' as const,
    },
    orders: {
      value: analyticsData.kpis.total_orders,
      trend: analyticsData.kpis.growth_rate * 0.8,
      type: 'number' as const,
    },
    conversion: {
      value: analyticsData.kpis.conversion_rate || 2.8,
      trend: -1.5,
      type: 'percentage' as const,
    },
    averageOrder: {
      value: analyticsData.kpis.average_order_value || (analyticsData.kpis.total_revenue / analyticsData.kpis.total_orders),
      trend: 4.2,
      type: 'currency' as const,
    }
  } : null;
  
  // US regional data
  const regionalData = overviewLoading ? null : overviewData?.regional_breakdown ? 
    Object.entries(overviewData.regional_breakdown).map(([name, value]) => {
      let numValue = 0;
      if (typeof value === 'number') {
        numValue = value;
      } else if (typeof value === 'string') {
        numValue = parseInt(value) || 0;
      } else if (value != null) {
        numValue = parseInt(String(value)) || 0;
      }
      
      return {
        name,
        value: numValue
      };
    }) : null;

  // US warehouse data
  const usWarehouseOverview = {
    total_warehouses: 1,
    active_warehouses: 1,
    manufacturing_warehouses: 0,
    total_inventory_value: 850000,
    low_stock_alerts: 2,
    warehouses: [
      { 
        name: 'Shipforus USA', 
        location: 'Las Vegas, NV', 
        status: 'active', 
        total_items: 1234, 
        warehouse_type: 'fulfillment' as const
      }
    ]
  };
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-500/10 text-green-500';
      case 'shipped': return 'bg-blue-500/10 text-blue-500';
      case 'processing': return 'bg-amber-500/10 text-amber-500';
      case 'pending': return 'bg-orange-500/10 text-orange-500';
      case 'refunded': return 'bg-purple-500/10 text-purple-500';
      case 'cancelled': return 'bg-red-500/10 text-red-500';
      case 'active': return 'bg-green-500/10 text-green-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const handleWarehouseClick = (warehouse) => {
    const enhancedWarehouse = {
      ...warehouse,
      inventory_value: Math.round(warehouse.total_items * 45 + Math.random() * 50000),
      low_stock_count: Math.round(warehouse.total_items * 0.05 + Math.random() * 10),
      categories: ['Fragrances', 'Accessories', 'Gift Sets'],
      last_updated: new Date().toISOString()
    };
    
    setSelectedWarehouse(enhancedWarehouse);
    setWarehouseDetailsOpen(true);
  };

  const handleKpiClick = (kpiType: 'revenue' | 'orders' | 'conversion' | 'averageOrder') => {
    setSelectedKpiType(kpiType);
    setKpiDetailsOpen(true);
  };
  
  return (
    <div className="flex h-screen bg-luxury-black text-luxury-cream">
      <DashboardSidebar 
        isCollapsed={sidebarCollapsed} 
        toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          {user && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-display mb-1 gold-gradient-text">
                US Dashboard - Welcome back, {user.name}
              </h2>
              <p className="text-sm text-luxury-cream/60 mb-6">
                Here's what's happening with your US fragrance business today
              </p>
              
              {/* US KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {analyticsLoading || !kpiData ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <LuxuryCard key={i} className="p-6">
                      <Skeleton className="h-4 w-24 mb-4" />
                      <Skeleton className="h-8 w-32 mb-2" />
                      <Skeleton className="h-3 w-16" />
                    </LuxuryCard>
                  ))
                ) : (
                  <>
                    <div onClick={() => handleKpiClick('revenue')} className="cursor-pointer">
                      <KpiCard
                        title="US Revenue"
                        value={kpiData.revenue.value}
                        trend={kpiData.revenue.trend}
                        type={kpiData.revenue.type}
                        className="hover:scale-105 transition-transform"
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                            <path d="M12 6v2" />
                            <path d="M12 16v2" />
                          </svg>
                        }
                      />
                    </div>
                    
                    <div onClick={() => handleKpiClick('orders')} className="cursor-pointer">
                      <KpiCard
                        title="US Orders"
                        value={kpiData.orders.value}
                        trend={kpiData.orders.trend}
                        type={kpiData.orders.type}
                        className="hover:scale-105 transition-transform"
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                            <path d="M3 6h18" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                          </svg>
                        }
                      />
                    </div>
                    
                    <div onClick={() => handleKpiClick('conversion')} className="cursor-pointer">
                      <KpiCard
                        title="US Conversion Rate"
                        value={kpiData.conversion.value}
                        trend={kpiData.conversion.trend}
                        type={kpiData.conversion.type}
                        className="hover:scale-105 transition-transform"
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m2 4 3 12h14l3-12-6 7-4 7-4 7-6-7Z" />
                            <path d="m5 16 3 4" />
                            <path d="m16 16 3 4" />
                          </svg>
                        }
                      />
                    </div>
                    
                    <div onClick={() => handleKpiClick('averageOrder')} className="cursor-pointer">
                      <KpiCard
                        title="US Average Order Value"
                        value={kpiData.averageOrder.value}
                        trend={kpiData.averageOrder.trend}
                        type={kpiData.averageOrder.type}
                        className="hover:scale-105 transition-transform"
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                            <path d="M3 9h18" />
                            <path d="M9 21V9" />
                          </svg>
                        }
                      />
                    </div>
                  </>
                )}
              </div>
              
              {/* Two column layout for US dashboard widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main content area */}
                <div className="lg:col-span-2 space-y-6">
                  {/* US Sales by Region */}
                  <LuxuryCard className="p-6">
                    <h3 className="text-lg font-display text-luxury-gold mb-4">US Sales by Region</h3>
                    {overviewLoading ? (
                      <div className="space-y-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="flex items-center">
                            <Skeleton className="w-32 h-4" />
                            <Skeleton className="flex-1 h-2 ml-4 mr-3" />
                            <Skeleton className="w-8 h-4" />
                          </div>
                        ))}
                      </div>
                    ) : regionalData ? (
                      <div className="space-y-4">
                        {regionalData.map((region) => (
                          <div key={region.name} className="flex items-center">
                            <span className="w-32 text-sm">{region.name}</span>
                            <div className="flex-1 h-2 bg-luxury-black rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gold-gradient rounded-full"
                                style={{ width: `${Math.min(region.value, 100)}%` }}
                              ></div>
                            </div>
                            <span className="ml-3 text-sm">{region.value}%</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-luxury-cream/60">No US regional data available</div>
                    )}
                  </LuxuryCard>
                  
                  {/* US Warehouse Overview */}
                  <LuxuryCard className="p-6">
                    <h3 className="text-lg font-display text-luxury-gold mb-4">US Warehouse Network</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-luxury-gold">{usWarehouseOverview.total_warehouses}</div>
                        <div className="text-sm text-luxury-cream/60">US Locations</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">{usWarehouseOverview.active_warehouses}</div>
                        <div className="text-sm text-luxury-cream/60">Active</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">1</div>
                        <div className="text-sm text-luxury-cream/60">Fulfillment</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-luxury-gold">${usWarehouseOverview.total_inventory_value.toLocaleString()}</div>
                        <div className="text-sm text-luxury-cream/60">Total Value</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {usWarehouseOverview.warehouses.map((warehouse) => (
                        <div 
                          key={warehouse.name} 
                          className="bg-luxury-black/30 border border-luxury-gold/20 rounded-lg p-4 cursor-pointer hover:bg-luxury-gold/5 transition-colors"
                          onClick={() => handleWarehouseClick(warehouse)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h5 className="font-medium text-luxury-cream flex items-center gap-2">
                                {warehouse.name}
                                <Badge className="bg-blue-500/10 text-blue-500">
                                  Fulfillment
                                </Badge>
                              </h5>
                              <p className="text-sm text-luxury-cream/60">{warehouse.location}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(warehouse.status)}`}>
                              {warehouse.status.charAt(0).toUpperCase() + warehouse.status.slice(1)}
                            </span>
                          </div>
                          <div className="text-sm text-luxury-cream/60">
                            {warehouse.total_items.toLocaleString()} products
                          </div>
                        </div>
                      ))}
                    </div>
                  </LuxuryCard>
                  
                  {/* US Recent Orders */}
                  <LuxuryCard className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-display text-luxury-gold">Recent US Orders</h3>
                      <button 
                        onClick={() => navigate('/orders')}
                        className="text-sm text-luxury-gold hover:underline"
                      >
                        View All
                      </button>
                    </div>
                    
                    {ordersLoading ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-5 gap-4 py-3 border-b border-luxury-gold/10">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-4" />
                          ))}
                        </div>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="grid grid-cols-5 gap-4 py-3 border-b border-luxury-gold/5">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Skeleton key={j} className="h-4" />
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : ordersData?.orders && ordersData.orders.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-luxury-gold/10">
                              <th className="text-left py-3 font-medium text-luxury-cream/60">Order ID</th>
                              <th className="text-left py-3 font-medium text-luxury-cream/60">Customer</th>
                              <th className="text-left py-3 font-medium text-luxury-cream/60">Email</th>
                              <th className="text-left py-3 font-medium text-luxury-cream/60">Amount</th>
                              <th className="text-left py-3 font-medium text-luxury-cream/60">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ordersData.orders.slice(0, 5).map((order) => (
                              <tr key={order.id} className="border-b border-luxury-gold/5">
                                <td className="py-3">#{order.id}</td>
                                <td className="py-3">{order.customer_name}</td>
                                <td className="py-3 text-luxury-cream/60">{order.customer_email || 'N/A'}</td>
                                <td className="py-3">${order.amount.toFixed(2)}</td>
                                <td className="py-3">
                                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="text-luxury-cream/60">No recent US orders found</div>
                      </div>
                    )}
                  </LuxuryCard>
                </div>
                
                {/* Sidebar with US-specific widgets */}
                <div className="space-y-6">
                  {/* US Product Insights */}
                  <LuxuryCard 
                    className="p-6 cursor-pointer hover:bg-luxury-gold/5 transition-colors"
                    onClick={() => navigate('/products')}
                  >
                    <h3 className="text-lg font-display text-luxury-gold mb-4">US Product Insights</h3>
                    {productsLoading ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-8" />
                        </div>
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-4 w-6" />
                        </div>
                      </div>
                    ) : productsData ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-luxury-cream/60">US Products</span>
                          <span>{productsData.insights?.total_products || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-luxury-cream/60">Low Stock Alerts</span>
                          <span className="text-red-400">{productsData.insights?.low_stock_alerts || 0}</span>
                        </div>
                        <div className="text-xs text-luxury-cream/40 mt-3 text-center">
                          Click to view details
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-luxury-cream/60">No US product data available</div>
                    )}
                  </LuxuryCard>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Warehouse Details Sheet */}
      <WarehouseDetailsSheet
        warehouse={selectedWarehouse}
        isOpen={warehouseDetailsOpen}
        onClose={() => setWarehouseDetailsOpen(false)}
      />

      {/* KPI Details Modal */}
      <KpiDetailsModal
        isOpen={kpiDetailsOpen}
        onClose={() => setKpiDetailsOpen(false)}
        kpiType={selectedKpiType}
        data={kpiData}
      />
    </div>
  );
};

export default DashboardUS;
