
import React from 'react';
import { Button } from '@/components/ui/button';
import { Product, Settings } from '@/types';

interface ProductListProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
  settings: Settings;
  onBackToCategories: () => void;
  categoryName: string;
}

export const ProductList = ({
  products,
  onProductSelect,
  onQuickAdd,
  settings,
  onBackToCategories,
  categoryName,
}: ProductListProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-pos-gold">{categoryName}</h2>
        <Button 
          variant="outline" 
          className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
          onClick={onBackToCategories}
        >
          العودة للأقسام
        </Button>
      </div>

      {/* Products Grid - 4x4 grid similar to the image */}
      <div className="flex-1 grid grid-cols-4 gap-1 overflow-auto">
        {products.map(product => (
          <Button
            key={product.id}
            variant="outline"
            className="h-24 flex flex-col items-center justify-center p-2 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
            onClick={() => onProductSelect(product)}
          >
            <span className="text-sm font-medium text-right w-full">
              {product.nameAr || product.name}
            </span>
            <span className="text-xs text-white/70 mt-auto text-right w-full">
              {settings.currencySymbol}{product.price.toFixed(2)}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};
