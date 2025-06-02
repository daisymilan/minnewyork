
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import { Clock, Mail, MessageSquare, Users, Target, Calendar, Send } from 'lucide-react';
import { marketingApi } from '@/services/marketing';

interface Customer {
  id: string;
  email: string;
  name: string;
  last_order_date: string;
  last_order_value: number;
  product_category: string;
  days_since_order: number;
  reorder_likelihood: 'high' | 'medium' | 'low';
}

interface ReorderCampaign {
  id: string;
  name: string;
  trigger_days: number;
  template_type: 'email' | 'sms' | 'both';
  status: 'active' | 'paused' | 'draft';
  customers_targeted: number;
  conversion_rate: number;
}

export const ConsumerReorderReminders = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    trigger_days: 30,
    template_type: 'email' as 'email' | 'sms' | 'both'
  });

  const queryClient = useQueryClient();

  // Mock data - in real implementation, this would come from your API
  const mockCustomers: Customer[] = [
    {
      id: '1',
      email: 'sarah.johnson@email.com',
      name: 'Sarah Johnson',
      last_order_date: '2024-04-15',
      last_order_value: 285,
      product_category: 'Eau de Parfum',
      days_since_order: 45,
      reorder_likelihood: 'high'
    },
    {
      id: '2',
      email: 'michael.chen@email.com',
      name: 'Michael Chen',
      last_order_date: '2024-03-22',
      last_order_value: 150,
      product_category: 'Discovery Set',
      days_since_order: 72,
      reorder_likelihood: 'medium'
    }
  ];

  const mockCampaigns: ReorderCampaign[] = [
    {
      id: '1',
      name: '30-Day Reorder Reminder',
      trigger_days: 30,
      template_type: 'email',
      status: 'active',
      customers_targeted: 156,
      conversion_rate: 12.5
    },
    {
      id: '2',
      name: '60-Day Win-Back Campaign',
      trigger_days: 60,
      template_type: 'both',
      status: 'active',
      customers_targeted: 89,
      conversion_rate: 8.3
    }
  ];

  const sendReminderMutation = useMutation({
    mutationFn: async (customerIds: string[]) => {
      // This would call your N8N workflow
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/marketing/reorder-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_ids: customerIds })
      });
      return response.json();
    },
    onSuccess: () => {
      toast.success('Reorder reminders sent successfully!');
      queryClient.invalidateQueries({ queryKey: ['reorder-customers'] });
    },
    onError: () => {
      toast.error('Failed to send reminders');
    }
  });

  const handleSendReminders = (customerIds: string[]) => {
    sendReminderMutation.mutate(customerIds);
  };

  const getCustomersByLikelihood = (likelihood: string) => {
    return mockCustomers.filter(c => c.reorder_likelihood === likelihood);
  };

  const getLikelihoodColor = (likelihood: string) => {
    switch (likelihood) {
      case 'high': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <LuxuryCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-luxury-cream/60 text-sm">Due for Reorder</p>
              <p className="text-2xl font-bold text-luxury-gold">{mockCustomers.length}</p>
            </div>
            <Clock className="h-6 w-6 text-luxury-gold/60" />
          </div>
        </LuxuryCard>

        <LuxuryCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-luxury-cream/60 text-sm">High Likelihood</p>
              <p className="text-2xl font-bold text-green-400">{getCustomersByLikelihood('high').length}</p>
            </div>
            <Target className="h-6 w-6 text-green-400/60" />
          </div>
        </LuxuryCard>

        <LuxuryCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-luxury-cream/60 text-sm">Active Campaigns</p>
              <p className="text-2xl font-bold text-blue-400">{mockCampaigns.filter(c => c.status === 'active').length}</p>
            </div>
            <Mail className="h-6 w-6 text-blue-400/60" />
          </div>
        </LuxuryCard>

        <LuxuryCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-luxury-cream/60 text-sm">Avg Conversion</p>
              <p className="text-2xl font-bold text-purple-400">10.4%</p>
            </div>
            <Users className="h-6 w-6 text-purple-400/60" />
          </div>
        </LuxuryCard>
      </div>

      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList className="bg-luxury-black/50 border border-luxury-gold/20">
          <TabsTrigger value="customers" className="data-[state=active]:bg-luxury-gold data-[state=active]:text-luxury-black">
            Ready to Reorder
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-luxury-gold data-[state=active]:text-luxury-black">
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-luxury-gold data-[state=active]:text-luxury-black">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          <LuxuryCard className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-display text-luxury-gold">Customers Ready for Reorder</h3>
              <LuxuryButton 
                onClick={() => handleSendReminders(mockCustomers.map(c => c.id))}
                disabled={sendReminderMutation.isPending}
                className="flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Send All Reminders</span>
              </LuxuryButton>
            </div>

            <div className="space-y-3">
              {mockCustomers.map((customer) => (
                <div key={customer.id} className="border border-luxury-gold/20 rounded-lg p-4 hover:border-luxury-gold/40 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-luxury-cream">{customer.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLikelihoodColor(customer.reorder_likelihood)}`}>
                          {customer.reorder_likelihood} likelihood
                        </span>
                      </div>
                      <p className="text-sm text-luxury-cream/60">{customer.email}</p>
                      <div className="flex items-center space-x-4 text-sm text-luxury-cream/60">
                        <span>Last order: {customer.days_since_order} days ago</span>
                        <span>Value: ${customer.last_order_value}</span>
                        <span>Category: {customer.product_category}</span>
                      </div>
                    </div>
                    <LuxuryButton
                      size="sm"
                      onClick={() => handleSendReminders([customer.id])}
                      disabled={sendReminderMutation.isPending}
                    >
                      Send Reminder
                    </LuxuryButton>
                  </div>
                </div>
              ))}
            </div>
          </LuxuryCard>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <LuxuryCard className="p-6">
            <h3 className="text-lg font-display text-luxury-gold mb-4">Active Campaigns</h3>
            
            <div className="space-y-4">
              {mockCampaigns.map((campaign) => (
                <div key={campaign.id} className="border border-luxury-gold/20 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h4 className="font-medium text-luxury-cream">{campaign.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-luxury-cream/60">
                        <span>Triggers after {campaign.trigger_days} days</span>
                        <span>Type: {campaign.template_type}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          campaign.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {campaign.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-luxury-cream/60">Targeted: {campaign.customers_targeted}</span>
                        <span className="text-green-400">Conversion: {campaign.conversion_rate}%</span>
                      </div>
                    </div>
                    <LuxuryButton variant="outline" size="sm">
                      Edit Campaign
                    </LuxuryButton>
                  </div>
                </div>
              ))}
            </div>
          </LuxuryCard>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <LuxuryCard className="p-6">
            <h3 className="text-lg font-display text-luxury-gold mb-4">Campaign Performance</h3>
            <div className="text-center py-8 text-luxury-cream/60">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-luxury-gold/40" />
              <p>Analytics dashboard coming soon...</p>
              <p className="text-sm mt-2">Track conversion rates, revenue impact, and campaign effectiveness</p>
            </div>
          </LuxuryCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};
