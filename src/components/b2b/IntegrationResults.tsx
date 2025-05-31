
import React from 'react';
import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface IntegrationResult {
  hubspot_contacts_created?: number;
  klaviyo_contacts_added?: number;
  woocommerce_customers_created?: number;
  duplicates_removed?: number;
  invalid_emails?: number;
}

interface IntegrationResultsProps {
  results: IntegrationResult;
  totalProcessed: number;
}

export const IntegrationResults: React.FC<IntegrationResultsProps> = ({
  results,
  totalProcessed
}) => {
  const integrationItems = [
    {
      icon: '🏢',
      label: 'HubSpot Contacts',
      value: results.hubspot_contacts_created || 0,
      color: 'text-blue-600'
    },
    {
      icon: '📧',
      label: 'Klaviyo Lists',
      value: results.klaviyo_contacts_added || 0,
      color: 'text-purple-600'
    },
    {
      icon: '🛒',
      label: 'WooCommerce Customers',
      value: results.woocommerce_customers_created || 0,
      color: 'text-green-600'
    },
    {
      icon: '🔄',
      label: 'Duplicates Removed',
      value: results.duplicates_removed || 0,
      color: 'text-orange-600'
    }
  ];

  if (totalProcessed === 0) return null;

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center space-x-2 mb-4">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">Integration Results</h3>
      </div>

      {/* Summary Card */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-800">{totalProcessed}</div>
          <div className="text-sm text-green-600">Total Leads Processed</div>
        </div>
      </div>

      {/* Integration Details */}
      <div className="grid grid-cols-2 gap-4">
        {integrationItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <span className="text-xl">{item.icon}</span>
            <div>
              <div className={`text-lg font-semibold ${item.color}`}>
                {item.value}
              </div>
              <div className="text-xs text-gray-600">
                {item.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Error Information */}
      {results.invalid_emails && results.invalid_emails > 0 && (
        <div className="mt-4 flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">
            {results.invalid_emails} leads had invalid email addresses
          </span>
        </div>
      )}
    </div>
  );
};
