
import React from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { DashboardProduct } from '@/services/dashboard';

interface ProductDetailsSheetProps {
  children: React.ReactNode;
  products: DashboardProduct[];
  insights: {
    total_products: number;
    low_stock_alerts: number;
  };
  isLoading: boolean;
}

const ProductDetailsSheet: React.FC<ProductDetailsSheetProps> = ({
  children,
  products,
  insights,
  isLoading
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-500/10 text-green-500';
      case 'inactive': return 'bg-red-500/10 text-red-500';
      case 'draft': return 'bg-gray-500/10 text-gray-500';
      default: return 'bg-blue-500/10 text-blue-500';
    }
  };

  const getStockStatusColor = (stockQuantity: number, stockStatus?: string) => {
    if (stockStatus === 'outofstock') return 'bg-red-500/10 text-red-500';
    if (stockQuantity <= 5) return 'bg-amber-500/10 text-amber-500';
    return 'bg-green-500/10 text-green-500';
  };

  const lowStockProducts = products.filter(p => p.stock_quantity <= 5 || p.stock_status === 'outofstock');
  const outOfStockProducts = products.filter(p => p.stock_quantity === 0 || p.stock_status === 'outofstock');

  console.log('ProductDetailsSheet - Products:', products.length);
  console.log('ProductDetailsSheet - Low stock:', lowStockProducts.length);

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-[90vw] max-w-4xl bg-luxury-black border-luxury-gold/20">
        <SheetHeader>
          <SheetTitle className="text-luxury-gold font-display">Product Details</SheetTitle>
          <SheetDescription className="text-luxury-cream/60">
            Comprehensive overview of your product inventory and status
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          <div className="space-y-6 pr-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <LuxuryCard className="p-4 text-center">
                <div className="text-2xl font-bold text-luxury-gold">{insights.total_products}</div>
                <div className="text-sm text-luxury-cream/60">Total Products</div>
              </LuxuryCard>
              <LuxuryCard className="p-4 text-center">
                <div className="text-2xl font-bold text-red-400">{insights.low_stock_alerts}</div>
                <div className="text-sm text-luxury-cream/60">Low Stock</div>
              </LuxuryCard>
              <LuxuryCard className="p-4 text-center">
                <div className="text-2xl font-bold text-red-500">{outOfStockProducts.length}</div>
                <div className="text-sm text-luxury-cream/60">Out of Stock</div>
              </LuxuryCard>
              <LuxuryCard className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500">
                  {products.filter(p => p.stock_quantity > 5 && p.stock_status !== 'outofstock').length}
                </div>
                <div className="text-sm text-luxury-cream/60">In Stock</div>
              </LuxuryCard>
            </div>

            {/* Low Stock Alerts */}
            {lowStockProducts.length > 0 && (
              <LuxuryCard className="p-6">
                <h3 className="text-lg font-display text-luxury-gold mb-4">⚠️ Low Stock Alerts</h3>
                <ScrollArea className="h-48">
                  <div className="space-y-3 pr-4">
                    {lowStockProducts.map((product) => (
                      <div key={product.id} className="flex justify-between items-center p-3 border border-luxury-gold/10 rounded-md">
                        <div>
                          <h4 className="font-medium text-luxury-cream">{product.name}</h4>
                          <p className="text-sm text-luxury-cream/60">Stock: {product.stock_quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-luxury-gold">${product.price}</p>
                          <Badge className={getStockStatusColor(product.stock_quantity, product.stock_status)}>
                            {product.stock_quantity === 0 || product.stock_status === 'outofstock' ? 'Out of Stock' : 'Low Stock'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </LuxuryCard>
            )}

            {/* All Products */}
            <LuxuryCard className="p-6">
              <h3 className="text-lg font-display text-luxury-gold mb-4">All Products ({products.length})</h3>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border border-luxury-gold/10 rounded-md">
                      <div className="flex-1">
                        <Skeleton className="h-4 w-48 mb-2" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-4 w-16 mb-1" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : products && products.length > 0 ? (
                <ScrollArea className="h-96">
                  <div className="space-y-3 pr-4">
                    {products.map((product) => (
                      <div key={product.id} className="flex justify-between items-center p-3 border border-luxury-gold/10 rounded-md hover:bg-luxury-gold/5 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-medium text-luxury-cream">{product.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-luxury-cream/60">
                            <span>Stock: {product.stock_quantity}</span>
                            <span>Sales: {product.sales_count || 0}</span>
                            {product.sku && <span>SKU: {product.sku}</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-luxury-gold font-medium">${product.price}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge className={getStatusColor(product.status)}>
                              {product.status}
                            </Badge>
                            <Badge className={getStockStatusColor(product.stock_quantity, product.stock_status)}>
                              {product.stock_quantity === 0 || product.stock_status === 'outofstock' ? 'Out' : product.stock_quantity <= 5 ? 'Low' : 'Good'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8 text-luxury-cream/60">
                  No products found
                </div>
              )}
            </LuxuryCard>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ProductDetailsSheet;
