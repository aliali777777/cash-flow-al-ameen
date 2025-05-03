
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { getSettings } from '@/utils/storage';
import { useProductFilter } from './hooks/useProductFilter';
import { useOrderManagement } from './hooks/useOrderManagement';
import { OrderHeader } from '@/components/cashier/OrderHeader';
import { CategoryButtons } from '@/components/cashier/CategoryButtons';
import { Numpad } from '@/components/cashier/Numpad';
import { CurrentOrderSummary } from '@/components/cashier/CurrentOrderSummary';
import { PaymentButtons } from '@/components/cashier/PaymentButtons';
import { ProductDetailDialog } from '@/components/cashier/ProductDetailDialog';
import { useOrder } from '@/context/OrderContext';
import { PaymentDialog } from '@/components/order/PaymentDialog';
import { DiscountDialog } from '@/components/order/DiscountDialog';
import { OrderItem } from '@/types';
import { toast } from 'sonner';

const CashierPage = () => {
  const settings = getSettings();
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  
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

  const { updateItemQuantity } = useOrder();

  const handleNumpadClick = (num: number) => {
    if (selectedItemId && currentOrder) {
      const orderItem = currentOrder.items.find(item => item.productId === selectedItemId);
      if (orderItem) {
        // If a specific quantity is being entered
        const currentValue = orderItem.quantity;
        let newQuantity = Number(`${currentValue}${num}`);
        
        if (newQuantity > 99) newQuantity = 99; // Limit to reasonable quantity
        
        handleQuantityChange(selectedItemId, newQuantity);
      }
    }
  };

  const handleNumpadClear = () => {
    if (selectedItemId) {
      handleQuantityChange(selectedItemId, 1); // Reset to 1
    }
  };

  const handleAddNote = (productId: string, note: string) => {
    if (!currentOrder) return;
    
    const orderItem = currentOrder.items.find(item => item.productId === productId);
    if (orderItem) {
      const updatedItem: OrderItem = {
        ...orderItem,
        notes: note
      };
      
      // We need to update the item in the order
      // First remove the old one
      handleRemoveItem(productId);
      
      // Then add the updated one
      setTimeout(() => {
        handleAddToOrder(updatedItem.quantity, updatedItem.notes || '');
      }, 10);
      
      toast.success('تم إضافة الملاحظة');
    }
  };

  const handleClearAll = () => {
    if (currentOrder && currentOrder.items.length > 0) {
      if (confirm('هل تريد حذف جميع المنتجات من السلة؟')) {
        handleCancelOrder();
      }
    }
  };

  const handleDeleteSelected = () => {
    if (selectedItemId) {
      handleRemoveItem(selectedItemId);
      setSelectedItemId(null);
    }
  };

  const handleCloseOrder = () => {
    // This would typically navigate away from the cashier screen
    toast.success('تم إغلاق الطلب');
  };

  // Select an item when clicked
  const handleSelectItem = (item: OrderItem) => {
    setSelectedItemId(item.productId);
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="pos-theme">
      <div className="min-h-screen bg-pos-dark text-pos-gold">
        <OrderHeader storeName="SHIWOW" onClose={handleCloseOrder} />
        
        <div className="container mx-auto p-4 grid grid-cols-12 gap-4">
          {/* Order Summary - Left Side */}
          <div className="col-span-5">
            <CurrentOrderSummary
              order={currentOrder}
              settings={settings}
              onAddNote={handleAddNote}
              onRemoveItem={handleRemoveItem}
              calculateOrderTotal={calculateOrderTotal}
              calculateOrderDiscount={calculateOrderDiscount}
              calculateFinalAmount={calculateFinalAmount}
            />
            
            <div className="mt-4">
              <PaymentButtons 
                onClearAll={handleClearAll}
                onDiscount={() => setIsDiscountDialogOpen(true)}
                onDeleteItem={handleDeleteSelected}
                onCashPayment={() => setIsPaymentDialogOpen(true)}
                onCardPayment={() => setIsPaymentDialogOpen(true)}
                selectedItemExists={!!selectedItemId}
              />
            </div>
          </div>
          
          {/* Categories and Numpad - Right Side */}
          <div className="col-span-7">
            <div className="mb-4">
              <CategoryButtons 
                onSelectCategory={handleCategoryChange}
                onClearAll={handleClearAll}
                onDiscount={() => setIsDiscountDialogOpen(true)}
                selectedCategory={selectedCategory}
              />
            </div>
            
            <Numpad 
              onNumberClick={handleNumpadClick} 
              onClear={handleNumpadClear}
            />
          </div>
        </div>
      </div>
      
      {/* Dialogs */}
      <ProductDetailDialog 
        product={selectedProduct}
        settings={settings}
        isOpen={!!selectedProduct}
        onClose={handleProductDialogClose}
        onAddToOrder={handleAddToOrder}
      />
      
      <DiscountDialog 
        disabled={!currentOrder || currentOrder.items.length === 0} 
      />
      
      <PaymentDialog 
        onComplete={handleOrderComplete}
        disabled={!currentOrder || currentOrder.items.length === 0}
      />
    </ThemeProvider>
  );
};

export default CashierPage;
