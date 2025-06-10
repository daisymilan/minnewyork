import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { dashboardApi, DashboardProduct } from '@/services/dashboard';

const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'total';
  
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['dashboardProducts'],
    queryFn: dashboardApi.getProducts,
    refetchInterval: 120000,
  });

  const products = productsData?.products || [];
  
  const getFilteredProducts = () => {
    switch (filter) {
      case 'total':
        return products;
      case 'low_stock':
        return products.filter(p => {
          // Only include products with actual quantity between 1-5
          if (p.stock_quantity !== null && p.stock_quantity !== undefined && p.stock_quantity > 0 && p.stock_quantity <= 5) return true;
          return false;
        });
      case 'out_of_stock':
        return products.filter(p => p.stock_quantity === 0 || p.stock_status === 'outofstock');
      case 'in_stock':
        return products.filter(p => {
          // Include products that are explicitly in stock but don't have quantity specified
          if (p.stock_status === 'instock' && (p.stock_quantity === null || p.stock_quantity === undefined)) return true;
          // Include products with stock quantity > 5 and not out of stock
          if (p.stock_quantity !== null && p.stock_quantity !== undefined && p.stock_quantity > 5 && p.stock_status !== 'outofstock') return true;
          return false;
        });
      default:
        return products;
    }
  };

  const filteredProducts = getFilteredProducts();

  const getFilterTitle = () => {
    switch (filter) {
      case 'total': return 'All Products';
      case 'low_stock': return 'Low Stock Products';
      case 'out_of_stock': return 'Out of Stock Products';
      case 'in_stock': return 'In Stock Products';
      default: return 'Products';
    }
  };

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
    // If stock status is 'instock' but no quantity specified, treat as in stock
    if (stockStatus === 'instock' && (stockQuantity === null || stockQuantity === undefined)) return 'bg-green-500/10 text-green-500';
    if (stockQuantity !== null && stockQuantity !== undefined && stockQuantity <= 5 && stockQuantity > 0) return 'bg-amber-500/10 text-amber-500';
    return 'bg-green-500/10 text-green-500';
  };

  return (
    <div className="min-h-screen bg-luxury-black text-luxury-cream p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/products')}
            className="text-luxury-gold hover:bg-luxury-gold/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
          <div>
            <h1 className="text-3xl font-display text-luxury-gold">{getFilterTitle()}</h1>
            <p className="text-luxury-cream/60">
              {filteredProducts.length} products found - Detailed product information and inventory status
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <LuxuryCard key={i} className="p-6">
                <Skeleton className="h-6 w-full mb-3" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-4 w-20 mb-2" />
                <div className="flex gap-2 mb-3">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-12" />
                </div>
                <Skeleton className="h-4 w-full" />
              </LuxuryCard>
            ))}
          </div>
        ) : filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
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
                      <p className="text-lg font-medium text-luxury-cream">{product.stock_quantity ?? 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-luxury-cream/60">Sales Count</p>
                      <p className="text-lg font-medium text-luxury-cream">{product.sales_count || 0}</p>
                    </div>
                  </div>

                  {/* Stock Status Alert - Updated logic */}
                  {((product.stock_quantity !== null && product.stock_quantity !== undefined && product.stock_quantity <= 5 && product.stock_quantity > 0) || product.stock_quantity === 0 || product.stock_status === 'outofstock') && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                      <p className="text-red-400 font-medium text-sm">
                        ⚠️ {product.stock_quantity === 0 || product.stock_status === 'outofstock' 
                          ? 'Out of Stock' 
                          : 'Low Stock Alert'}
                      </p>
                      <p className="text-red-400/80 text-xs mt-1">
                        {product.stock_quantity === 0 || product.stock_status === 'outofstock'
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
                        : (product.stock_status === 'instock' && (product.stock_quantity === null || product.stock_quantity === undefined))
                        ? 'In Stock'
                        : product.stock_quantity !== null && product.stock_quantity !== undefined && product.stock_quantity <= 5 && product.stock_quantity > 0
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
    </div>
  );
};

export default ProductDetailsPage;
