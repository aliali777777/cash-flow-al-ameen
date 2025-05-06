
import React from 'react';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/context/ProductContext';

interface CategoryButtonsProps {
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

export const CategoryButtons: React.FC<CategoryButtonsProps> = ({
  onSelectCategory,
  selectedCategory
}) => {
  const { products } = useProducts();
  
  // Extract unique categories from products
  const categories = React.useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category)))
      .filter(Boolean)
      .sort();
      
    return ['all', ...uniqueCategories];
  }, [products]);

  return (
    <div className="grid grid-cols-3 gap-1 h-full overflow-y-auto">
      {categories.length > 0 ? (
        categories.map((category) => (
          <Button
            key={category}
            variant="outline"
            className={`h-24 flex items-center justify-center py-3 rounded-md text-right ${
              selectedCategory === category 
                ? 'bg-amber-500 text-black border-amber-700' 
                : 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700'
            }`}
            onClick={() => onSelectCategory(category)}
          >
            <span className="text-sm text-center">{category === 'all' ? 'كل المنتجات' : category}</span>
          </Button>
        ))
      ) : (
        <div className="col-span-3 flex items-center justify-center h-full">
          <span className="text-gray-500">لا توجد تصنيفات متاحة</span>
        </div>
      )}
    </div>
  );
};
