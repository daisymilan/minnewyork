
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { dashboardApi } from '@/services/dashboard';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const OrdersPage = () => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  const { data: ordersData, isLoading, error } = useQuery({
    queryKey: ['ordersPage'],
    queryFn: dashboardApi.getOrders,
    refetchInterval: 60000,
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'shipped': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'processing': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'pending': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'refunded': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-display text-luxury-gold mb-2">Orders</h1>
                <p className="text-luxury-cream/60">
                  Manage and track all your orders
                </p>
              </div>
              
              {ordersData?.summary && (
                <div className="flex gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-luxury-gold">{ordersData.summary.total_orders}</div>
                    <div className="text-luxury-cream/60">Total Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-luxury-gold">${ordersData.summary.total_revenue.toFixed(2)}</div>
                    <div className="text-luxury-cream/60">Total Revenue</div>
                  </div>
                </div>
              )}
            </div>

            <LuxuryCard className="overflow-hidden">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="text-luxury-cream/60">Loading orders...</div>
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <div className="text-red-400 mb-2">Failed to load orders</div>
                  <div className="text-xs text-luxury-cream/60">Error: {error.message}</div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-luxury-gold/10 hover:bg-transparent">
                      <TableHead className="text-luxury-cream/60 font-medium">Order ID</TableHead>
                      <TableHead className="text-luxury-cream/60 font-medium">Customer</TableHead>
                      <TableHead className="text-luxury-cream/60 font-medium">Email</TableHead>
                      <TableHead className="text-luxury-cream/60 font-medium">Total</TableHead>
                      <TableHead className="text-luxury-cream/60 font-medium">Status</TableHead>
                      <TableHead className="text-luxury-cream/60 font-medium">Region</TableHead>
                      <TableHead className="text-luxury-cream/60 font-medium">Date</TableHead>
                      <TableHead className="text-luxury-cream/60 font-medium">Items</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordersData?.orders?.map((order) => (
                      <TableRow 
                        key={order.id} 
                        className="border-luxury-gold/5 hover:bg-luxury-gold/5 transition-colors"
                      >
                        <TableCell className="font-mono text-luxury-cream">
                          #{order.id}
                        </TableCell>
                        <TableCell className="text-luxury-cream">
                          {order.customer_name}
                        </TableCell>
                        <TableCell className="text-luxury-cream/80 text-sm">
                          {order.customer_email || 'N/A'}
                        </TableCell>
                        <TableCell className="text-luxury-cream font-medium">
                          ${order.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(order.status)} border`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-luxury-cream/80">
                          {order.region || 'Unknown'}
                        </TableCell>
                        <TableCell className="text-luxury-cream/80 text-sm">
                          {formatDate(order.date_created)}
                        </TableCell>
                        <TableCell className="text-luxury-cream/80">
                          {order.items_count || 1} item{(order.items_count || 1) > 1 ? 's' : ''}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              
              {!isLoading && !error && (!ordersData?.orders || ordersData.orders.length === 0) && (
                <div className="p-8 text-center">
                  <div className="text-luxury-cream/60">No orders found</div>
                </div>
              )}
            </LuxuryCard>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrdersPage;
