
import React from 'react';
import { Button } from '@/components/ui/button';
import { Product, Settings } from '@/types';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  settings: Settings;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  onProductClick,
  settings 
}) => {
  return (
    <div className="grid grid-cols-3 gap-1 h-full overflow-y-auto">
      {products.length > 0 ? (
        products.map(product => (
          <Button
            key={product.id}
            variant="outline"
            className="h-24 flex flex-col items-center justify-center p-2 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
            onClick={() => onProductClick(product)}
          >
            <span className="text-sm font-medium text-right w-full">
              {product.nameAr || product.name}
            </span>
            <span className="text-xs text-white/70 mt-auto text-right w-full">
              {settings.currencySymbol}{product.price.toFixed(2)}
            </span>
          </Button>
        ))
      ) : (
        <div className="col-span-3 flex items-center justify-center h-full">
          <span className="text-gray-500">No products in this category</span>
        </div>
      )}
    </div>
  );
};
