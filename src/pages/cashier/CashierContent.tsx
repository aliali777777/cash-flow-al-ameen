import React, { useState } from 'react';
import { Settings, Product } from '@/types';
import ProductList from '@/components/cashier/ProductList';

interface CashierContentProps {
  settings: Settings;
  availableProducts: Product[];
  onProductSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

const CashierContent: React.FC<CashierContentProps> = ({
  settings,
  availableProducts,
  onProductSelect,
  onQuickAdd,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  
  // Extract unique categories from products
  const categories = React.useMemo(() => {
    const uniqueCategories = Array.from(new Set(availableProducts.map(p => p.category)))
      .filter(Boolean)
      .sort();
      
    return ['all', ...uniqueCategories];
  }, [availableProducts]);
  
  return (
    <ProductList
      products={availableProducts}
      onProductSelect={onProductSelect}
      onQuickAdd={onQuickAdd}
      settings={settings}
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      selectedCategory={selectedCategory}
      onCategoryChange={handleCategoryChange}
      categories={categories}
    />
  );
};

export default CashierContent;
