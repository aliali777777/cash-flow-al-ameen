
import React from 'react';
import { Order, Product, Settings } from '@/types';
import { ProductList } from '@/components/cashier/ProductList';
import { CurrentOrder } from '@/components/cashier/CurrentOrder';
import { MobileOrderTabs } from '@/components/cashier/MobileOrderTabs';

interface CashierContentProps {
  filteredProducts: Product[];
  searchQuery: string;
  selectedCategory: string;
  categories: string[];
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (category: string) => void;
  onProductSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  currentOrder: Order | null;
  settings: Settings;
  onCancelOrder: () => void;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  calculateOrderTotal: () => number;
  calculateOrderDiscount: () => number;
  calculateFinalAmount: () => number;
  onOrderComplete: () => void;
}

export const CashierContent: React.FC<CashierContentProps> = ({
  filteredProducts,
  searchQuery,
  selectedCategory,
  categories,
  onSearchChange,
  onCategoryChange,
  onProductSelect,
  onQuickAdd,
  currentOrder,
  settings,
  onCancelOrder,
  onQuantityChange,
  onRemoveItem,
  calculateOrderTotal,
  calculateOrderDiscount,
  calculateFinalAmount,
  onOrderComplete
}) => {
  return (
    <main className="flex-1 overflow-auto p-4 lg:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <ProductList 
          products={filteredProducts}
          onProductSelect={onProductSelect}
          onQuickAdd={onQuickAdd}
          settings={settings}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          categories={categories}
        />
        
        {/* Current Order Section - Desktop View */}
        <div className="hidden lg:flex flex-col h-[calc(100vh-160px)]">
          <CurrentOrder 
            order={currentOrder}
            settings={settings}
            onCancelOrder={onCancelOrder}
            onQuantityChange={onQuantityChange}
            onRemoveItem={onRemoveItem}
            calculateOrderTotal={calculateOrderTotal}
            calculateOrderDiscount={calculateOrderDiscount}
            calculateFinalAmount={calculateFinalAmount}
            onOrderComplete={onOrderComplete}
          />
        </div>
        
        {/* Current Order Section - Mobile View */}
        <MobileOrderTabs 
          order={currentOrder}
          settings={settings}
          onCancelOrder={onCancelOrder}
          onQuantityChange={onQuantityChange}
          onRemoveItem={onRemoveItem}
          calculateOrderTotal={calculateOrderTotal}
          calculateOrderDiscount={calculateOrderDiscount}
          calculateFinalAmount={calculateFinalAmount}
          onOrderComplete={onOrderComplete}
        />
      </div>
    </main>
  );
};
