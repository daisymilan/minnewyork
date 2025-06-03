import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import KpiCard from '@/components/dashboard/KpiCard';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { dashboardApi } from '@/services/dashboard';
import { useWebhookEvents } from '@/hooks/useWebhookEvents';

const Dashboard = () => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
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
  
  // Use real data from the new API endpoints
  const kpiData = analyticsData ? {
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
  } : {
    revenue: { value: 283450, trend: 12.5, type: 'currency' as const },
    orders: { value: 1254, trend: 8.2, type: 'number' as const },
    conversion: { value: 3.2, trend: -1.8, type: 'percentage' as const },
    averageOrder: { value: 226, trend: 5.3, type: 'currency' as const }
  };
  
  // Use real regional data from overview API with improved type handling
  const regionalData = overviewData?.regional_breakdown ? 
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
    }) : [
      { name: 'North America', value: 42 },
      { name: 'Europe', value: 28 },
      { name: 'Middle East', value: 18 },
      { name: 'Asia', value: 12 },
    ];
  
  const warehouseData = [
    { name: 'Vegas', stock: 1234, status: 'Optimal' },
    { name: 'Nice', stock: 856, status: 'Low' },
    { name: 'Dubai', stock: 2145, status: 'Optimal' },
    { name: 'Riyadh', stock: 984, status: 'Medium' },
  ];
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-500/10 text-green-500';
      case 'shipped': return 'bg-blue-500/10 text-blue-500';
      case 'processing': return 'bg-amber-500/10 text-amber-500';
      case 'refunded': return 'bg-purple-500/10 text-purple-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
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
                      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7Z" />
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
              </div>
              
              {/* Two column layout for dashboard widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main content area */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Sales by Region */}
                  <LuxuryCard className="p-6">
                    <h3 className="text-lg font-display text-luxury-gold mb-4">Sales by Region</h3>
                    {overviewLoading ? (
                      <div className="text-center py-4">Loading regional data...</div>
                    ) : (
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
                    )}
                  </LuxuryCard>
                  
                  {/* Recent Orders */}
                  <LuxuryCard className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-display text-luxury-gold">Recent Orders</h3>
                      <button className="text-sm text-luxury-gold hover:underline">View All</button>
                    </div>
                    
                    {ordersLoading ? (
                      <div className="text-center py-4">Loading orders...</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-luxury-gold/10">
                              <th className="text-left py-3 font-medium text-luxury-cream/60">Order ID</th>
                              <th className="text-left py-3 font-medium text-luxury-cream/60">Customer</th>
                              <th className="text-left py-3 font-medium text-luxury-cream/60">Product</th>
                              <th className="text-left py-3 font-medium text-luxury-cream/60">Amount</th>
                              <th className="text-left py-3 font-medium text-luxury-cream/60">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ordersData?.orders?.slice(0, 5).map((order) => (
                              <tr key={order.id} className="border-b border-luxury-gold/5">
                                <td className="py-3">#{order.id}</td>
                                <td className="py-3">{order.customer_name}</td>
                                <td className="py-3">{order.product_name}</td>
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
                    
                    <div className="space-y-3">
                      {warehouseData.map((warehouse) => (
                        <div key={warehouse.name} className="flex justify-between items-center p-3 border border-luxury-gold/10 rounded-md">
                          <div>
                            <h4 className="font-medium">{warehouse.name}</h4>
                            <p className="text-xs text-luxury-cream/60">{warehouse.stock} units</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            warehouse.status === 'Optimal' ? 'bg-green-500/10 text-green-500' :
                            warehouse.status === 'Medium' ? 'bg-amber-500/10 text-amber-500' :
                            'bg-red-500/10 text-red-500'
                          }`}>
                            {warehouse.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </LuxuryCard>

                  {/* Product Insights */}
                  {productsData && (
                    <LuxuryCard className="p-6">
                      <h3 className="text-lg font-display text-luxury-gold mb-4">Product Insights</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-luxury-cream/60">Total Products</span>
                          <span>{productsData.insights?.total_products || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-luxury-cream/60">Low Stock Alerts</span>
                          <span className="text-red-400">{productsData.insights?.low_stock_alerts || 0}</span>
                        </div>
                      </div>
                    </LuxuryCard>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
