
// B2BKing API service for B2B customer management
export interface B2BCustomer {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  customer_group: string;
  registration_date: string;
  total_orders: number;
  total_spent: number;
}

export interface B2BQuote {
  id: string;
  customer_id: string;
  company_name: string;
  items: Array<{
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
  }>;
  total_amount: number;
  status: 'pending' | 'accepted' | 'declined';
  created_date: string;
  expiry_date: string;
}

export interface B2BLead {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  industry: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  created_date: string;
}

export const b2bKingApi = {
  async getB2BCustomers(): Promise<B2BCustomer[]> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/b2bking/customers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch B2B customers');
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching B2B customers:', error);
      // Return mock data as fallback
      return [
        {
          id: 'B2B-001',
          company_name: 'Luxury Boutique Chain',
          contact_name: 'Alexandra Smith',
          email: 'alex@luxuryboutique.com',
          phone: '+1-555-0123',
          status: 'approved',
          customer_group: 'Wholesale',
          registration_date: new Date().toISOString(),
          total_orders: 24,
          total_spent: 45000
        },
        {
          id: 'B2B-002',
          company_name: 'Elite Fragrance Stores',
          contact_name: 'Marcus Johnson',
          email: 'marcus@elitefragrance.com',
          phone: '+1-555-0124',
          status: 'pending',
          customer_group: 'Distributor',
          registration_date: new Date().toISOString(),
          total_orders: 0,
          total_spent: 0
        }
      ];
    }
  },

  async getB2BQuotes(): Promise<B2BQuote[]> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/b2bking/quotes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch B2B quotes');
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching B2B quotes:', error);
      return [];
    }
  },

  async uploadLeads(file: File): Promise<{ success: boolean; message: string; leads_imported?: number }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/b2bking/upload-leads', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload leads');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error uploading leads:', error);
      return {
        success: false,
        message: 'Failed to upload leads file'
      };
    }
  },

  async getLeads(): Promise<B2BLead[]> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/b2bking/leads', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
  }
};
