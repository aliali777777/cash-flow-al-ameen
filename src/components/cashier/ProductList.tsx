
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Tag, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Product, Settings } from '@/types';
import { toast } from 'sonner';

interface ProductListProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void; // إضافة وظيفة جديدة للإضافة السريعة
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
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories
}: ProductListProps) => {
  return (
    <div className="lg:col-span-2 space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث عن منتج..."
            className="pl-8"
            value={searchQuery}
            onChange={onSearchChange}
          />
        </div>
      </div>
      
      {/* Categories */}
      <div className="flex overflow-auto pb-2 whitespace-nowrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => onCategoryChange(category)}
            className="rounded-full"
          >
            {category === 'all' ? 'الكل' : category}
          </Button>
        ))}
      </div>
      
      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map(product => (
          <Card 
            key={product.id} 
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow relative"
          >
            <div 
              className="h-24 bg-muted flex items-center justify-center"
              onClick={() => onProductSelect(product)}
            >
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover" 
                />
              ) : (
                <Tag className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <CardContent className="p-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium truncate flex-1" onClick={() => onProductSelect(product)}>
                  {product.nameAr || product.name}
                </h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-full bg-primary/10 hover:bg-primary/20"
                  onClick={() => onQuickAdd(product)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-center text-muted-foreground">
                {settings.currencySymbol}{product.price.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        ))}
        
        {products.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground border rounded-lg border-dashed">
            لا توجد منتجات متاحة بهذه المواصفات
          </div>
        )}
      </div>
    </div>
  );
};
