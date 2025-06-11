
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface CustomerInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  type?: 'global' | 'us';
}

const CustomerInsightsModal: React.FC<CustomerInsightsModalProps> = ({
  isOpen,
  onClose,
  data,
  type = 'global'
}) => {
  const customers = data?.customers || [];
  const insights = data?.insights || {};

  const getSegmentColor = (segment: string) => {
    switch (segment?.toLowerCase()) {
      case 'vip': return 'bg-purple-500/10 text-purple-500';
      case 'premium': return 'bg-blue-500/10 text-blue-500';
      case 'regular': return 'bg-green-500/10 text-green-500';
      case 'new': return 'bg-amber-500/10 text-amber-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const truncateName = (name: string, maxLength: number = 30) => {
    if (!name || name.length <= maxLength) return name || 'Unknown Customer';
    return name.substring(0, maxLength) + '...';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-sans text-primary">
            {type === 'us' ? 'US Customer Insights' : 'Global Customer Insights'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Segments Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">{insights.total_customers || 0}</div>
              <div className="text-sm text-gray-600">Total Customers</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-500">{insights.customer_segments?.VIP || 0}</div>
              <div className="text-sm text-gray-600">VIP</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">{insights.customer_segments?.Premium || 0}</div>
              <div className="text-sm text-gray-600">Premium</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-amber-500">{insights.customer_segments?.New || 0}</div>
              <div className="text-sm text-gray-600">New</div>
            </div>
          </div>

          {/* Additional Insights */}
          {insights.active_customers !== undefined && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-xl font-bold text-green-500">{insights.active_customers}</div>
                <div className="text-sm text-gray-600">Active Customers</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-xl font-bold text-primary">${insights.average_order_value || 0}</div>
                <div className="text-sm text-gray-600">Avg Order Value</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-xl font-bold text-blue-500">{insights.new_customers_this_month || 0}</div>
                <div className="text-sm text-gray-600">New This Month</div>
              </div>
            </div>
          )}

          {/* Top States (US only) */}
          {type === 'us' && insights.top_states && insights.top_states.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-primary mb-4">Top States by Customer Count</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {insights.top_states.map((state: any, index: number) => (
                  <div key={state.state || index} className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-xl font-bold text-primary">{state.count}</div>
                    <div className="text-sm text-gray-600">{state.state}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Customers Table */}
          <div>
            <h3 className="text-lg font-medium text-primary mb-4">Top Customers</h3>
            {customers.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Email</TableHead>
                      {type === 'us' && <TableHead>State</TableHead>}
                      <TableHead>Orders</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Segment</TableHead>
                      {type === 'us' && <TableHead>Days Since Registration</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.slice(0, 10).map((customer: any, index: number) => (
                      <TableRow key={customer.id || index}>
                        <TableCell className="font-medium">
                          {truncateName(customer.name)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {customer.email || 'N/A'}
                        </TableCell>
                        {type === 'us' && (
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {customer.state || 'N/A'}
                            </Badge>
                          </TableCell>
                        )}
                        <TableCell>{customer.orders_count || 0}</TableCell>
                        <TableCell className="font-medium text-primary">
                          ${customer.total_spent?.toFixed(2) || '0.00'}
                        </TableCell>
                        <TableCell>
                          <Badge className={getSegmentColor(customer.segment || customer.customer_segment)}>
                            {customer.segment || customer.customer_segment || 'New'}
                          </Badge>
                        </TableCell>
                        {type === 'us' && (
                          <TableCell className="text-sm text-gray-600">
                            {customer.days_since_registration || 'N/A'} days
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">
                <div className="text-4xl mb-2">👥</div>
                <p>No customer data available</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerInsightsModal;
