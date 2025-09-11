
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface MarketInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  type: 'global' | 'us';
}

const MarketInsightsModal: React.FC<MarketInsightsModalProps> = ({
  isOpen,
  onClose,
  data,
  type
}) => {
  if (!data) return null;

  const isGlobal = type === 'global';
  const title = isGlobal ? 'Global Market Insights' : 'US Market Insights';
  
  // Prepare hourly distribution chart data
  const hourlyData = data.hourly_distribution?.map((value: number, index: number) => ({
    hour: `${index}:00`,
    orders: value
  })) || [];

  // Prepare regional/state breakdown data
  const regionData = isGlobal 
    ? Object.entries(data.regions_breakdown || {}).map(([region, info]: [string, any]) => ({
        name: region,
        revenue: info.revenue || null,
        orders: info.count || null
      }))
    : Object.entries(data.states_breakdown || {}).map(([state, info]: [string, any]) => ({
        name: state,
        revenue: parseFloat(info.revenue) || null,
        orders: info.count || null
      }));

  // Colors for charts
  const chartColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff7f'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-sans text-primary flex items-center gap-2">
            🌍 {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <LuxuryCard className="p-4 text-center bg-white border border-gray-200">
              <div className="text-2xl font-bold text-primary">{data.market_share}</div>
              <div className="text-sm text-gray-600">Market Share</div>
            </LuxuryCard>
            <LuxuryCard className="p-4 text-center bg-white border border-gray-200">
              <div className="text-2xl font-bold text-green-500">${data.total_revenue}</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </LuxuryCard>
            <LuxuryCard className="p-4 text-center bg-white border border-gray-200">
              <div className="text-2xl font-bold text-blue-500">{data.total_orders}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </LuxuryCard>
            <LuxuryCard className="p-4 text-center bg-white border border-gray-200">
              <div className="text-2xl font-bold text-primary">{data.conversion_rate}</div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
            </LuxuryCard>
          </div>

          {/* Growth Metrics */}
          {data.growth_metrics && (
            <LuxuryCard className="p-6 bg-white border border-gray-200">
              <h3 className="text-lg font-sans text-primary mb-4">📈 Growth Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-500">{data.growth_metrics.revenue_growth}</div>
                  <div className="text-sm text-gray-600">Revenue Growth</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-500">{data.growth_metrics.order_growth}</div>
                  <div className="text-sm text-gray-600">Order Growth</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-500">{data.growth_metrics.customer_growth}</div>
                  <div className="text-sm text-gray-600">Customer Growth</div>
                </div>
              </div>
            </LuxuryCard>
          )}

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Regional/State Performance */}
            <LuxuryCard className="p-6 bg-white border border-gray-200">
              <h3 className="text-lg font-sans text-primary mb-4">
                🏢 {isGlobal ? 'Regional' : 'State'} Performance
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </LuxuryCard>

            {/* Hourly Distribution */}
            <LuxuryCard className="p-6 bg-white border border-gray-200">
              <h3 className="text-lg font-sans text-primary mb-4">⏰ Order Distribution by Hour</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlyData}>
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '8px'
                      }}
                    />
                    <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center">
                <Badge className="bg-blue-500/10 text-blue-500">
                  Peak Hours: {data.peak_hours}
                </Badge>
              </div>
            </LuxuryCard>
          </div>

          {/* Additional Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LuxuryCard className="p-6 bg-white border border-gray-200">
              <h3 className="text-lg font-sans text-primary mb-4">🎯 Key Insights</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Top {isGlobal ? 'Region' : 'State'}</span>
                  <span className="text-primary font-medium">
                    {isGlobal ? data.top_region : data.top_state}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Order Value</span>
                  <span className="text-primary font-medium">${data.average_order_value}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Top Category</span>
                  <span className="text-primary font-medium">{data.top_category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Peak Hours</span>
                  <span className="text-primary font-medium">{data.peak_hours}</span>
                </div>
              </div>
            </LuxuryCard>

            <LuxuryCard className="p-6 bg-white border border-gray-200">
              <h3 className="text-lg font-sans text-primary mb-4">📊 Data Sources</h3>
              <div className="space-y-3">
                {data.data_sources && Object.entries(data.data_sources).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600 capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-black font-medium">{value}</span>
                  </div>
                ))}
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Last Updated: {new Date(data.last_updated).toLocaleString()}
                  </div>
                </div>
              </div>
            </LuxuryCard>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MarketInsightsModal;
