import React from 'react';
import { Order, Product, Settings } from '@/types';
import { ProductList } from '@/components/cashier/ProductList';
import { CurrentOrder } from '@/components/cashier/CurrentOrder';
import { MobileOrderTabs } from '@/components/cashier/MobileOrderTabs';
import { Numpad } from '@/components/cashier/Numpad';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Barcode, Search, Trash2, CashRegister, X } from 'lucide-react';

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
  const handleNumpadClick = (num: number) => {
    // Handle numpad input
    console.log('Numpad clicked:', num);
  };

  const handleNumpadClear = () => {
    // Handle clear button
    console.log('Numpad cleared');
  };

  return (
    <main className="flex h-full overflow-hidden">
      {/* Left Side - Order and Controls */}
      <div className="w-1/2 p-4 border-r flex flex-col">
        {/* Top Controls */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Input
              placeholder="باركود المنتج..."
              className="pl-10"
              value={searchQuery}
              onChange={onSearchChange}
            />
            <Barcode className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
          <Button variant="outline" size="icon">
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Current Order */}
        <div className="flex-1 overflow-auto mb-4">
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

        {/* Bottom Controls */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="flex gap-2" onClick={onCancelOrder}>
            <Trash2 className="h-5 w-5" />
            Delete All
          </Button>
          <Button variant="outline" className="flex gap-2">
            <CashRegister className="h-5 w-5" />
            Cash Drawer
          </Button>
          <Button variant="outline" className="flex gap-2">
            <X className="h-5 w-5" />
            Close Print
          </Button>
          <Button variant="outline" className="flex gap-2">
            <X className="h-5 w-5" />
            Close Order
          </Button>
        </div>

        {/* Numpad */}
        <div className="mt-4">
          <Numpad onNumberClick={handleNumpadClick} onClear={handleNumpadClear} />
        </div>
      </div>

      {/* Right Side - Products */}
      <div className="w-1/2 p-4">
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
      </div>
    </main>
  );
};
