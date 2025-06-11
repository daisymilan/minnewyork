
import React from 'react';
import { cn } from '@/lib/utils';
import { LuxuryCard } from '../ui/luxury-card';
import { 
  LineChart, 
  Line, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface KpiCardProps {
  title: string;
  value: string | number;
  trend?: number;
  duration?: string;
  data?: any[];
  icon?: React.ReactNode;
  className?: string;
  type?: 'currency' | 'percentage' | 'number';
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  trend,
  duration = "vs last week",
  data,
  icon,
  className,
  type = 'number'
}) => {
  // Format value based on type
  const formattedValue = React.useMemo(() => {
    if (typeof value === 'string') return value;
    
    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD',
          maximumFractionDigits: 0
        }).format(value);
      case 'percentage':
        return `${value}%`;
      default:
        return new Intl.NumberFormat('en-US').format(value);
    }
  }, [value, type]);

  // Default chart data if none provided
  const chartData = React.useMemo(() => {
    if (data) return data;
    
    return Array.from({ length: 12 }, (_, i) => ({
      name: `Point ${i}`,
      value: Math.floor(Math.random() * 100)
    }));
  }, [data]);

  const trendColor = trend === undefined ? 'text-gray-600' :
                    trend > 0 ? 'text-green-500' : 
                    trend < 0 ? 'text-red-500' : 'text-gray-600';

  return (
    <LuxuryCard 
      className={cn("flex flex-col h-full w-full gap-2 p-5 bg-white border border-gray-200", className)}
      variant="default"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-sans font-semibold text-primary">
            {formattedValue}
          </p>
          
          {trend !== undefined && (
            <div className={cn("flex items-center space-x-1 text-sm", trendColor)}>
              {trend > 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              )}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        
        <div className="text-xs text-gray-600">
          {duration}
        </div>
      </div>
      
      {/* Mini chart */}
      <div className="h-16 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-2 border border-gray-200 shadow-lg text-xs text-black">
                      {payload[0].value}
                    </div>
                  );
                }
                return null;
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </LuxuryCard>
  );
};

export default KpiCard;
