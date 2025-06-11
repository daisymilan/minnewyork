
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { b2bKingApi } from '@/services/b2bking';
import { B2BCustomersTable } from '@/components/b2b/B2BCustomersTable';
import { B2BQuotesTable } from '@/components/b2b/B2BQuotesTable';
import { LeadsTable } from '@/components/b2b/LeadsTable';
import { LeadsUploader } from '@/components/b2b/LeadsUploader';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useState } from 'react';
import { Building2, Users, FileText, Target } from 'lucide-react';
import { Lead } from '@/services/leadsApi';

const B2BKingDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [processedLeads, setProcessedLeads] = useState<Lead[]>([]);
  const queryClient = useQueryClient();

  // Fetch B2B data using React Query
  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ['b2b-customers'],
    queryFn: b2bKingApi.getB2BCustomers,
  });

  const { data: quotes = [], isLoading: quotesLoading } = useQuery({
    queryKey: ['b2b-quotes'],
    queryFn: b2bKingApi.getB2BQuotes,
  });

  const { data: b2bLeads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ['b2b-leads'],
    queryFn: b2bKingApi.getLeads,
  });

  // Calculate stats
  const stats = {
    totalCustomers: customers.length,
    approvedCustomers: customers.filter(c => c.status === 'approved').length,
    pendingQuotes: quotes.filter(q => q.status === 'pending').length,
    totalLeads: b2bLeads.length + processedLeads.length,
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleUploadSuccess = () => {
    // Refetch leads data after successful upload
    queryClient.invalidateQueries({ queryKey: ['b2b-leads'] });
  };

  const handleLeadsProcessed = (newLeads: Lead[]) => {
    // Add processed leads to the local state to display immediately
    setProcessedLeads(prev => [...prev, ...newLeads]);
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
            <h1 className="text-3xl font-sans text-primary mb-2">B2B Dashboard</h1>
            <p className="text-gray-600">Manage your B2B customers, quotes, and leads</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <LuxuryCard className="p-6 bg-white border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Customers</p>
                  <p className="text-2xl font-bold text-primary">{stats.totalCustomers}</p>
                </div>
                <Users className="h-8 w-8 text-primary/60" />
              </div>
            </LuxuryCard>

            <LuxuryCard className="p-6 bg-white border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Approved Customers</p>
                  <p className="text-2xl font-bold text-green-500">{stats.approvedCustomers}</p>
                </div>
                <Building2 className="h-8 w-8 text-green-500/60" />
              </div>
            </LuxuryCard>

            <LuxuryCard className="p-6 bg-white border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Pending Quotes</p>
                  <p className="text-2xl font-bold text-yellow-500">{stats.pendingQuotes}</p>
                </div>
                <FileText className="h-8 w-8 text-yellow-500/60" />
              </div>
            </LuxuryCard>

            <LuxuryCard className="p-6 bg-white border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Leads</p>
                  <p className="text-2xl font-bold text-purple-500">{stats.totalLeads}</p>
                </div>
                <Target className="h-8 w-8 text-purple-500/60" />
              </div>
            </LuxuryCard>
          </div>

          {/* Tabs for different sections */}
          <Tabs defaultValue="customers" className="space-y-6">
            <TabsList className="bg-gray-100 border border-gray-200">
              <TabsTrigger 
                value="customers" 
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                B2B Customers
              </TabsTrigger>
              <TabsTrigger 
                value="quotes"
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Quotes
              </TabsTrigger>
              <TabsTrigger 
                value="leads"
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
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
              <div className="space-y-6">
                <LuxuryCard className="p-6 bg-white border border-gray-200">
                  <div className="mb-4">
                    <h3 className="text-lg font-sans text-primary mb-2">Upload Leads</h3>
                    <p className="text-gray-600 text-sm">Upload Excel or CSV files to import new leads through N8N workflow</p>
                  </div>
                  <LeadsUploader 
                    onUploadSuccess={handleUploadSuccess}
                    onLeadsProcessed={handleLeadsProcessed}
                  />
                </LuxuryCard>
                
                <LeadsTable leads={b2bLeads} isLoading={leadsLoading} />

                {/* Show processed leads separately if any */}
                {processedLeads.length > 0 && (
                  <LuxuryCard className="p-6 bg-white border border-gray-200">
                    <div className="mb-4">
                      <h3 className="text-lg font-sans text-primary mb-2">Recently Processed Leads</h3>
                      <p className="text-gray-600 text-sm">{processedLeads.length} leads processed from uploaded files</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {processedLeads.map((lead) => (
                        <div key={lead.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="space-y-2">
                            <div className="font-medium text-black">{lead.name}</div>
                            <div className="text-sm text-gray-600">{lead.company}</div>
                            <div className="text-sm text-gray-600">{lead.email}</div>
                            <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              lead.priority === 'high' ? 'bg-red-500/20 text-red-600' :
                              lead.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-600' :
                              lead.priority === 'research' ? 'bg-blue-500/20 text-blue-600' :
                              'bg-gray-500/20 text-gray-600'
                            }`}>
                              {lead.priority} priority
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </LuxuryCard>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default B2BKingDashboard;
