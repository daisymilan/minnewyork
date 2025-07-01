
export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  customer_email: string;
  customer_name: string;
  created_at: string;
  updated_at: string;
}

export interface SupportResponse {
  success: boolean;
  ticket_id?: string;
  message: string;
  error?: string;
}

export const supportApi = {
  async createTicket(ticketData: {
    subject: string;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    customer_email: string;
    customer_name: string;
  }): Promise<SupportResponse> {
    try {
      console.log('🎫 Triggering support ticket webhook');
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/support/ticket/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...ticketData,
          created_at: new Date().toISOString(),
          status: 'open'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        ticket_id: result.ticket_id || 'TICKET-' + Date.now(),
        message: 'Support ticket created successfully'
      };
    } catch (error) {
      console.error('Error creating support ticket:', error);
      return {
        success: false,
        message: 'Failed to create support ticket',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  async sendChatMessage(messageData: {
    message: string;
    customer_email: string;
    customer_name: string;
    session_id?: string;
  }): Promise<SupportResponse> {
    try {
      console.log('💬 Triggering support chat webhook');
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/support/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...messageData,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        message: 'Chat message sent successfully'
      };
    } catch (error) {
      console.error('Error sending chat message:', error);
      return {
        success: false,
        message: 'Failed to send chat message',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};
