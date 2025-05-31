
import React from 'react';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { B2BCustomer } from '@/services/b2bking';

interface B2BCustomersTableProps {
  customers: B2BCustomer[];
  isLoading: boolean;
}

export const B2BCustomersTable: React.FC<B2BCustomersTableProps> = ({ customers, isLoading }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/10 text-green-500';
      case 'pending': return 'bg-yellow-500/10 text-yellow-500';
      case 'rejected': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <LuxuryCard className="p-6">
        <div className="text-center py-8">Loading B2B customers...</div>
      </LuxuryCard>
    );
  }

  return (
    <LuxuryCard className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-display text-luxury-gold">B2B Customers</h3>
        <div className="text-sm text-luxury-cream/60">
          {customers.length} total customers
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-luxury-gold/10">
              <TableHead className="text-luxury-cream/60">Company</TableHead>
              <TableHead className="text-luxury-cream/60">Contact</TableHead>
              <TableHead className="text-luxury-cream/60">Email</TableHead>
              <TableHead className="text-luxury-cream/60">Group</TableHead>
              <TableHead className="text-luxury-cream/60">Orders</TableHead>
              <TableHead className="text-luxury-cream/60">Total Spent</TableHead>
              <TableHead className="text-luxury-cream/60">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id} className="border-luxury-gold/5">
                <TableCell className="font-medium">{customer.company_name}</TableCell>
                <TableCell>{customer.contact_name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.customer_group}</TableCell>
                <TableCell>{customer.total_orders}</TableCell>
                <TableCell>${customer.total_spent.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(customer.status)}>
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
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
