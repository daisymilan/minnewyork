
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LuxuryCard } from '@/components/ui/luxury-card';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { ConsumerReorderReminders } from '@/components/marketing/ConsumerReorderReminders';
import { SocialMediaCalendar } from '@/components/marketing/SocialMediaCalendar';
import { Calendar, Mail, TrendingUp, Users } from 'lucide-react';

const MarketingDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Mock marketing stats
  const marketingStats = {
    activeReminders: 156,
    scheduledPosts: 12,
    campaignROI: 240,
    totalReach: 45200
  };

  return (
    <div className="flex min-h-screen bg-white text-black">
      <DashboardSidebar 
        isCollapsed={sidebarCollapsed} 
        toggleSidebar={toggleSidebar}
      />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-sans text-primary mb-2">Marketing Dashboard</h1>
            <p className="text-gray-600">Manage customer reorder reminders and social media campaigns</p>
          </div>

          {/* Marketing Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <LuxuryCard className="p-6 bg-white border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active Reminders</p>
                  <p className="text-2xl font-bold text-blue-400">{marketingStats.activeReminders}</p>
                </div>
                <Mail className="h-8 w-8 text-blue-400/60" />
              </div>
            </LuxuryCard>

            <LuxuryCard className="p-6 bg-white border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Scheduled Posts</p>
                  <p className="text-2xl font-bold text-green-400">{marketingStats.scheduledPosts}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-400/60" />
              </div>
            </LuxuryCard>

            <LuxuryCard className="p-6 bg-white border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Campaign ROI</p>
                  <p className="text-2xl font-bold text-purple-400">{marketingStats.campaignROI}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-400/60" />
              </div>
            </LuxuryCard>

            <LuxuryCard className="p-6 bg-white border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Reach</p>
                  <p className="text-2xl font-bold text-yellow-400">{marketingStats.totalReach.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-yellow-400/60" />
              </div>
            </LuxuryCard>
          </div>

          {/* Marketing Tools Tabs */}
          <Tabs defaultValue="reorder" className="space-y-6">
            <TabsList className="bg-gray-100 border border-gray-200">
              <TabsTrigger 
                value="reorder" 
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Reorder Reminders
              </TabsTrigger>
              <TabsTrigger 
                value="social"
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Social Media
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reorder">
              <ConsumerReorderReminders />
            </TabsContent>

            <TabsContent value="social">
              <SocialMediaCalendar />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MarketingDashboard;
