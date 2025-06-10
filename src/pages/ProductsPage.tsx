
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dashboardApi, DashboardProduct } from '@/services/dashboard';

const ProductsPage = () => {
  const navigate = useNavigate();
  
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['dashboardProducts'],
    queryFn: dashboardApi.getProducts,
    refetchInterval: 120000, // Refetch every 2 minutes
  });

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

  const products = productsData?.products || [];
  const insights = productsData?.insights || { total_products: 0, low_stock_alerts: 0 };
  
  const lowStockProducts = products.filter(p => p.stock_quantity <= 5 || p.stock_status === 'outofstock');
  const outOfStockProducts = products.filter(p => p.stock_quantity === 0 || p.stock_status === 'outofstock');
  const inStockProducts = products.filter(p => p.stock_quantity > 5 && p.stock_status !== 'outofstock');

  const handleStatClick = (filterType: string) => {
    console.log('Stat clicked:', filterType);
    navigate(`/products/details?filter=${filterType}`);
  };

  return (
    <div className="min-h-screen bg-luxury-black text-luxury-cream p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-luxury-gold hover:bg-luxury-gold/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-display text-luxury-gold">Product Management</h1>
            <p className="text-luxury-cream/60">Comprehensive overview of your product inventory and status</p>
          </div>
        </div>

        {/* Summary Stats - Now Clickable */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <LuxuryCard 
            className="p-6 text-center cursor-pointer hover:bg-luxury-gold/5 transition-colors"
            onClick={() => handleStatClick('total')}
          >
            <div className="text-3xl font-bold text-luxury-gold">{insights.total_products}</div>
            <div className="text-sm text-luxury-cream/60">Total Products</div>
          </LuxuryCard>
          <LuxuryCard 
            className="p-6 text-center cursor-pointer hover:bg-luxury-gold/5 transition-colors"
            onClick={() => handleStatClick('low_stock')}
          >
            <div className="text-3xl font-bold text-red-400">{insights.low_stock_alerts}</div>
            <div className="text-sm text-luxury-cream/60">Low Stock</div>
          </LuxuryCard>
          <LuxuryCard 
            className="p-6 text-center cursor-pointer hover:bg-luxury-gold/5 transition-colors"
            onClick={() => handleStatClick('out_of_stock')}
          >
            <div className="text-3xl font-bold text-red-500">{outOfStockProducts.length}</div>
            <div className="text-sm text-luxury-cream/60">Out of Stock</div>
          </LuxuryCard>
          <LuxuryCard 
            className="p-6 text-center cursor-pointer hover:bg-luxury-gold/5 transition-colors"
            onClick={() => handleStatClick('in_stock')}
          >
            <div className="text-3xl font-bold text-green-500">
              {inStockProducts.length}
            </div>
            <div className="text-sm text-luxury-cream/60">In Stock</div>
          </LuxuryCard>
        </div>

        {/* Low Stock Alerts */}
        {lowStockProducts.length > 0 && (
          <LuxuryCard className="p-6 mb-8">
            <h2 className="text-xl font-display text-luxury-gold mb-6">⚠️ Low Stock Alerts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="p-4 border border-luxury-gold/10 rounded-lg hover:bg-luxury-gold/5 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-luxury-cream">{product.name}</h3>
                    <Badge className={getStockStatusColor(product.stock_quantity, product.stock_status)}>
                      {product.stock_quantity === 0 || product.stock_status === 'outofstock' ? 'Out of Stock' : 'Low Stock'}
                    </Badge>
                  </div>
                  <div className="text-sm text-luxury-cream/60 space-y-1">
                    <p>Stock: {product.stock_quantity}</p>
                    <p className="text-luxury-gold">${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </LuxuryCard>
        )}

        {/* All Products */}
        <LuxuryCard className="p-6">
          <h2 className="text-xl font-display text-luxury-gold mb-6">All Products ({products.length})</h2>
          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="p-4 border border-luxury-gold/10 rounded-lg">
                  <Skeleton className="h-5 w-full mb-3" />
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-4 w-16 mb-2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="p-4 border border-luxury-gold/10 rounded-lg hover:bg-luxury-gold/5 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-luxury-cream">{product.name}</h3>
                    <p className="text-luxury-gold font-medium">${product.price}</p>
                  </div>
                  
                  <div className="text-sm text-luxury-cream/60 space-y-1 mb-3">
                    <div className="flex justify-between">
                      <span>Stock:</span>
                      <span>{product.stock_quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sales:</span>
                      <span>{product.sales_count || 0}</span>
                    </div>
                    {product.sku && (
                      <div className="flex justify-between">
                        <span>SKU:</span>
                        <span>{product.sku}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(product.status)}>
                      {product.status}
                    </Badge>
                    <Badge className={getStockStatusColor(product.stock_quantity, product.stock_status)}>
                      {product.stock_quantity === 0 || product.stock_status === 'outofstock' ? 'Out' : product.stock_quantity <= 5 ? 'Low' : 'Good'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-luxury-cream/60">
              <p className="text-lg">No products found</p>
            </div>
          )}
        </LuxuryCard>
      </div>
    </div>
  );
};

export default ProductsPage;
