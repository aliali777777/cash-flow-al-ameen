
import React from 'react';
import { Button } from '@/components/ui/button';
import { Product, Settings } from '@/types';

interface ProductListProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  settings: Settings;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

export const ProductList = ({
  products,
  onProductSelect,
  onQuickAdd,
  settings,
  categories,
  selectedCategory,
  onCategoryChange
}: ProductListProps) => {
  return (
    <div className="h-full flex flex-col">
      {/* Categories Grid */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => onCategoryChange(category)}
            className="w-full text-sm py-1 h-auto whitespace-normal text-right"
          >
            {category === 'all' ? 'الكل' : category}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="flex-1 grid grid-cols-3 gap-2 overflow-auto">
        {products.map(product => (
          <Button
            key={product.id}
            variant="outline"
            className="h-24 flex flex-col items-start p-2 text-right"
            onClick={() => onProductSelect(product)}
          >
            <span className="text-sm font-medium">
              {product.nameAr || product.name}
            </span>
            <span className="text-xs text-muted-foreground mt-auto">
              {settings.currencySymbol}{product.price.toFixed(2)}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};
