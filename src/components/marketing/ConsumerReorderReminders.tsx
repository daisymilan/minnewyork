
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { Button } from '@/components/ui/button';
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
      case 'high': return 'text-green-500 bg-green-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/20';
      case 'low': return 'text-red-500 bg-red-500/20';
      default: return 'text-gray-500 bg-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <LuxuryCard className="p-4 bg-white border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Due for Reorder</p>
              <p className="text-2xl font-bold text-primary">{mockCustomers.length}</p>
            </div>
            <Clock className="h-6 w-6 text-primary/60" />
          </div>
        </LuxuryCard>

        <LuxuryCard className="p-4 bg-white border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">High Likelihood</p>
              <p className="text-2xl font-bold text-green-500">{getCustomersByLikelihood('high').length}</p>
            </div>
            <Target className="h-6 w-6 text-green-500/60" />
          </div>
        </LuxuryCard>

        <LuxuryCard className="p-4 bg-white border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Campaigns</p>
              <p className="text-2xl font-bold text-blue-500">{mockCampaigns.filter(c => c.status === 'active').length}</p>
            </div>
            <Mail className="h-6 w-6 text-blue-500/60" />
          </div>
        </LuxuryCard>

        <LuxuryCard className="p-4 bg-white border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avg Conversion</p>
              <p className="text-2xl font-bold text-purple-500">10.4%</p>
            </div>
            <Users className="h-6 w-6 text-purple-500/60" />
          </div>
        </LuxuryCard>
      </div>

      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList className="bg-gray-100 border border-gray-200">
          <TabsTrigger value="customers" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Ready to Reorder
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          <LuxuryCard className="p-6 bg-white border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-sans text-primary">Customers Ready for Reorder</h3>
              <Button 
                onClick={() => handleSendReminders(mockCustomers.map(c => c.id))}
                disabled={sendReminderMutation.isPending}
                className="flex items-center space-x-2 bg-primary text-white hover:bg-primary/80"
              >
                <Send className="h-4 w-4" />
                <span>Send All Reminders</span>
              </Button>
            </div>

            <div className="space-y-3">
              {mockCustomers.map((customer) => (
                <div key={customer.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-black">{customer.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLikelihoodColor(customer.reorder_likelihood)}`}>
                          {customer.reorder_likelihood} likelihood
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{customer.email}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Last order: {customer.days_since_order} days ago</span>
                        <span>Value: ${customer.last_order_value}</span>
                        <span>Category: {customer.product_category}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleSendReminders([customer.id])}
                      disabled={sendReminderMutation.isPending}
                      className="bg-primary text-white hover:bg-primary/80"
                    >
                      Send Reminder
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </LuxuryCard>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <LuxuryCard className="p-6 bg-white border border-gray-200">
            <h3 className="text-lg font-sans text-primary mb-4">Active Campaigns</h3>
            
            <div className="space-y-4">
              {mockCampaigns.map((campaign) => (
                <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h4 className="font-medium text-black">{campaign.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Triggers after {campaign.trigger_days} days</span>
                        <span>Type: {campaign.template_type}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          campaign.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'
                        }`}>
                          {campaign.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-600">Targeted: {campaign.customers_targeted}</span>
                        <span className="text-green-500">Conversion: {campaign.conversion_rate}%</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit Campaign
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </LuxuryCard>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <LuxuryCard className="p-6 bg-white border border-gray-200">
            <h3 className="text-lg font-sans text-primary mb-4">Campaign Performance</h3>
            <div className="text-center py-8 text-gray-600">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-primary/40" />
              <p>Analytics dashboard coming soon...</p>
              <p className="text-sm mt-2">Track conversion rates, revenue impact, and campaign effectiveness</p>
            </div>
          </LuxuryCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};
