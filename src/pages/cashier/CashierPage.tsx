
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sidebar } from '@/components/common/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { getSettings } from '@/utils/storage';
import { CashierContent } from './CashierContent';
import { ProductDetailDialog } from '@/components/cashier/ProductDetailDialog';
import { useProductFilter } from './hooks/useProductFilter';
import { useOrderManagement } from './hooks/useOrderManagement';

const CashierPage = () => {
  const { currentUser } = useAuth();
  const settings = getSettings();
  
  const { 
    filteredProducts,
    searchQuery,
    selectedCategory,
    categories,
    handleSearchChange,
    handleCategoryChange
  } = useProductFilter();
  
  const {
    currentOrder,
    selectedProduct,
    handleProductClick,
    handleAddToOrder,
    handleQuickAdd,
    handleQuantityChange,
    handleRemoveItem,
    handleCancelOrder,
    handleProductDialogClose,
    calculateOrderTotal,
    calculateOrderDiscount,
    calculateFinalAmount,
    handleOrderComplete
  } = useOrderManagement();
  
  return (
    <div className="flex h-screen">
      <Sidebar className="w-64 hidden md:block" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 px-4 lg:px-6">
          <Sidebar className="lg:hidden" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">نقطة البيع</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3">
              {currentUser?.username || 'كاشير'}
            </Badge>
          </div>
        </header>
        
        <CashierContent 
          filteredProducts={filteredProducts}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          categories={categories}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onProductSelect={handleProductClick}
          onQuickAdd={handleQuickAdd}
          currentOrder={currentOrder}
          settings={settings}
          onCancelOrder={handleCancelOrder}
          onQuantityChange={handleQuantityChange}
          onRemoveItem={handleRemoveItem}
          calculateOrderTotal={calculateOrderTotal}
          calculateOrderDiscount={calculateOrderDiscount}
          calculateFinalAmount={calculateFinalAmount}
          onOrderComplete={handleOrderComplete}
        />
      </div>
      
      {/* Product Detail Dialog */}
      <ProductDetailDialog 
        product={selectedProduct}
        settings={settings}
        isOpen={!!selectedProduct}
        onClose={handleProductDialogClose}
        onAddToOrder={handleAddToOrder}
      />
    </div>
  );
};

export default CashierPage;
