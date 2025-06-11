
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dashboardApi } from '@/services/dashboard';

const GlobalProductsPage = () => {
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
    if (stockStatus === 'instock') return 'bg-green-500/10 text-green-500';
    if (stockQuantity !== null && stockQuantity !== undefined && stockQuantity <= 5 && stockQuantity > 0) return 'bg-amber-500/10 text-amber-500';
    return 'bg-green-500/10 text-green-500';
  };

  const products = productsData?.products || [];
  const insights = productsData?.insights || { total_products: 0, low_stock_alerts: 0 };

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-primary hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Global Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-sans text-primary">Global Product Management</h1>
            <p className="text-gray-600">Comprehensive overview of your global product inventory and status</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <LuxuryCard className="p-6 text-center bg-white border border-gray-200">
            <div className="text-3xl font-bold text-primary">{insights.total_products}</div>
            <div className="text-sm text-gray-600">Total Products</div>
          </LuxuryCard>
          <LuxuryCard className="p-6 text-center bg-white border border-gray-200">
            <div className="text-3xl font-bold text-red-400">{insights.low_stock_alerts}</div>
            <div className="text-sm text-gray-600">Low Stock Alerts</div>
          </LuxuryCard>
          <LuxuryCard className="p-6 text-center bg-white border border-gray-200">
            <div className="text-3xl font-bold text-green-500">
              {products.filter(p => p.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Active Products</div>
          </LuxuryCard>
          <LuxuryCard className="p-6 text-center bg-white border border-gray-200">
            <div className="text-3xl font-bold text-primary">
              ${products.reduce((sum, p) => sum + (p.price || 0), 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Value</div>
          </LuxuryCard>
        </div>

        {/* All Products */}
        <LuxuryCard className="p-6 bg-white border border-gray-200">
          <h2 className="text-xl font-sans text-primary mb-6">All Products ({products.length})</h2>
          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="p-4 border border-gray-200 rounded-lg">
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
                <div key={product.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-black">{product.name}</h3>
                    <p className="text-primary font-medium">${product.price}</p>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1 mb-3">
                    <div className="flex justify-between">
                      <span>Stock:</span>
                      <span>{product.stock_quantity ?? 'Not specified'}</span>
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
                      {product.stock_status === 'outofstock' ? 'Out' : 
                       product.stock_status === 'instock' ? 'Good' :
                       product.stock_quantity !== null && product.stock_quantity !== undefined && product.stock_quantity <= 5 && product.stock_quantity > 0 ? 'Low' : 'Good'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600">
              <p className="text-lg">No products found</p>
            </div>
          )}
        </LuxuryCard>
      </div>
    </div>
  );
};

export default GlobalProductsPage;
