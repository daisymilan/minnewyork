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
import { orderRoutingApi } from '@/services/orderRouting';
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
  
  // all the data fetching logic
  const { data: overviewData, isLoading: overviewLoading } = useQuery({
    queryKey: ['dashboardOverviewUS'],
    queryFn: dashboardUSApi.getOverview,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['dashboardOrdersUS'],
    queryFn: dashboardUSApi.getOrders,
    refetchInterval: 60000, // Refetch every minute
  });

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['dashboardAnalyticsUS'],
    queryFn: dashboardUSApi.getAnalytics,
    refetchInterval: 30000,
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['dashboardProductsUS'],
    queryFn: dashboardUSApi.getProducts,
    refetchInterval: 120000, // Refetch every 2 minutes
  });

  const { data: customersData, isLoading: customersLoading } = useQuery({
    queryKey: ['dashboardCustomersUS'],
    queryFn: dashboardUSApi.getCustomers,
    refetchInterval: 120000, // Refetch every 2 minutes
  });

  // US warehouse data from API
  const { data: warehouseData, isLoading: warehouseLoading } = useQuery({
    queryKey: ['warehouseOverviewUS'],
    queryFn: () => orderRoutingApi.getWarehouseOverview(),
    refetchInterval: 60000, // Refetch every minute
  });

  // US market insights from API
  const { data: marketInsightsData, isLoading: marketInsightsLoading } = useQuery({
    queryKey: ['marketInsightsUS'],
    queryFn: () => fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/dashboard/market-insights-us').then(res => res.json()),
    refetchInterval: 300000, // Refetch every 5 minutes
  });
  
  // Use US analytics data for KPIs
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
      trend: analyticsData.kpis.conversion_trend || 0,
      type: 'percentage' as const,
    },
    averageOrder: {
      value: analyticsData.kpis.average_order_value || (analyticsData.kpis.total_revenue / analyticsData.kpis.total_orders),
      trend: analyticsData.kpis.aov_trend || 0,
      type: 'currency' as const,
    }
  };
  
  // Use US regional data
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
                Welcome to US Dashboard, {user.name}
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Here's what's happening with your US fragrance business today
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
                        title="Total Revenue (US)"
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
                        title="Orders (US)"
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
                        title="Conversion Rate (US)"
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
                        title="Average Order Value (US)"
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
                  {/* US Sales by Region */}
                  <LuxuryCard className="p-6 bg-white border border-gray-200">
                    <h3 className="text-lg font-sans text-primary mb-4">US Sales by Region</h3>
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
                              <div 
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${Math.min(region.value, 100)}%` }}
                              ></div>
                            </div>
                            <span className="ml-3 text-sm text-black">{region.value}%</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-600">Loading...</div>
                    )}
                  </LuxuryCard>
                  
                  {/* US Warehouse Network */}
                  <LuxuryCard className="p-6 bg-white border border-gray-200">
                    <h3 className="text-lg font-sans text-primary mb-4">US Warehouse Network</h3>
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
                            <div className="text-2xl font-bold text-primary">{warehouseData.total_warehouses}</div>
                            <div className="text-sm text-gray-600">US Locations</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-500">{warehouseData.active_warehouses}</div>
                            <div className="text-sm text-gray-600">Active</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400">{warehouseData.warehouses?.filter(w => w.warehouse_type === 'fulfillment').length || 0}</div>
                            <div className="text-sm text-gray-600">Fulfillment</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">${warehouseData.total_inventory_value?.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Total Value</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <h4 className="font-medium text-primary">US Fulfillment Centers</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {warehouseData.warehouses?.map((warehouse) => (
                              <div 
                                key={warehouse.name} 
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
                                  {warehouse.total_items?.toLocaleString()} products
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4 text-gray-600">Loading...</div>
                    )}
                  </LuxuryCard>
                  
                  {/* Recent US Orders */}
                  <LuxuryCard className="p-6 bg-white border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-sans text-primary">Recent US Orders</h3>
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
                
                {/* Sidebar with US-specific widgets */}
                <div className="space-y-6">
                  <LuxuryCard className="p-6 bg-white border border-gray-200">
                    <h3 className="text-lg font-sans text-primary mb-3">US Market Insights</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Key metrics for the US market performance
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
                          <span className="text-primary">{marketInsightsData.market_share || 'Loading...'}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Top State</span>
                          <span className="text-primary">{marketInsightsData.top_state || 'Loading...'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Peak Hours</span>
                          <span className="text-primary">{marketInsightsData.peak_hours || 'Loading...'}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-600">Loading...</div>
                    )}
                  </LuxuryCard>

                  {/* US Product Performance */}
                  <LuxuryCard 
                    className="p-6 bg-white border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => navigate('/products')}
                  >
                    <h3 className="text-lg font-sans text-primary mb-4">US Product Performance</h3>
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
                          <span className="text-gray-600">US Products</span>
                          <span className="text-black">{productsData.insights?.total_products || 'Loading...'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Low Stock (US)</span>
                          <span className="text-red-400">{productsData.insights?.low_stock_alerts || 'Loading...'}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-3 text-center">
                          Click for US product details
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-600">Loading...</div>
                    )}
                  </LuxuryCard>

                  {/* US Customer Insights */}
                  <LuxuryCard className="p-6 bg-white border border-gray-200">
                    <h3 className="text-lg font-sans text-primary mb-4">US Customer Insights</h3>
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
                          <span className="text-gray-600">Total US Customers</span>
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
    </div>
  );
};

export default DashboardUS;
