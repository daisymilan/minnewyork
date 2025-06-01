
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { b2bKingApi } from '@/services/b2bking';
import { B2BCustomersTable } from '@/components/b2b/B2BCustomersTable';
import { B2BQuotesTable } from '@/components/b2b/B2BQuotesTable';
import { LeadsTable } from '@/components/b2b/LeadsTable';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useState } from 'react';
import { Building2, Users, FileText, Target } from 'lucide-react';

const B2BKingDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Fetch B2B data using React Query
  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ['b2b-customers'],
    queryFn: b2bKingApi.getB2BCustomers,
  });

  const { data: quotes = [], isLoading: quotesLoading } = useQuery({
    queryKey: ['b2b-quotes'],
    queryFn: b2bKingApi.getB2BQuotes,
  });

  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ['b2b-leads'],
    queryFn: b2bKingApi.getLeads,
  });

  // Calculate stats
  const stats = {
    totalCustomers: customers.length,
    approvedCustomers: customers.filter(c => c.status === 'approved').length,
    pendingQuotes: quotes.filter(q => q.status === 'pending').length,
    newLeads: leads.filter(l => l.status === 'new').length,
  };

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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-display text-luxury-gold mb-2">B2BKing Dashboard</h1>
            <p className="text-luxury-cream/60">Manage your B2B customers, quotes, and leads</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <LuxuryCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-luxury-cream/60 text-sm">Total Customers</p>
                  <p className="text-2xl font-bold text-luxury-gold">{stats.totalCustomers}</p>
                </div>
                <Users className="h-8 w-8 text-luxury-gold/60" />
              </div>
            </LuxuryCard>

            <LuxuryCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-luxury-cream/60 text-sm">Approved Customers</p>
                  <p className="text-2xl font-bold text-green-500">{stats.approvedCustomers}</p>
                </div>
                <Building2 className="h-8 w-8 text-green-500/60" />
              </div>
            </LuxuryCard>

            <LuxuryCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-luxury-cream/60 text-sm">Pending Quotes</p>
                  <p className="text-2xl font-bold text-yellow-500">{stats.pendingQuotes}</p>
                </div>
                <FileText className="h-8 w-8 text-yellow-500/60" />
              </div>
            </LuxuryCard>

            <LuxuryCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-luxury-cream/60 text-sm">New Leads</p>
                  <p className="text-2xl font-bold text-purple-500">{stats.newLeads}</p>
                </div>
                <Target className="h-8 w-8 text-purple-500/60" />
              </div>
            </LuxuryCard>
          </div>

          {/* Tabs for different sections */}
          <Tabs defaultValue="customers" className="space-y-6">
            <TabsList className="bg-luxury-black/50 border border-luxury-gold/20">
              <TabsTrigger 
                value="customers" 
                className="data-[state=active]:bg-luxury-gold data-[state=active]:text-luxury-black"
              >
                B2B Customers
              </TabsTrigger>
              <TabsTrigger 
                value="quotes"
                className="data-[state=active]:bg-luxury-gold data-[state=active]:text-luxury-black"
              >
                Quotes
              </TabsTrigger>
              <TabsTrigger 
                value="leads"
                className="data-[state=active]:bg-luxury-gold data-[state=active]:text-luxury-black"
              >
                Leads
              </TabsTrigger>
            </TabsList>

            <TabsContent value="customers" className="space-y-4">
              <B2BCustomersTable customers={customers} isLoading={customersLoading} />
            </TabsContent>

            <TabsContent value="quotes" className="space-y-4">
              <B2BQuotesTable quotes={quotes} isLoading={quotesLoading} />
            </TabsContent>

            <TabsContent value="leads" className="space-y-4">
              <LeadsTable leads={leads} isLoading={leadsLoading} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default B2BKingDashboard;
