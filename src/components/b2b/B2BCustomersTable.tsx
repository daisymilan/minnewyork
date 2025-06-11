
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
      <LuxuryCard className="p-6 bg-white border border-gray-200">
        <div className="text-center py-8 text-black">Loading B2B customers...</div>
      </LuxuryCard>
    );
  }

  return (
    <LuxuryCard className="p-6 bg-white border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-sans text-primary">B2B Customers</h3>
        <div className="text-sm text-gray-600">
          {customers.length} total customers
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200">
              <TableHead className="text-gray-600">Company</TableHead>
              <TableHead className="text-gray-600">Contact</TableHead>
              <TableHead className="text-gray-600">Email</TableHead>
              <TableHead className="text-gray-600">Group</TableHead>
              <TableHead className="text-gray-600">Orders</TableHead>
              <TableHead className="text-gray-600">Total Spent</TableHead>
              <TableHead className="text-gray-600">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id} className="border-gray-100 hover:bg-gray-50">
                <TableCell className="font-medium text-black">{customer.company_name}</TableCell>
                <TableCell className="text-black">{customer.contact_name}</TableCell>
                <TableCell className="text-black">{customer.email}</TableCell>
                <TableCell className="text-black">{customer.customer_group}</TableCell>
                <TableCell className="text-black">{customer.total_orders}</TableCell>
                <TableCell className="text-black">${customer.total_spent.toLocaleString()}</TableCell>
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
