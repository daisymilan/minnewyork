import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import KpiCard from '@/components/dashboard/KpiCard';
import KpiDetailsModal from '@/components/dashboard/KpiDetailsModal';
import WarehouseDetailsSheet from '@/components/dashboard/WarehouseDetailsSheet';
import MarketInsightsModal from '@/components/dashboard/MarketInsightsModal';
import CustomerInsightsModal from '@/components/dashboard/CustomerInsightsModal';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { Badge } from '@/components/ui/badge';
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
  const [kpiDetailsOpen, setKpiDetailsOpen] = useState(false);
  const [selectedKpiType, setSelectedKpiType] = useState<'revenue' | 'orders' | 'conversion' | 'averageOrder' | null>(null);
  const [marketInsightsOpen, setMarketInsightsOpen] = useState(false);
  const [customerInsightsOpen, setCustomerInsightsOpen] = useState(false);

  // Initialize webhook event listeners
  useWebhookEvents();

  // all the data fetching logic
  const { data: overviewData, isLoading: overviewLoading } = useQuery({
    queryKey: ['dashboardOverview'],
    queryFn: dashboardApi.getOverview,
    refetchInterval: 14400000, // 4 hours in milliseconds
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['dashboardOrders'],
    queryFn: dashboardApi.getOrders,
    refetchInterval: 14400000, // 4 hours in milliseconds
  });

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['dashboardAnalytics'],
    queryFn: dashboardApi.getAnalytics,
    refetchInterval: 14400000, // 4 hours in milliseconds
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['dashboardProducts'],
    queryFn: dashboardApi.getProducts,
    refetchInterval: 14400000, // 4 hours in milliseconds
  });

  const { data: customersData, isLoading: customersLoading } = useQuery({
    queryKey: ['dashboardCustomers'],
    queryFn: dashboardApi.getCustomers,
    refetchInterval: 14400000, // 4 hours in milliseconds
  });

  const { data: warehouseData, isLoading: warehouseLoading } = useQuery({
    queryKey: ['warehouseOverview'],
    queryFn: async () => {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/warehouse/overview');
      const result = await response.json();
      
      console.log('🏭 Raw warehouse overview response:', result);
      
      if (result.success) {
        return result;
      }
      
      throw new Error('Failed to fetch warehouse overview');
    },
    refetchInterval: 14400000, // 4 hours in milliseconds
  });

  const { data: marketInsightsData, isLoading: marketInsightsLoading } = useQuery({
    queryKey: ['marketInsights'],
    queryFn: async () => {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/dashboard/market-insights');
      const result = await response.json();
      
      // Handle array response - take the first item
      if (Array.isArray(result) && result.length > 0) {
        return result[0];
      }
      return result;
    },
    refetchInterval: 14400000, // 4 hours in milliseconds
  });
  
  const kpiData = analyticsLoading || !analyticsData ? null : {
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
      value: analyticsData.kpis.conversion_rate,
      trend: analyticsData.kpis.conversion_trend,
      type: 'percentage' as const,
    },
    averageOrder: {
      value: analyticsData.kpis.average_order_value || (analyticsData.kpis.total_revenue / analyticsData.kpis.total_orders),
      trend: analyticsData.kpis.aov_trend,
      type: 'currency' as const,
    }
  };
  
  const regionalData = overviewLoading ? null : overviewData?.regional_breakdown ? 
    Object.entries(overviewData.regional_breakdown).map(([name, value]) => {
      let numValue = null;
      if (typeof value === 'number' && value > 0) {
        numValue = value;
      } else if (typeof value === 'string' && value !== '') {
        const parsed = parseInt(value);
        numValue = isNaN(parsed) ? null : parsed;
      }
      
      return {
        name,
        value: numValue
      };
    }) : null;
  
  // helper functions
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-500/10 text-green-500';
      case 'shipped': return 'bg-blue-500/10 text-blue-500';
      case 'processing': return 'bg-amber-500/10 text-amber-500';
      case 'pending': return 'bg-orange-500/10 text-orange-500';
      case 'refunded': return 'bg-purple-500/10 text-purple-500';
      case 'cancelled': return 'bg-red-500/10 text-red-500';
      case 'active': return 'bg-green-500/10 text-green-500';
      case 'operational': return 'bg-green-500/10 text-green-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getWarehouseTypeColor = (type?: string) => {
    switch (type) {
      case 'manufacturing': return 'bg-purple-500/10 text-purple-500';
      case 'fulfillment': return 'bg-blue-500/10 text-blue-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getWarehouseTypeLabel = (type?: string) => {
    switch (type) {
      case 'manufacturing': return 'Manufacturing';
      case 'fulfillment': return 'Fulfillment';
      default: return 'Warehouse';
    }
  };

  const handleWarehouseClick = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setWarehouseDetailsOpen(true);
  };

  const handleKpiClick = (kpiType: 'revenue' | 'orders' | 'conversion' | 'averageOrder') => {
    setSelectedKpiType(kpiType);
    setKpiDetailsOpen(true);
  };

  const handleMarketInsightsClick = () => {
    setMarketInsightsOpen(true);
  };

  const handleCustomerInsightsClick = () => {
    setCustomerInsightsOpen(true);
  };
  
  return (
    <div className="flex h-screen bg-white text-black">
      <DashboardSidebar 
        isCollapsed={sidebarCollapsed} 
        toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          {user && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-sans mb-1 text-primary">
                Welcome to Dashboard, {user.name}
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Here's what's happening with your fragrance business today
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {analyticsLoading || !kpiData ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <LuxuryCard key={i} className="p-6 bg-white border border-gray-200">
                      <Skeleton className="h-4 w-24 mb-4" />
                      <Skeleton className="h-8 w-32 mb-2" />
                      <Skeleton className="h-3 w-16" />
                    </LuxuryCard>
                  ))
                ) : (
                  <>
                    <div onClick={() => handleKpiClick('revenue')} className="cursor-pointer">
                      <KpiCard
                        title="Total Revenue"
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
                        title="Orders"
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
                        title="Conversion Rate"
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
                        title="Average Order Value"
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
              
              {/* Two column layout for dashboard widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main content area */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Sales by Region */}
                  <LuxuryCard className="p-6 bg-white border border-gray-200">
                    <h3 className="text-lg font-sans text-primary mb-4">Sales by Region</h3>
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
                    ) : regionalData && regionalData.length > 0 ? (
                      <div className="space-y-4">
                         {regionalData.map((region) => (
                          <div key={region.name} className="flex items-center">
                            <span className="w-32 text-sm text-black">{region.name}</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              {region.value !== null && (
                                <div 
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${Math.min(region.value, 100)}%` }}
                                ></div>
                              )}
                            </div>
                            <span className="ml-3 text-sm text-black">
                              {region.value !== null ? `${region.value}%` : '--'}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-600">No regional data available</div>
                    )}
                  </LuxuryCard>
                  
                  {/* Warehouse Network - Updated to use new warehouse data structure */}
                  <LuxuryCard className="p-6 bg-white border border-gray-200">
                    <h3 className="text-lg font-sans text-primary mb-4">Warehouse Network</h3>
                    {warehouseLoading ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="text-center">
                              <Skeleton className="h-8 w-16 mx-auto mb-2" />
                              <Skeleton className="h-4 w-20 mx-auto" />
                            </div>
                          ))}
                        </div>
                        <div className="space-y-4">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-20 w-full" />
                          ))}
                        </div>
                      </div>
                    ) : warehouseData ? (
                      <>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{warehouseData.total_warehouses || '--'}</div>
                            <div className="text-sm text-gray-600">Locations</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-500">{warehouseData.active_warehouses || '--'}</div>
                            <div className="text-sm text-gray-600">Active</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400">{warehouseData.warehouses?.filter(w => w.country !== 'US').length || '--'}</div>
                            <div className="text-sm text-gray-600">Fulfillment</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{warehouseData.total_capacity || 'N/A'}</div>
                            <div className="text-sm text-gray-600">Capacity</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <h4 className="font-medium text-primary">Fulfillment Centers</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {warehouseData.warehouses?.filter(warehouse => warehouse.country !== 'US').map((warehouse) => (
                              <div 
                                key={warehouse.id || warehouse.name} 
                                className="bg-gray-50 border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleWarehouseClick(warehouse)}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h5 className="font-medium text-black flex items-center gap-2">
                                      {warehouse.name}
                                      <Badge className={getWarehouseTypeColor(warehouse.warehouse_type)}>
                                        {getWarehouseTypeLabel(warehouse.warehouse_type)}
                                      </Badge>
                                    </h5>
                                    <p className="text-sm text-gray-600">{warehouse.location}</p>
                                  </div>
                                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(warehouse.status)}`}>
                                    {warehouse.status.charAt(0).toUpperCase() + warehouse.status.slice(1)}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {warehouse.total_items || 0} items in stock
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {(!warehouseData.warehouses?.filter(w => w.country !== 'US').length) && (
                            <div className="text-center py-4 text-gray-600">
                              No warehouses found
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4 text-gray-600">Loading warehouse data...</div>
                    )}
                  </LuxuryCard>
                  
                  {/* Recent Orders */}
                  <LuxuryCard className="p-6 bg-white border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-sans text-primary">Recent Orders</h3>
                      <button 
                        onClick={() => navigate('/orders')}
                        className="text-sm text-primary hover:underline"
                      >
                        View All
                      </button>
                    </div>
                    
                    {ordersLoading ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-5 gap-4 py-3 border-b border-gray-200">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-4" />
                          ))}
                        </div>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="grid grid-cols-5 gap-4 py-3 border-b border-gray-100">
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
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 font-medium text-gray-600">Order ID</th>
                              <th className="text-left py-3 font-medium text-gray-600">Customer</th>
                              <th className="text-left py-3 font-medium text-gray-600">Email</th>
                              <th className="text-left py-3 font-medium text-gray-600">Amount</th>
                              <th className="text-left py-3 font-medium text-gray-600">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ordersData.orders.slice(0, 5).map((order) => (
                              <tr key={order.id} className="border-b border-gray-100">
                                <td className="py-3 text-black">#{order.id}</td>
                                <td className="py-3 text-black">{order.customer_name}</td>
                                <td className="py-3 text-gray-600">{order.customer_email || 'N/A'}</td>
                                <td className="py-3 text-black">${order.amount.toFixed(2)}</td>
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
                        <div className="text-gray-600">Loading...</div>
                      </div>
                    )}
                  </LuxuryCard>
                </div>
                
                {/* Sidebar with widgets */}
                <div className="space-y-6">
                  {/* Make Market Insights clickable */}
                  <LuxuryCard 
                    className="p-6 bg-white border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={handleMarketInsightsClick}
                  >
                    <h3 className="text-lg font-sans text-primary mb-3">Market Insights</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Key metrics for overall market performance
                    </p>
                    
                    {marketInsightsLoading ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-8" />
                        </div>
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-12" />
                        </div>
                      </div>
                    ) : marketInsightsData ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Market Share</span>
                          <span className="text-primary">{marketInsightsData.market_share || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Top State</span>
                          <span className="text-primary">{marketInsightsData.top_state || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Peak Hours</span>
                          <span className="text-primary">{marketInsightsData.peak_hours || 'N/A'}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-3 text-center">
                          Click for detailed insights
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-600">Loading...</div>
                    )}
                  </LuxuryCard>

                  {/* Product Performance - Fixed routing */}
                  <LuxuryCard 
                    className="p-6 bg-white border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => navigate('/products')}
                  >
                    <h3 className="text-lg font-sans text-primary mb-4">Product Performance</h3>
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
                          <span className="text-gray-600">Products</span>
                          <span className="text-black">{productsData.insights?.total_products || 'Loading...'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Low Stock</span>
                          <span className="text-red-400">{productsData.insights?.low_stock_alerts || 'Loading...'}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-3 text-center">
                          Click for product details
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-600">Loading...</div>
                    )}
                  </LuxuryCard>

                  {/* Make Customer Insights clickable */}
                  <LuxuryCard 
                    className="p-6 bg-white border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={handleCustomerInsightsClick}
                  >
                    <h3 className="text-lg font-sans text-primary mb-4">Customer Insights</h3>
                    {customersLoading ? (
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
                    ) : customersData ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Customers</span>
                          <span className="text-black">{customersData.insights?.total_customers || 'Loading...'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">VIP Customers</span>
                          <span className="text-primary">{customersData.insights?.customer_segments?.VIP || 'Loading...'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Premium Members</span>
                          <span className="text-primary">{customersData.insights?.customer_segments?.Premium || 'Loading...'}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-3 text-center">
                          Click for detailed insights
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-600">Loading...</div>
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

      {/* Market Insights Modal */}
      <MarketInsightsModal
        isOpen={marketInsightsOpen}
        onClose={() => setMarketInsightsOpen(false)}
        data={marketInsightsData}
        type="global"
      />

      {/* Customer Insights Modal */}
      <CustomerInsightsModal
        isOpen={customerInsightsOpen}
        onClose={() => setCustomerInsightsOpen(false)}
        data={customersData}
        type="global"
      />
    </div>
  );
};

export default Dashboard;
