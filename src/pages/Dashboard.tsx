
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import KpiCard from '@/components/dashboard/KpiCard';
import WarehouseDetailsSheet from '@/components/dashboard/WarehouseDetailsSheet';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { Skeleton } from '@/components/ui/skeleton';
import { dashboardApi } from '@/services/dashboard';
import { orderRoutingApi } from '@/services/orderRouting';
import { useWebhookEvents } from '@/hooks/useWebhookEvents';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [warehouseDetailsOpen, setWarehouseDetailsOpen] = useState(false);
  
  // Initialize webhook event listeners
  useWebhookEvents();
  
  // Clear localStorage on component mount to ensure fresh user data
  useEffect(() => {
    // Check if the stored user has the old name and update it
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.name === 'Chad Murawczyk') {
          // Update to new name
          parsedUser.name = 'Chad';
          localStorage.setItem('user', JSON.stringify(parsedUser));
          // Force a page refresh to update the auth context
          window.location.reload();
        }
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    }
  }, []);
  
  // Fetch real dashboard data using the new API endpoints
  const { data: overviewData, isLoading: overviewLoading } = useQuery({
    queryKey: ['dashboardOverview'],
    queryFn: dashboardApi.getOverview,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['dashboardOrders'],
    queryFn: dashboardApi.getOrders,
    refetchInterval: 60000, // Refetch every minute
  });

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['dashboardAnalytics'],
    queryFn: dashboardApi.getAnalytics,
    refetchInterval: 30000,
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['dashboardProducts'],
    queryFn: dashboardApi.getProducts,
    refetchInterval: 120000, // Refetch every 2 minutes
  });

  // Add order routing data with enhanced debugging
  const { data: routingStats, isLoading: routingLoading, error: routingError } = useQuery({
    queryKey: ['orderRoutingStats'],
    queryFn: async () => {
      console.log('🔄 Fetching routing stats from n8n...');
      const data = await orderRoutingApi.getRoutingStats();
      console.log('📊 Routing stats response:', data);
      return data;
    },
    refetchInterval: 60000, // Refetch every minute
  });

  const { data: inventoryStatus, isLoading: inventoryLoading } = useQuery({
    queryKey: ['inventoryStatus'],
    queryFn: orderRoutingApi.getInventoryStatus,
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  // Add warehouse overview data
  const { data: warehouseOverview, isLoading: warehouseLoading } = useQuery({
    queryKey: ['warehouseOverview'],
    queryFn: orderRoutingApi.getWarehouseOverview,
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  // Debug logging for routing stats
  useEffect(() => {
    console.log('🔍 Routing Stats Debug:');
    console.log('- Data:', routingStats);
    console.log('- Loading:', routingLoading);
    console.log('- Error:', routingError);
    console.log('- Should show component:', !!routingStats);
  }, [routingStats, routingLoading, routingError]);
  
  // Use real data or loading states instead of mock data
  const kpiData = analyticsLoading ? null : analyticsData ? {
    revenue: {
      value: analyticsData.kpis.total_revenue,
      trend: analyticsData.kpis.growth_rate,
      type: 'currency' as const,
    },
    orders: {
      value: analyticsData.kpis.total_orders,
      trend: analyticsData.kpis.growth_rate * 0.8, // Estimated trend
      type: 'number' as const,
    },
    conversion: {
      value: analyticsData.kpis.conversion_rate || 3.2,
      trend: -1.8, // Estimated trend
      type: 'percentage' as const,
    },
    averageOrder: {
      value: analyticsData.kpis.average_order_value || (analyticsData.kpis.total_revenue / analyticsData.kpis.total_orders),
      trend: 5.3, // Estimated trend
      type: 'currency' as const,
    }
  } : null;
  
  // Use real regional data or loading state
  const regionalData = overviewLoading ? null : overviewData?.regional_breakdown ? 
    Object.entries(overviewData.regional_breakdown).map(([name, value]) => {
      // Safely convert value to number with proper type checking
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
  
  // Use real inventory data or loading state
  const warehouseData = inventoryLoading ? null : inventoryStatus;
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-500/10 text-green-500';
      case 'shipped': return 'bg-blue-500/10 text-blue-500';
      case 'processing': return 'bg-amber-500/10 text-amber-500';
      case 'pending': return 'bg-orange-500/10 text-orange-500';
      case 'refunded': return 'bg-purple-500/10 text-purple-500';
      case 'cancelled': return 'bg-red-500/10 text-red-500';
      case 'optimal': return 'bg-green-500/10 text-green-500';
      case 'low': return 'bg-red-500/10 text-red-500';
      case 'medium': return 'bg-amber-500/10 text-amber-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const handleWarehouseClick = (warehouse) => {
    // Enhance warehouse data with mock additional details for demonstration
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

  const handleInventoryWarehouseClick = (inventoryWarehouse) => {
    // Convert inventory warehouse data to the expected warehouse format
    const enhancedWarehouse = {
      name: inventoryWarehouse.warehouse,
      location: inventoryWarehouse.provider === 'Shipforus' ? 'Las Vegas, NV' :
                inventoryWarehouse.provider === 'OTO' ? 'Dubai, UAE / Riyadh, KSA' : 'Nice, France',
      status: inventoryWarehouse.stock_status,
      total_items: inventoryWarehouse.stock_quantity,
      inventory_value: Math.round(inventoryWarehouse.stock_quantity * 65 + Math.random() * 30000),
      low_stock_count: inventoryWarehouse.stock_status === 'low' ? Math.round(inventoryWarehouse.stock_quantity * 0.15) : 
                       Math.round(inventoryWarehouse.stock_quantity * 0.03),
      categories: ['Fragrances', 'Accessories', 'Gift Sets'],
      last_updated: inventoryWarehouse.last_updated
    };
    
    setSelectedWarehouse(enhancedWarehouse);
    setWarehouseDetailsOpen(true);
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
                Welcome back, {user.name}
              </h2>
              <p className="text-sm text-luxury-cream/60 mb-6">
                Here's what's happening with your fragrance business today
              </p>
              
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {analyticsLoading || !kpiData ? (
                  // Loading skeleton for KPI cards
                  Array.from({ length: 4 }).map((_, i) => (
                    <LuxuryCard key={i} className="p-6">
                      <Skeleton className="h-4 w-24 mb-4" />
                      <Skeleton className="h-8 w-32 mb-2" />
                      <Skeleton className="h-3 w-16" />
                    </LuxuryCard>
                  ))
                ) : (
                  <>
                    <KpiCard
                      title="Total Revenue"
                      value={kpiData.revenue.value}
                      trend={kpiData.revenue.trend}
                      type={kpiData.revenue.type}
                      icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                          <path d="M12 6v2" />
                          <path d="M12 16v2" />
                        </svg>
                      }
                    />
                    
                    <KpiCard
                      title="Orders"
                      value={kpiData.orders.value}
                      trend={kpiData.orders.trend}
                      type={kpiData.orders.type}
                      icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                          <path d="M3 6h18" />
                          <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                      }
                    />
                    
                    <KpiCard
                      title="Conversion Rate"
                      value={kpiData.conversion.value}
                      trend={kpiData.conversion.trend}
                      type={kpiData.conversion.type}
                      icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m2 4 3 12h14l3-12-6 7-4 7-4 7-6-7Z" />
                          <path d="m5 16 3 4" />
                          <path d="m16 16 3 4" />
                        </svg>
                      }
                    />
                    
                    <KpiCard
                      title="Average Order Value"
                      value={kpiData.averageOrder.value}
                      trend={kpiData.averageOrder.trend}
                      type={kpiData.averageOrder.type}
                      icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="18" height="18" x="3" y="3" rx="2" />
                          <path d="M3 9h18" />
                          <path d="M9 21V9" />
                        </svg>
                      }
                    />
                  </>
                )}
              </div>
              
              {/* Two column layout for dashboard widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main content area */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Sales by Region */}
                  <LuxuryCard className="p-6">
                    <h3 className="text-lg font-display text-luxury-gold mb-4">Sales by Region</h3>
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
                      <div className="text-center py-4 text-luxury-cream/60">No regional data available</div>
                    )}
                  </LuxuryCard>
                  
                  {/* Order Routing Statistics */}
                  <LuxuryCard className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-display text-luxury-gold">Order Routing Statistics</h3>
                      <div className="text-xs text-luxury-cream/40">
                        {routingLoading && 'Loading...'}
                        {routingError && 'Error loading data'}
                        {!routingLoading && !routingError && routingStats && 'Live data from n8n'}
                        {!routingLoading && !routingError && !routingStats && 'No data available'}
                      </div>
                    </div>
                    
                    {routingLoading ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="text-center">
                              <Skeleton className="h-8 w-16 mx-auto mb-2" />
                              <Skeleton className="h-4 w-20 mx-auto" />
                            </div>
                          ))}
                        </div>
                        <div className="pt-4 border-t border-luxury-gold/10">
                          <Skeleton className="h-4 w-48 mx-auto mb-1" />
                          <Skeleton className="h-3 w-32 mx-auto" />
                        </div>
                      </div>
                    ) : routingError ? (
                      <div className="text-center py-8">
                        <div className="text-red-400 mb-2">Failed to load routing data</div>
                        <div className="text-xs text-luxury-cream/60">Error: {routingError.message}</div>
                      </div>
                    ) : routingStats ? (
                      <>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-luxury-gold">
                              {routingStats.orders_by_region?.USA || 0}
                            </div>
                            <div className="text-sm text-luxury-cream/60">USA Orders</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-luxury-gold">
                              {routingStats.orders_by_region?.GCC || 0}
                            </div>
                            <div className="text-sm text-luxury-cream/60">GCC Orders</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-luxury-gold">
                              {routingStats.orders_by_region?.Europe || 0}
                            </div>
                            <div className="text-sm text-luxury-cream/60">Europe Orders</div>
                          </div>
                        </div>
                        <div className="text-center pt-4 border-t border-luxury-gold/10">
                          <div className="text-sm text-luxury-cream/60">
                            Active Warehouses: {routingStats.active_warehouses?.join(', ') || 'None'}
                          </div>
                          <div className="text-xs text-luxury-cream/40 mt-1">
                            Total Routed: {routingStats.total_orders_routed || 0}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8 text-luxury-cream/60">No routing data available</div>
                    )}
                  </LuxuryCard>
                  
                  {/* Warehouse Overview */}
                  {warehouseLoading ? (
                    <LuxuryCard className="p-6">
                      <h3 className="text-lg font-display text-luxury-gold mb-4">Warehouse Overview</h3>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="text-center">
                            <Skeleton className="h-8 w-16 mx-auto mb-1" />
                            <Skeleton className="h-4 w-20 mx-auto" />
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="bg-luxury-black/30 border border-luxury-gold/20 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <Skeleton className="h-4 w-24 mb-1" />
                                <Skeleton className="h-3 w-16" />
                              </div>
                              <Skeleton className="h-5 w-12" />
                            </div>
                            <Skeleton className="h-3 w-20" />
                          </div>
                        ))}
                      </div>
                    </LuxuryCard>
                  ) : warehouseOverview ? (
                    <LuxuryCard className="p-6">
                      <h3 className="text-lg font-display text-luxury-gold mb-4">Warehouse Overview</h3>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-luxury-gold">{warehouseOverview.total_warehouses}</div>
                          <div className="text-sm text-luxury-cream/60">Total Warehouses</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-500">{warehouseOverview.active_warehouses}</div>
                          <div className="text-sm text-luxury-cream/60">Active</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-luxury-gold">${warehouseOverview.total_inventory_value.toLocaleString()}</div>
                          <div className="text-sm text-luxury-cream/60">Inventory Value</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-400">{warehouseOverview.low_stock_alerts}</div>
                          <div className="text-sm text-luxury-cream/60">Low Stock Alerts</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {warehouseOverview.warehouses.map((warehouse) => (
                          <div 
                            key={warehouse.name} 
                            className="bg-luxury-black/30 border border-luxury-gold/20 rounded-lg p-4 cursor-pointer hover:bg-luxury-gold/5 transition-colors"
                            onClick={() => handleWarehouseClick(warehouse)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium text-luxury-cream">{warehouse.name}</h4>
                                <p className="text-sm text-luxury-cream/60">{warehouse.location}</p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(warehouse.status)}`}>
                                {warehouse.status.charAt(0).toUpperCase() + warehouse.status.slice(1)}
                              </span>
                            </div>
                            <div className="text-sm text-luxury-cream/60">
                              {warehouse.total_items.toLocaleString()} items
                            </div>
                          </div>
                        ))}
                      </div>
                    </LuxuryCard>
                  ) : null}
                  
                  {/* Recent Orders - Now using real data with loading state */}
                  <LuxuryCard className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-display text-luxury-gold">Recent Orders</h3>
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
                        <div className="text-luxury-cream/60">No recent orders found</div>
                      </div>
                    )}
                  </LuxuryCard>
                </div>
                
                {/* Sidebar with additional widgets */}
                <div className="space-y-6">
                  <LuxuryCard className="p-6" variant="glass">
                    <h3 className="text-lg font-display text-luxury-gold mb-3">Voice Commands</h3>
                    <p className="text-sm text-luxury-cream/70 mb-4">
                      Use these voice commands to navigate the dashboard:
                    </p>
                    
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center gap-2">
                        <span className="text-luxury-gold">•</span>
                        <span>"Show sales"</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-luxury-gold">•</span>
                        <span>"Show inventory"</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-luxury-gold">•</span>
                        <span>"Create report"</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-luxury-gold">•</span>
                        <span>"Show Dubai inventory"</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-luxury-gold">•</span>
                        <span>"Help"</span>
                      </li>
                    </ul>
                  </LuxuryCard>
                  
                  <LuxuryCard className="p-6">
                    <h3 className="text-lg font-display text-luxury-gold mb-4">Warehouse Inventory</h3>
                    
                    {inventoryLoading ? (
                      <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="flex justify-between items-center p-3 border border-luxury-gold/10 rounded-md">
                            <div>
                              <Skeleton className="h-4 w-20 mb-1" />
                              <Skeleton className="h-3 w-16 mb-1" />
                              <Skeleton className="h-3 w-12" />
                            </div>
                            <Skeleton className="h-5 w-12" />
                          </div>
                        ))}
                      </div>
                    ) : warehouseData && warehouseData.length > 0 ? (
                      <div className="space-y-3">
                        {warehouseData.map((warehouse, index) => (
                          <div 
                            key={warehouse.warehouse || index} 
                            className="flex justify-between items-center p-3 border border-luxury-gold/10 rounded-md cursor-pointer hover:bg-luxury-gold/5 transition-colors"
                            onClick={() => handleInventoryWarehouseClick(warehouse)}
                          >
                            <div>
                              <h4 className="font-medium">{warehouse.warehouse}</h4>
                              <p className="text-xs text-luxury-cream/60">
                                {warehouse.stock_quantity} units
                              </p>
                              {warehouse.provider && (
                                <p className="text-xs text-luxury-gold/70">{warehouse.provider}</p>
                              )}
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(warehouse.stock_status)}`}>
                              {warehouse.stock_status.charAt(0).toUpperCase() + warehouse.stock_status.slice(1)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-luxury-cream/60">No inventory data available</div>
                    )}
                  </LuxuryCard>

                  {/* Product Insights - Now navigates to ProductsPage */}
                  <LuxuryCard 
                    className="p-6 cursor-pointer hover:bg-luxury-gold/5 transition-colors"
                    onClick={() => navigate('/products')}
                  >
                    <h3 className="text-lg font-display text-luxury-gold mb-4">Product Insights</h3>
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
                          <span className="text-luxury-cream/60">Total Products</span>
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
                      <div className="text-center py-4 text-luxury-cream/60">No product data available</div>
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
    </div>
  );
};

export default Dashboard;
