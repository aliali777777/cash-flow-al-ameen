
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sidebar } from '@/components/common/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const CashierPage = () => {
  const settings = getSettings();
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [itemNote, setItemNote] = useState<string>("");
  const isMobile = useIsMobile();
  
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
        toast.success(`تم تعديل الكمية إلى ${newQuantity}`);
      }
    } else {
      toast.info("الرجاء تحديد منتج أولاً لتعديل الكمية");
    }
  };

  const handleNumpadClear = () => {
    if (selectedItemId) {
      handleQuantityChange(selectedItemId, 1); // Reset to 1
      toast.success("تم إعادة تعيين الكمية إلى 1");
    } else {
      toast.info("الرجاء تحديد منتج أولاً");
    }
  };

  const handleNumpadDelete = () => {
    if (selectedItemId) {
      handleRemoveItem(selectedItemId);
      setSelectedItemId(null);
      toast.success("تم حذف المنتج");
    } else {
      toast.info("الرجاء تحديد منتج أولاً للحذف");
    }
  };

  const handleAddNote = () => {
    if (selectedItemId) {
      setIsNoteDialogOpen(true);
    } else {
      toast.info("الرجاء تحديد منتج أولاً لإضافة ملاحظة");
    }
  };

  const handleSaveNote = () => {
    if (selectedItemId && currentOrder) {
      const orderItem = currentOrder.items.find(item => item.productId === selectedItemId);
      if (orderItem) {
        const updatedItem: OrderItem = {
          ...orderItem,
          notes: itemNote
        };
        
        // Remove the old item
        handleRemoveItem(selectedItemId);
        
        // Then add the updated one
        setTimeout(() => {
          handleAddToOrder(updatedItem.quantity, updatedItem.notes || '');
        }, 10);
        
        toast.success('تم إضافة الملاحظة');
        setIsNoteDialogOpen(false);
      }
    }
  };

  const handleClearAll = () => {
    if (currentOrder && currentOrder.items.length > 0) {
      handleCancelOrder();
      toast.success("تم مسح جميع المنتجات من السلة");
    } else {
      toast.info("السلة فارغة بالفعل");
    }
  };

  const handleDeleteSelected = () => {
    if (selectedItemId) {
      handleRemoveItem(selectedItemId);
      setSelectedItemId(null);
      toast.success("تم حذف المنتج المحدد");
    } else {
      toast.info("الرجاء تحديد منتج أولاً للحذف");
    }
  };

  const handleCashPayment = () => {
    if (currentOrder && currentOrder.items.length > 0) {
      setIsPaymentDialogOpen(true);
    } else {
      toast.info("الرجاء إضافة منتجات إلى السلة أولاً");
    }
  };

  const handleCardPayment = () => {
    if (currentOrder && currentOrder.items.length > 0) {
      setIsPaymentDialogOpen(true);
    } else {
      toast.info("الرجاء إضافة منتجات إلى السلة أولاً");
    }
  };

  const handleDiscount = () => {
    if (currentOrder && currentOrder.items.length > 0) {
      setIsDiscountDialogOpen(true);
    } else {
      toast.info("الرجاء إضافة منتجات إلى السلة أولاً لتطبيق الخصم");
    }
  };

  const handleCloseOrder = () => {
    // This would typically navigate away from the cashier screen
    toast.success('تم إغلاق الطلب');
  };

  // Select an item when clicked
  const handleSelectItem = (item: OrderItem) => {
    setSelectedItemId(item.productId);
    if (item.notes) {
      setItemNote(item.notes);
    } else {
      setItemNote("");
    }
    toast.info(`تم تحديد ${item.product.name}`);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {!isMobile && <Sidebar className="w-64" />}
      
      <ThemeProvider defaultTheme="dark" storageKey="pos-theme">
        <div className="flex-1 flex flex-col h-full bg-pos-dark text-pos-gold overflow-hidden">
          <OrderHeader storeName="SHIWOW" onClose={handleCloseOrder} />
          
          <div className="flex-1 p-4 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
              {/* Order Summary - Left Side */}
              <div className="lg:col-span-5 h-full flex flex-col overflow-auto">
                <CurrentOrderSummary
                  order={currentOrder}
                  settings={settings}
                  onSelectItem={handleSelectItem}
                  selectedItemId={selectedItemId}
                  onRemoveItem={handleRemoveItem}
                  calculateOrderTotal={calculateOrderTotal}
                  calculateOrderDiscount={calculateOrderDiscount}
                  calculateFinalAmount={calculateFinalAmount}
                />
              </div>
              
              {/* Categories and Numpad - Right Side */}
              <div className="lg:col-span-7 h-full flex flex-col">
                <div className="mb-4">
                  <CategoryButtons 
                    onSelectCategory={handleCategoryChange}
                    onClearAll={handleClearAll}
                    onDiscount={handleDiscount}
                    selectedCategory={selectedCategory}
                  />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
                  <div className="flex flex-col">
                    <Numpad 
                      onNumberClick={handleNumpadClick} 
                      onClear={handleNumpadClear}
                      onDelete={handleNumpadDelete}
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <PaymentButtons 
                      onClearAll={handleClearAll}
                      onDiscount={handleDiscount}
                      onDeleteItem={handleDeleteSelected}
                      onCashPayment={handleCashPayment}
                      onCardPayment={handleCardPayment}
                      onAddNote={handleAddNote}
                      selectedItemExists={!!selectedItemId}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
      
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

      {/* Note Dialog */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة ملاحظة للمنتج</DialogTitle>
          </DialogHeader>
          <Textarea
            value={itemNote}
            onChange={(e) => setItemNote(e.target.value)}
            placeholder="اكتب ملاحظتك هنا..."
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNoteDialogOpen(false)}>إلغاء</Button>
            <Button onClick={handleSaveNote}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CashierPage;
