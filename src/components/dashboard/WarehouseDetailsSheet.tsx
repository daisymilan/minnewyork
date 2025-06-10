
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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] bg-luxury-black border-luxury-gold/20">
        <SheetHeader>
          <SheetTitle className="text-luxury-gold font-display">
            {warehouse.name} Details
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-100px)] mt-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <LuxuryCard className="p-4">
              <h3 className="text-lg font-display text-luxury-gold mb-4">Basic Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-luxury-cream/60">Location:</span>
                  <span className="text-luxury-cream">{warehouse.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury-cream/60">Type:</span>
                  <Badge className={getWarehouseTypeColor(warehouse.warehouse_type)}>
                    {getWarehouseTypeLabel(warehouse.warehouse_type)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury-cream/60">Status:</span>
                  <Badge className={getStatusColor(warehouse.status)}>
                    {warehouse.status.charAt(0).toUpperCase() + warehouse.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury-cream/60">
                    {warehouse.warehouse_type === 'manufacturing' ? 'Components:' : 'Total Items:'}
                  </span>
                  <span className="text-luxury-cream">{warehouse.total_items.toLocaleString()}</span>
                </div>
                {warehouse.inventory_value && (
                  <div className="flex justify-between">
                    <span className="text-luxury-cream/60">Inventory Value:</span>
                    <span className="text-luxury-gold">${warehouse.inventory_value.toLocaleString()}</span>
                  </div>
                )}
                {warehouse.low_stock_count !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-luxury-cream/60">
                      {warehouse.warehouse_type === 'manufacturing' ? 'Low Component Stock:' : 'Low Stock Items:'}
                    </span>
                    <span className="text-red-400">{warehouse.low_stock_count}</span>
                  </div>
                )}
                {warehouse.last_updated && (
                  <div className="flex justify-between">
                    <span className="text-luxury-cream/60">Last Updated:</span>
                    <span className="text-luxury-cream/60 text-sm">
                      {new Date(warehouse.last_updated).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </LuxuryCard>

            {/* Manufacturing specific information */}
            {warehouse.warehouse_type === 'manufacturing' && (
              <LuxuryCard className="p-4">
                <h3 className="text-lg font-display text-luxury-gold mb-4">Manufacturing Operations</h3>
                <div className="space-y-3 text-sm text-luxury-cream/70">
                  <div className="flex items-start gap-2">
                    <span className="text-luxury-gold">•</span>
                    <span>Receives components from DSL Europe for processing</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-luxury-gold">•</span>
                    <span>Manufactures finished goods from raw components</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-luxury-gold">•</span>
                    <span>Ships completed products back to DSL for distribution</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-luxury-gold">•</span>
                    <span>Maintains inventory of manufacturing components</span>
                  </div>
                </div>
              </LuxuryCard>
            )}

            {/* Categories */}
            {warehouse.categories && warehouse.categories.length > 0 && (
              <LuxuryCard className="p-4">
                <h3 className="text-lg font-display text-luxury-gold mb-4">
                  {warehouse.warehouse_type === 'manufacturing' ? 'Component Categories' : 'Product Categories'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {warehouse.categories.map((category, index) => (
                    <Badge key={index} variant="outline" className="text-luxury-cream/70">
                      {category}
                    </Badge>
                  ))}
                </div>
              </LuxuryCard>
            )}

            {/* Performance Metrics */}
            <LuxuryCard className="p-4">
              <h3 className="text-lg font-display text-luxury-gold mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-luxury-black/30 rounded-lg">
                  <div className="text-xl font-bold text-luxury-gold">
                    {warehouse.warehouse_type === 'manufacturing' 
                      ? Math.round(Math.max(0, (warehouse.total_items - (warehouse.low_stock_count || 0)) / Math.max(1, warehouse.total_items) * 100))
                      : Math.round((warehouse.total_items - (warehouse.low_stock_count || 0)) / warehouse.total_items * 100)
                    }%
                  </div>
                  <div className="text-sm text-luxury-cream/60">
                    {warehouse.warehouse_type === 'manufacturing' ? 'Component Health' : 'Stock Health'}
                  </div>
                </div>
                <div className="text-center p-3 bg-luxury-black/30 rounded-lg">
                  <div className="text-xl font-bold text-luxury-gold">
                    {warehouse.inventory_value && warehouse.total_items > 0 
                      ? Math.round(warehouse.inventory_value / warehouse.total_items) 
                      : 'N/A'
                    }
                  </div>
                  <div className="text-sm text-luxury-cream/60">
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
