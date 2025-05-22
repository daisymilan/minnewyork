
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

  const trendColor = trend === undefined ? 'text-luxury-cream' :
                    trend > 0 ? 'text-green-500' : 
                    trend < 0 ? 'text-red-500' : 'text-luxury-cream';

  return (
    <LuxuryCard 
      className={cn("flex flex-col h-full w-full gap-2 p-5", className)}
      variant="default"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-luxury-cream/60">{title}</h3>
        {icon && <div className="text-luxury-gold">{icon}</div>}
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-display font-semibold text-luxury-gold">
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
        
        <div className="text-xs text-luxury-cream/60">
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
              stroke="#D4AF37"
              strokeWidth={2}
              dot={false}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-luxury-black p-2 border border-luxury-gold/30 text-xs">
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
