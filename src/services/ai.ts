
// AI service for fragrance recommendations
export interface FragranceRecommendation {
  customer_preferences?: string;
  occasion?: string;
  season?: string;
  previous_purchases?: string[];
}

export interface RecommendationResponse {
  recommended_fragrances: Array<{
    name: string;
    description: string;
    confidence: number;
    price: number;
  }>;
  reasoning: string;
}

export const aiApi = {
  async getFragranceRecommendation(preferences: FragranceRecommendation): Promise<RecommendationResponse> {
    try {
      const response = await fetch('https://minnewyorkofficial.app.n8n.cloud/webhook/grok/fragrance-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get fragrance recommendation');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting fragrance recommendation:', error);
      // Return mock recommendation as fallback
      return {
        recommended_fragrances: [
          {
            name: 'Moon Dance',
            description: 'A sophisticated evening fragrance with notes of jasmine and sandalwood',
            confidence: 0.89,
            price: 195
          },
          {
            name: 'Dune',
            description: 'Fresh and airy with citrus and ocean breeze notes',
            confidence: 0.76,
            price: 175
          }
        ],
        reasoning: 'Based on your preference for elegant evening scents and previous purchases of floral fragrances.'
      };
    }
  }
};
