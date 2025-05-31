
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { Button } from '@/components/ui/button';
import { b2bKingApi } from '@/services/b2bking';
import { LeadsUploader } from './LeadsUploader';
import { B2BCustomersTable } from './B2BCustomersTable';
import { B2BQuotesTable } from './B2BQuotesTable';
import { LeadsTable } from './LeadsTable';

const B2BDashboard = () => {
  const [activeTab, setActiveTab] = useState<'customers' | 'quotes' | 'leads'>('customers');

  const { data: b2bCustomers, isLoading: customersLoading } = useQuery({
    queryKey: ['b2bCustomers'],
    queryFn: b2bKingApi.getB2BCustomers,
    refetchInterval: 60000,
  });

  const { data: b2bQuotes, isLoading: quotesLoading } = useQuery({
    queryKey: ['b2bQuotes'],
    queryFn: b2bKingApi.getB2BQuotes,
    refetchInterval: 60000,
  });

  const { data: leads, isLoading: leadsLoading, refetch: refetchLeads } = useQuery({
    queryKey: ['leads'],
    queryFn: b2bKingApi.getLeads,
    refetchInterval: 60000,
  });

  const tabs = [
    { id: 'customers' as const, label: 'B2B Customers', count: b2bCustomers?.length || 0 },
    { id: 'quotes' as const, label: 'Quotes', count: b2bQuotes?.length || 0 },
    { id: 'leads' as const, label: 'Leads', count: leads?.length || 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display gold-gradient-text">B2B Management</h1>
          <p className="text-luxury-cream/60 mt-1">Manage your B2B customers, quotes, and leads</p>
        </div>
        
        {activeTab === 'leads' && (
          <LeadsUploader onUploadSuccess={() => refetchLeads()} />
        )}
      </div>

      {/* Tab Navigation */}
      <LuxuryCard className="p-1">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 ${
                activeTab === tab.id 
                  ? 'bg-luxury-gold text-luxury-black' 
                  : 'text-luxury-cream hover:bg-luxury-gold/20'
              }`}
            >
              {tab.label} ({tab.count})
            </Button>
          ))}
        </div>
      </LuxuryCard>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'customers' && (
          <B2BCustomersTable customers={b2bCustomers || []} isLoading={customersLoading} />
        )}
        
        {activeTab === 'quotes' && (
          <B2BQuotesTable quotes={b2bQuotes || []} isLoading={quotesLoading} />
        )}
        
        {activeTab === 'leads' && (
          <LeadsTable leads={leads || []} isLoading={leadsLoading} />
        )}
      </div>
    </div>
  );
};

export default B2BDashboard;
