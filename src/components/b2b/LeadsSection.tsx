
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { LeadCard } from './LeadCard';

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  title: string;
  website?: string;
  location?: string;
  employeeCount?: string;
  priority: 'high' | 'medium' | 'research' | 'low';
  notes?: string;
  phone?: string;
  industry?: string;
}

interface LeadsSectionProps {
  title: string;
  leads: Lead[];
  priority: 'high' | 'medium' | 'research' | 'low';
  isCollapsible: boolean;
}

export const LeadsSection: React.FC<LeadsSectionProps> = ({
  title,
  leads,
  priority,
  isCollapsible
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getSectionIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'research': return '🔍';
      case 'low': return '📋';
      default: return '📊';
    }
  };

  const getSectionColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-orange-200 bg-orange-50';
      case 'research': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-gray-200 bg-gray-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  return (
    <div className={`rounded-lg border-2 overflow-hidden ${getSectionColor(priority)}`}>
      {/* Section Header */}
      <div
        className={`p-4 border-b border-current/10 ${isCollapsible ? 'cursor-pointer' : ''}`}
        onClick={() => isCollapsible && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xl">{getSectionIcon(priority)}</span>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-600">{leads.length} leads</p>
            </div>
          </div>
          
          {isCollapsible && (
            <div className="text-gray-400">
              {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
          )}
        </div>
      </div>

      {/* Section Content */}
      {isExpanded && (
        <div className="p-4">
          {leads.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No leads in this category yet</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {leads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onCall={(lead) => window.open(`tel:${lead.phone}`)}
                  onEmail={(lead) => window.open(`mailto:${lead.email}`)}
                  onEdit={(lead) => console.log('Edit lead:', lead)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
