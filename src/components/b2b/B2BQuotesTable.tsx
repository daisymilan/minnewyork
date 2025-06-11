
import React from 'react';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { B2BQuote } from '@/services/b2bking';

interface B2BQuotesTableProps {
  quotes: B2BQuote[];
  isLoading: boolean;
}

export const B2BQuotesTable: React.FC<B2BQuotesTableProps> = ({ quotes, isLoading }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-500/10 text-green-500';
      case 'pending': return 'bg-yellow-500/10 text-yellow-500';
      case 'declined': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <LuxuryCard className="p-6 bg-white border border-gray-200">
        <div className="text-center py-8 text-black">Loading quotes...</div>
      </LuxuryCard>
    );
  }

  return (
    <LuxuryCard className="p-6 bg-white border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-sans text-primary">B2B Quotes</h3>
        <div className="text-sm text-gray-600">
          {quotes.length} total quotes
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200">
              <TableHead className="text-gray-600">Quote ID</TableHead>
              <TableHead className="text-gray-600">Company</TableHead>
              <TableHead className="text-gray-600">Items</TableHead>
              <TableHead className="text-gray-600">Total Amount</TableHead>
              <TableHead className="text-gray-600">Created</TableHead>
              <TableHead className="text-gray-600">Expires</TableHead>
              <TableHead className="text-gray-600">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote) => (
              <TableRow key={quote.id} className="border-gray-100 hover:bg-gray-50">
                <TableCell className="font-medium text-black">#{quote.id}</TableCell>
                <TableCell className="text-black">{quote.company_name}</TableCell>
                <TableCell className="text-black">{quote.items.length} items</TableCell>
                <TableCell className="text-black">${quote.total_amount.toLocaleString()}</TableCell>
                <TableCell className="text-black">{new Date(quote.created_date).toLocaleDateString()}</TableCell>
                <TableCell className="text-black">{new Date(quote.expiry_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(quote.status)}>
                    {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
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
