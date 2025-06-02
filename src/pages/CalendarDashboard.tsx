
import React, { useState } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { Calendar, Clock, Package, Rocket, Users, MapPin } from 'lucide-react';

const CalendarDashboard = () => {
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
            <h1 className="text-3xl font-display text-luxury-gold mb-2">Calendar Dashboard</h1>
            <p className="text-luxury-cream/60">Production schedules, launches, and events</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LuxuryCard className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Package className="h-8 w-8 text-blue-400" />
                <div>
                  <h3 className="font-display text-luxury-gold">Production Calendar</h3>
                  <p className="text-sm text-luxury-cream/60">Manufacturing schedules</p>
                </div>
              </div>
              <div className="text-center py-4 text-luxury-cream/60">
                <p>Coming soon...</p>
              </div>
            </LuxuryCard>

            <LuxuryCard className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Rocket className="h-8 w-8 text-green-400" />
                <div>
                  <h3 className="font-display text-luxury-gold">Launch Calendar</h3>
                  <p className="text-sm text-luxury-cream/60">Product launches & campaigns</p>
                </div>
              </div>
              <div className="text-center py-4 text-luxury-cream/60">
                <p>Coming soon...</p>
              </div>
            </LuxuryCard>

            <LuxuryCard className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <MapPin className="h-8 w-8 text-purple-400" />
                <div>
                  <h3 className="font-display text-luxury-gold">Event Calendar</h3>
                  <p className="text-sm text-luxury-cream/60">Trade shows & events</p>
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

export default CalendarDashboard;
