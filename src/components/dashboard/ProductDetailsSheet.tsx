
import React from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle
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
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
}

const ProductDetailsSheet: React.FC<ProductDetailsSheetProps> = ({
  children,
  products,
  insights,
  isLoading,
  open,
  onOpenChange,
  title = "Product Details"
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

  console.log('ProductDetailsSheet - Products:', products.length);
  console.log('ProductDetailsSheet - Title:', title);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[90vw] max-w-6xl bg-luxury-black border-luxury-gold/20">
        <SheetHeader>
          <SheetTitle className="text-luxury-gold font-display text-2xl">{title}</SheetTitle>
          <SheetDescription className="text-luxury-cream/60">
            {products.length} products found - Detailed product information and inventory status
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          <div className="space-y-6 pr-4">
            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="p-6 border border-luxury-gold/10 rounded-lg">
                    <Skeleton className="h-6 w-full mb-3" />
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-4 w-20 mb-2" />
                    <div className="flex gap-2 mb-3">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-12" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <LuxuryCard key={product.id} className="p-6 hover:bg-luxury-gold/5 transition-colors">
                    <div className="space-y-4">
                      {/* Product Header */}
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-luxury-cream mb-1">{product.name}</h3>
                          {product.sku && (
                            <p className="text-sm text-luxury-cream/60">SKU: {product.sku}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-luxury-gold">${product.price}</p>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-luxury-cream/60">Stock Quantity</p>
                          <p className="text-lg font-medium text-luxury-cream">{product.stock_quantity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-luxury-cream/60">Sales Count</p>
                          <p className="text-lg font-medium text-luxury-cream">{product.sales_count || 0}</p>
                        </div>
                      </div>

                      {/* Stock Status Alert */}
                      {(product.stock_quantity <= 5 || product.stock_status === 'outofstock') && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                          <p className="text-red-400 font-medium text-sm">
                            ⚠️ {product.stock_quantity === 0 || product.stock_status === 'outofstock' 
                              ? 'Out of Stock' 
                              : 'Low Stock Alert'}
                          </p>
                          <p className="text-red-400/80 text-xs mt-1">
                            {product.stock_quantity === 0 
                              ? 'This product is currently unavailable'
                              : 'Stock level is running low - consider restocking'
                            }
                          </p>
                        </div>
                      )}

                      {/* Status Badges */}
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(product.status)}>
                          {product.status}
                        </Badge>
                        <Badge className={getStockStatusColor(product.stock_quantity, product.stock_status)}>
                          {product.stock_quantity === 0 || product.stock_status === 'outofstock' 
                            ? 'Out of Stock' 
                            : product.stock_quantity <= 5 
                            ? 'Low Stock' 
                            : 'In Stock'
                          }
                        </Badge>
                      </div>

                      {/* Additional Info */}
                      <div className="pt-2 border-t border-luxury-gold/10">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-luxury-cream/60">Stock Status: </span>
                            <span className="text-luxury-cream">{product.stock_status}</span>
                          </div>
                          <div>
                            <span className="text-luxury-cream/60">Product ID: </span>
                            <span className="text-luxury-cream">{product.id}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </LuxuryCard>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-luxury-cream/60">
                  <p className="text-lg mb-2">No products found</p>
                  <p className="text-sm">Try adjusting your filter criteria</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ProductDetailsSheet;
