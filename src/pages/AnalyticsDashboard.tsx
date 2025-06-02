
import React, { useState } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { TrendingUp, DollarSign, Users, ShoppingCart, BarChart3, PieChart } from 'lucide-react';

const AnalyticsDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-luxury-black text-luxury-cream">
      <DashboardSidebar 
        isCollapsed={sidebarCollapsed} 
        toggleSidebar={toggleSidebar}
      />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-display text-luxury-gold mb-2">Analytics Dashboard</h1>
            <p className="text-luxury-cream/60">Business intelligence and performance metrics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LuxuryCard className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <DollarSign className="h-8 w-8 text-green-400" />
                <div>
                  <h3 className="font-display text-luxury-gold">Sales Analytics</h3>
                  <p className="text-sm text-luxury-cream/60">Revenue & performance</p>
                </div>
              </div>
              <div className="text-center py-4 text-luxury-cream/60">
                <p>Coming soon...</p>
              </div>
            </LuxuryCard>

            <LuxuryCard className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <TrendingUp className="h-8 w-8 text-blue-400" />
                <div>
                  <h3 className="font-display text-luxury-gold">Marketing ROI</h3>
                  <p className="text-sm text-luxury-cream/60">Campaign performance</p>
                </div>
              </div>
              <div className="text-center py-4 text-luxury-cream/60">
                <p>Coming soon...</p>
              </div>
            </LuxuryCard>

            <LuxuryCard className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Users className="h-8 w-8 text-purple-400" />
                <div>
                  <h3 className="font-display text-luxury-gold">Customer Analytics</h3>
                  <p className="text-sm text-luxury-cream/60">Customer insights</p>
                </div>
              </div>
              <div className="text-center py-4 text-luxury-cream/60">
                <p>Coming soon...</p>
              </div>
            </LuxuryCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
