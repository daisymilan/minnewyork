
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface WarehouseDetailsProps {
  warehouse: {
    name: string;
    location: string;
    status: string;
    total_items: number;
    inventory_value?: number;
    low_stock_count?: number;
    categories?: string[];
    last_updated?: string;
    warehouse_type?: 'fulfillment' | 'manufacturing';
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const WarehouseDetailsSheet = ({ warehouse, isOpen, onClose }: WarehouseDetailsProps) => {
  if (!warehouse) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'optimal': return 'bg-green-500/10 text-green-500';
      case 'low': return 'bg-red-500/10 text-red-500';
      case 'medium': return 'bg-amber-500/10 text-amber-500';
      case 'active': return 'bg-green-500/10 text-green-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getWarehouseTypeColor = (type?: string) => {
    switch (type) {
      case 'manufacturing': return 'bg-purple-500/10 text-purple-500';
      case 'fulfillment': return 'bg-blue-500/10 text-blue-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getWarehouseTypeLabel = (type?: string) => {
    switch (type) {
      case 'manufacturing': return 'Manufacturing';
      case 'fulfillment': return 'Fulfillment';
      default: return 'Warehouse';
    }
  };

  // Helper function to safely format numbers
  const formatNumber = (value?: number): string => {
    return typeof value === 'number' ? value.toLocaleString() : '0';
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] bg-white border-gray-200">
        <SheetHeader>
          <SheetTitle className="text-primary font-sans">
            {warehouse.name} Details
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-100px)] mt-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <LuxuryCard className="p-4 bg-white border border-gray-200">
              <h3 className="text-lg font-sans text-primary mb-4">Basic Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="text-black">{warehouse.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <Badge className={getWarehouseTypeColor(warehouse.warehouse_type)}>
                    {getWarehouseTypeLabel(warehouse.warehouse_type)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge className={getStatusColor(warehouse.status)}>
                    {warehouse.status.charAt(0).toUpperCase() + warehouse.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {warehouse.warehouse_type === 'manufacturing' ? 'Components:' : 'Total Items:'}
                  </span>
                  <span className="text-black">{formatNumber(warehouse.total_items)}</span>
                </div>
                {warehouse.inventory_value && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Inventory Value:</span>
                    <span className="text-primary">${formatNumber(warehouse.inventory_value)}</span>
                  </div>
                )}
                {warehouse.low_stock_count !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {warehouse.warehouse_type === 'manufacturing' ? 'Low Component Stock:' : 'Low Stock Items:'}
                    </span>
                    <span className="text-red-400">{formatNumber(warehouse.low_stock_count)}</span>
                  </div>
                )}
                {warehouse.last_updated && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="text-gray-600 text-sm">
                      {new Date(warehouse.last_updated).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </LuxuryCard>

            {/* Manufacturing specific information */}
            {warehouse.warehouse_type === 'manufacturing' && (
              <LuxuryCard className="p-4 bg-white border border-gray-200">
                <h3 className="text-lg font-sans text-primary mb-4">Manufacturing Operations</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Receives components from DSL Europe for processing</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Manufactures finished goods from raw components</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Ships completed products back to DSL for distribution</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Maintains inventory of manufacturing components</span>
                  </div>
                </div>
              </LuxuryCard>
            )}

            {/* Categories */}
            {warehouse.categories && warehouse.categories.length > 0 && (
              <LuxuryCard className="p-4 bg-white border border-gray-200">
                <h3 className="text-lg font-sans text-primary mb-4">
                  {warehouse.warehouse_type === 'manufacturing' ? 'Component Categories' : 'Product Categories'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {warehouse.categories.map((category, index) => (
                    <Badge key={index} variant="outline" className="text-gray-600">
                      {category}
                    </Badge>
                  ))}
                </div>
              </LuxuryCard>
            )}

            {/* Performance Metrics */}
            <LuxuryCard className="p-4 bg-white border border-gray-200">
              <h3 className="text-lg font-sans text-primary mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-primary">
                    {warehouse.warehouse_type === 'manufacturing' 
                      ? Math.round(Math.max(0, ((warehouse.total_items || 0) - (warehouse.low_stock_count || 0)) / Math.max(1, warehouse.total_items || 1) * 100))
                      : Math.round(((warehouse.total_items || 0) - (warehouse.low_stock_count || 0)) / Math.max(1, warehouse.total_items || 1) * 100)
                    }%
                  </div>
                  <div className="text-sm text-gray-600">
                    {warehouse.warehouse_type === 'manufacturing' ? 'Component Health' : 'Stock Health'}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-primary">
                    {warehouse.inventory_value && (warehouse.total_items || 0) > 0 
                      ? Math.round(warehouse.inventory_value / (warehouse.total_items || 1))
                      : 'N/A'
                    }
                  </div>
                  <div className="text-sm text-gray-600">
                    {warehouse.warehouse_type === 'manufacturing' ? 'Avg. Component Value' : 'Avg. Item Value'}
                  </div>
                </div>
              </div>
            </LuxuryCard>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default WarehouseDetailsSheet;
