
import React, { useState } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { Zap, Image, TestTube, Palette, Target, Copy } from 'lucide-react';

const AdCreatorDashboard = () => {
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
            <h1 className="text-3xl font-display text-luxury-gold mb-2">Ad Creator Studio</h1>
            <p className="text-luxury-cream/60">Create stunning campaigns for luxury fragrance marketing</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LuxuryCard className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Zap className="h-8 w-8 text-yellow-400" />
                <div>
                  <h3 className="font-display text-luxury-gold">Campaign Builder</h3>
                  <p className="text-sm text-luxury-cream/60">Visual ad creation</p>
                </div>
              </div>
              <div className="text-center py-4 text-luxury-cream/60">
                <p>Coming soon...</p>
              </div>
            </LuxuryCard>

            <LuxuryCard className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Palette className="h-8 w-8 text-pink-400" />
                <div>
                  <h3 className="font-display text-luxury-gold">Template Library</h3>
                  <p className="text-sm text-luxury-cream/60">Pre-designed templates</p>
                </div>
              </div>
              <div className="text-center py-4 text-luxury-cream/60">
                <p>Coming soon...</p>
              </div>
            </LuxuryCard>

            <LuxuryCard className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <TestTube className="h-8 w-8 text-blue-400" />
                <div>
                  <h3 className="font-display text-luxury-gold">A/B Testing</h3>
                  <p className="text-sm text-luxury-cream/60">Test ad variations</p>
                </div>
              </div>
              <div className="text-center py-4 text-luxury-cream/60">
                <p>Coming soon...</p>
              </div>
            </LuxuryCard>

            <LuxuryCard className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Image className="h-8 w-8 text-green-400" />
                <div>
                  <h3 className="font-display text-luxury-gold">Asset Manager</h3>
                  <p className="text-sm text-luxury-cream/60">Organize brand assets</p>
                </div>
              </div>
              <div className="text-center py-4 text-luxury-cream/60">
                <p>Coming soon...</p>
              </div>
            </LuxuryCard>

            <LuxuryCard className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Copy className="h-8 w-8 text-purple-400" />
                <div>
                  <h3 className="font-display text-luxury-gold">Copy Generator</h3>
                  <p className="text-sm text-luxury-cream/60">AI-powered ad copy</p>
                </div>
              </div>
              <div className="text-center py-4 text-luxury-cream/60">
                <p>Coming soon...</p>
              </div>
            </LuxuryCard>

            <LuxuryCard className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Target className="h-8 w-8 text-red-400" />
                <div>
                  <h3 className="font-display text-luxury-gold">Targeting Hub</h3>
                  <p className="text-sm text-luxury-cream/60">Audience targeting</p>
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

export default AdCreatorDashboard;
