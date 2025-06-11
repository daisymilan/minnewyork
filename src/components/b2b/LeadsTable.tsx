
import React from 'react';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { B2BLead } from '@/services/b2bking';

interface LeadsTableProps {
  leads: B2BLead[];
  isLoading: boolean;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({ leads, isLoading }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'converted': return 'bg-green-500/10 text-green-500';
      case 'qualified': return 'bg-blue-500/10 text-blue-500';
      case 'contacted': return 'bg-yellow-500/10 text-yellow-500';
      case 'new': return 'bg-purple-500/10 text-purple-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <LuxuryCard className="p-6 bg-white border border-gray-200">
        <div className="text-center py-8 text-black">Loading leads...</div>
      </LuxuryCard>
    );
  }

  return (
    <LuxuryCard className="p-6 bg-white border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-sans text-primary">Leads</h3>
        <div className="text-sm text-gray-600">
          {leads.length} total leads
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200">
              <TableHead className="text-gray-600">Company</TableHead>
              <TableHead className="text-gray-600">Contact</TableHead>
              <TableHead className="text-gray-600">Email</TableHead>
              <TableHead className="text-gray-600">Phone</TableHead>
              <TableHead className="text-gray-600">Industry</TableHead>
              <TableHead className="text-gray-600">Source</TableHead>
              <TableHead className="text-gray-600">Date</TableHead>
              <TableHead className="text-gray-600">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id} className="border-gray-100 hover:bg-gray-50">
                <TableCell className="font-medium text-black">{lead.company_name}</TableCell>
                <TableCell className="text-black">{lead.contact_name}</TableCell>
                <TableCell className="text-black">{lead.email}</TableCell>
                <TableCell className="text-black">{lead.phone}</TableCell>
                <TableCell className="text-black">{lead.industry}</TableCell>
                <TableCell className="text-black">{lead.source}</TableCell>
                <TableCell className="text-black">{new Date(lead.created_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </LuxuryCard>
  );
};
