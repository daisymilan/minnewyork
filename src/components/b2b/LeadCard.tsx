
import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Edit, Building, MapPin, Users } from 'lucide-react';

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

interface LeadCardProps {
  lead: Lead;
  onCall?: (lead: Lead) => void;
  onEmail?: (lead: Lead) => void;
  onEdit?: (lead: Lead) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onCall,
  onEmail,
  onEdit
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-orange-200 bg-orange-50';
      case 'research': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-gray-200 bg-gray-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-orange-100 text-orange-800',
      research: 'bg-yellow-100 text-yellow-800',
      low: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[priority as keyof typeof colors]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  return (
    <div className={`rounded-lg border-2 p-4 transition-shadow hover:shadow-md ${getPriorityColor(lead.priority)}`}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-900">{lead.name}</h3>
            <p className="text-sm text-gray-600">{lead.title}</p>
          </div>
          {getPriorityBadge(lead.priority)}
        </div>

        {/* Company Info */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <Building className="h-4 w-4" />
            <span>{lead.company}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <Mail className="h-4 w-4" />
            <span className="truncate">{lead.email}</span>
          </div>

          {lead.website && (
            <div className="text-sm text-blue-600">
              🌐 {lead.website}
            </div>
          )}

          {lead.location && (
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <MapPin className="h-4 w-4" />
              <span>{lead.location}</span>
            </div>
          )}

          {lead.employeeCount && (
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <Users className="h-4 w-4" />
              <span>{lead.employeeCount} employees</span>
            </div>
          )}
        </div>

        {/* Notes */}
        {lead.notes && (
          <div className="text-xs text-gray-600 bg-white/50 p-2 rounded">
            {lead.notes}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          {lead.phone && onCall && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCall(lead)}
              className="flex-1"
            >
              <Phone className="h-3 w-3 mr-1" />
              Call
            </Button>
          )}
          
          {onEmail && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEmail(lead)}
              className="flex-1"
            >
              <Mail className="h-3 w-3 mr-1" />
              Email
            </Button>
          )}
          
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(lead)}
              className="flex-1"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
