
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface KpiDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpiType: 'revenue' | 'orders' | 'conversion' | 'averageOrder' | null;
  data?: any;
}

const KpiDetailsModal: React.FC<KpiDetailsModalProps> = ({
  isOpen,
  onClose,
  kpiType,
  data
}) => {
  const getKpiDetails = () => {
    if (!kpiType || !data) return null;

    const mockChartData = Array.from({ length: 12 }, (_, i) => ({
      name: `Month ${i + 1}`,
      value: Math.floor(Math.random() * 1000) + 500
    }));

    switch (kpiType) {
      case 'revenue':
        return {
          title: 'Revenue Analytics',
          icon: '💰',
          mainValue: `$${data.revenue.value.toLocaleString()}`,
          trend: data.revenue.trend,
          insights: [
            { label: 'Monthly Growth', value: `${data.revenue.trend}%`, positive: data.revenue.trend > 0 },
            { label: 'YTD Revenue', value: `$${(data.revenue.value * 1.2).toLocaleString()}` },
            { label: 'Target Achievement', value: '87%', positive: true },
            { label: 'Top Product Revenue', value: '$45,230' }
          ],
          chartData: mockChartData.map(item => ({ ...item, value: item.value * 100 }))
        };
      
      case 'orders':
        return {
          title: 'Orders Analytics',
          icon: '📦',
          mainValue: data.orders.value.toLocaleString(),
          trend: data.orders.trend,
          insights: [
            { label: 'Daily Average', value: Math.round(data.orders.value / 30).toString() },
            { label: 'Completed Orders', value: `${Math.round(data.orders.value * 0.85)}` },
            { label: 'Pending Orders', value: `${Math.round(data.orders.value * 0.15)}` },
            { label: 'Return Rate', value: '2.3%', positive: false }
          ],
          chartData: mockChartData
        };
      
      case 'conversion':
        return {
          title: 'Conversion Rate Analytics',
          icon: '📈',
          mainValue: `${data.conversion.value}%`,
          trend: data.conversion.trend,
          insights: [
            { label: 'Desktop Conversion', value: '4.1%' },
            { label: 'Mobile Conversion', value: '2.8%' },
            { label: 'Best Performing Page', value: 'Product Detail' },
            { label: 'Cart Abandonment', value: '68%', positive: false }
          ],
          chartData: mockChartData.map(item => ({ ...item, value: Math.random() * 10 + 1 }))
        };
      
      case 'averageOrder':
        return {
          title: 'Average Order Value Analytics',
          icon: '🛒',
          mainValue: `$${data.averageOrder.value.toFixed(0)}`,
          trend: data.averageOrder.trend,
          insights: [
            { label: 'Highest AOV Product', value: 'Luxury Fragrance Set' },
            { label: 'Weekend AOV', value: `$${(data.averageOrder.value * 1.15).toFixed(0)}` },
            { label: 'Weekday AOV', value: `$${(data.averageOrder.value * 0.95).toFixed(0)}` },
            { label: 'Upsell Success Rate', value: '23%', positive: true }
          ],
          chartData: mockChartData.map(item => ({ ...item, value: item.value / 2 + 150 }))
        };
      
      default:
        return null;
    }
  };

  const details = getKpiDetails();

  if (!details) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-luxury-black border-luxury-gold/20 text-luxury-cream">
        <DialogHeader>
          <DialogTitle className="text-xl font-display text-luxury-gold flex items-center gap-2">
            <span className="text-2xl">{details.icon}</span>
            {details.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Main Value with Trend */}
          <LuxuryCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-3xl font-display text-luxury-gold">{details.mainValue}</h3>
                <p className="text-luxury-cream/60">Current Value</p>
              </div>
              <div className={`flex items-center gap-2 ${details.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {details.trend > 0 ? '📈' : '📉'}
                <span className="text-lg font-medium">{Math.abs(details.trend)}%</span>
              </div>
            </div>

            {/* Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={details.chartData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#D4AF37', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#D4AF37', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#000',
                      border: '1px solid #D4AF37',
                      borderRadius: '8px',
                      color: '#F5F5DC'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#D4AF37"
                    strokeWidth={3}
                    dot={{ fill: '#D4AF37', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#D4AF37', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </LuxuryCard>

          {/* Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {details.insights.map((insight, index) => (
              <LuxuryCard key={index} className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-luxury-cream/60 text-sm">{insight.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-luxury-cream">{insight.value}</span>
                    {insight.positive !== undefined && (
                      <Badge className={insight.positive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}>
                        {insight.positive ? '↗' : '↘'}
                      </Badge>
                    )}
                  </div>
                </div>
              </LuxuryCard>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KpiDetailsModal;
