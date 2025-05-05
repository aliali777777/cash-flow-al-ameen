import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { getSettings } from '@/utils/storage';
import { useProductFilter } from './hooks/useProductFilter';
import { useOrderManagement } from './hooks/useOrderManagement';
import { CategoryButtons } from '@/components/cashier/CategoryButtons';
import { Numpad } from '@/components/cashier/Numpad';
import CurrentOrderSummary from '@/components/cashier/CurrentOrderSummary';
import { PaymentButtons } from '@/components/cashier/PaymentButtons';
import { ProductDetailDialog } from '@/components/cashier/ProductDetailDialog';
import { ProductList } from '@/components/cashier/ProductList'; 
import { useOrder } from '@/context/OrderContext';
import { useProducts } from '@/context/ProductContext';
import { PaymentDialog } from '@/components/order/PaymentDialog';
import { DiscountDialog } from '@/components/order/DiscountDialog';
import { OrderItem } from '@/types';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

const CashierPage = () => {
  
  const settings = getSettings();
  const { availableProducts } = useProducts();
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [itemNote, setItemNote] = useState<string>("");
  const [showProducts, setShowProducts] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  
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

  // Modified to show product list and set category name
  const handleSelectCategory = (category: string) => {
    handleCategoryChange(category);
    setShowProducts(true);
    
    // Find the category name from the categories in CategoryButtons.tsx
    const categoryNames = [
      { id: 'croissant', name: 'منتجات كرواسون' },
      { id: 'coffee', name: 'منتجات كيفة' },
      { id: 'arabic_sweets', name: 'منتجات حلو عربي' },
      { id: 'baklava', name: 'منتجات بقلاوة' },
      { id: 'maamoul', name: 'منتجات معمول' },
      { id: 'regular_products', name: 'منتجات معمول' },
      { id: 'frozen', name: 'منتجات مفروكة ومدلوقة' },
      { id: 'desserts', name: 'معجنات / سنبورة / ...' },
      { id: 'cake_cups', name: 'منتجات قوالب كيك' },
      { id: 'cake_slice', name: 'منتجات قطع كيك' },
      { id: 'food', name: 'منتجات سنكي فود' },
      { id: 'chocolate', name: 'منتجات شوكولا' },
      { id: 'bowl', name: 'منتجات كاسة مشكلة' },
      { id: 'jar', name: 'منتجات برطمان' },
      { id: 'drinks', name: 'منتجات مشروبات' },
      { id: 'ramadan', name: 'منتجات رمضانيات' },
      { id: 'ready', name: 'منتجات جاهزة للبيع' },
      { id: 'mixed', name: 'منتجات مختلف' },
      { id: 'bags', name: 'منتجات باعبيت' },
      { id: 'cheese', name: 'منتجات أجبان وألبان' },
      { id: 'knafeh', name: 'منتجات معجنات' },
      { id: 'crepes', name: 'منتجات كريب / وافل / بانكيك' },
      { id: 'salads', name: 'منتجات سلطات' },
      { id: 'desserts2', name: 'منتجات معجنات' },
    ];
    
    const foundCategory = categoryNames.find(cat => cat.id === category);
    setCategoryName(foundCategory ? foundCategory.name : category);
  };

  const handleBackToCategories = () => {
    setShowProducts(false);
  };

  const handleNumpadClick = (num: number) => {
    if (selectedItemId && currentOrder) {
      const orderItem = currentOrder.items.find(item => item.productId === selectedItemId);
      if (orderItem) {
        // If a specific quantity is being entered
        const currentValue = orderItem.quantity;
        let newQuantity = Number(`${currentValue}${num}`);
        
        if (newQuantity > 99) newQuantity = 99; // Limit to reasonable quantity
        
        handleQuantityChange(selectedItemId, newQuantity);
        toast.success(`Quantity updated to ${newQuantity}`);
      }
    } else {
      toast.info("Please select a product first to update quantity");
    }
  };

  const handleNumpadClear = () => {
    if (selectedItemId) {
      handleQuantityChange(selectedItemId, 1); // Reset to 1
      toast.success("Quantity reset to 1");
    } else {
      toast.info("Please select a product first");
    }
  };

  const handleNumpadDelete = () => {
    if (selectedItemId) {
      handleRemoveItem(selectedItemId);
      setSelectedItemId(null);
      toast.success("Product removed");
    } else {
      toast.info("Please select a product first to delete");
    }
  };

  const handleNumpadDot = () => {
    toast.info("Decimal quantities not supported");
  };

  const handleAddNote = () => {
    if (selectedItemId) {
      setIsNoteDialogOpen(true);
    } else {
      toast.info("Please select a product first to add a note");
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
        
        toast.success('Note added');
        setIsNoteDialogOpen(false);
      }
    }
  };

  const handleClearAll = () => {
    if (currentOrder && currentOrder.items.length > 0) {
      handleCancelOrder();
      toast.success("All items cleared");
    } else {
      toast.info("Cart is already empty");
    }
  };

  const handleDeleteSelected = () => {
    if (selectedItemId) {
      handleRemoveItem(selectedItemId);
      setSelectedItemId(null);
      toast.success("Selected item deleted");
    } else {
      toast.info("Please select a product first to delete");
    }
  };

  const handleCashPayment = () => {
    if (currentOrder && currentOrder.items.length > 0) {
      setIsPaymentDialogOpen(true);
    } else {
      toast.info("Please add products to cart first");
    }
  };

  const handleAddItem = () => {
    setShowProducts(true);
    toast.info("Select a product to add to your order");
  };

  const handleDiscount = () => {
    if (currentOrder && currentOrder.items.length > 0) {
      setIsDiscountDialogOpen(true);
    } else {
      toast.info("Please add products to cart first to apply discount");
    }
  };

  const handleCloseOrder = () => {
    toast.success('Order closed');
  };

  // Select an item when clicked
  const handleSelectItem = (item: OrderItem) => {
    setSelectedItemId(item.productId);
    if (item.notes) {
      setItemNote(item.notes);
    } else {
      setItemNote("");
    }
    toast.info(`Selected ${item.product.name}`);
  };

  // Get products for selected category
  const categoryProducts = selectedCategory === 'all' 
    ? availableProducts 
    : availableProducts.filter(p => p.category === selectedCategory);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="pos-theme">
      <div className="flex h-screen bg-black overflow-hidden">
        <div className="flex-1 flex flex-col h-full bg-black text-white overflow-hidden">
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-pos-gold"
              onClick={handleCloseOrder}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="flex-1 p-4 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-full">
              {/* Order Summary - Left Side */}
              <div className="lg:col-span-2 h-full flex flex-col overflow-auto">
                <CurrentOrderSummary
                  order={currentOrder}
                  settings={settings}
                  onSelectItem={handleSelectItem}
                  selectedItemId={selectedItemId}
                  onRemoveItem={handleRemoveItem}
                  calculateOrderTotal={calculateOrderTotal}
                  calculateOrderDiscount={calculateOrderDiscount}
                  calculateFinalAmount={calculateFinalAmount}
                  onAddNote={handleAddNote}
                />
              </div>
              
              {/* Categories and Numpad - Right Side */}
              <div className="lg:col-span-3 h-full flex flex-col">
                {showProducts ? (
                  <div className="mb-4 flex flex-col h-full">
                    <ProductList
                      products={categoryProducts}
                      onProductSelect={handleProductClick}
                      onQuickAdd={handleQuickAdd}
                      settings={settings}
                      onBackToCategories={handleBackToCategories}
                      categoryName={categoryName}
                    />
                  </div>
                ) : (
                  <div className="mb-4">
                    <CategoryButtons 
                      onSelectCategory={handleSelectCategory}
                      selectedCategory={selectedCategory}
                    />
                  </div>
                )}
                
                {!showProducts && (
                  <div className="grid grid-cols-2 gap-4 h-full mt-4">
                    <div className="flex flex-col">
                      <Numpad 
                        onNumberClick={handleNumpadClick} 
                        onClear={handleNumpadClear}
                        onDelete={handleNumpadDelete}
                        onDot={handleNumpadDot}
                      />
                    </div>
                    
                    <div className="flex flex-col">
                      <PaymentButtons 
                        onClearAll={handleClearAll}
                        onDiscount={handleDiscount}
                        onDeleteItem={handleDeleteSelected}
                        onCashPayment={handleCashPayment}
                        onAddItem={handleAddItem}
                        onAddNote={handleAddNote}
                        selectedItemExists={!!selectedItemId}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      
      
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
        <DialogContent className="bg-black border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-pos-gold">Add Note</DialogTitle>
          </DialogHeader>
          <Textarea
            value={itemNote}
            onChange={(e) => setItemNote(e.target.value)}
            placeholder="Type your note here..."
            className="min-h-[100px] bg-gray-900 border-gray-700 text-white"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNoteDialogOpen(false)} 
              className="bg-black text-pos-gold border-pos-gold/30 hover:bg-black/90">
              Cancel
            </Button>
            <Button onClick={handleSaveNote} 
              className="bg-pos-gold text-black hover:bg-pos-gold/90">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default CashierPage;
