
import React, { useState, useEffect } from 'react';
import { useOrder } from '@/context/OrderContext';
import { useProducts } from '@/context/ProductContext';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Sidebar } from '@/components/common/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Product, OrderItem } from '@/types';
import { getSettings } from '@/utils/storage';
import { toast } from 'sonner';
import { ProductList } from '@/components/cashier/ProductList';
import { CurrentOrder } from '@/components/cashier/CurrentOrder';
import { MobileOrderTabs } from '@/components/cashier/MobileOrderTabs';
import { ProductDetailDialog } from '@/components/cashier/ProductDetailDialog';

const Cashier = () => {
  const { currentOrder, initNewOrder, addItemToOrder, removeItemFromOrder, updateItemQuantity, clearCurrentOrder } = useOrder();
  const { availableProducts } = useProducts();
  const { currentUser } = useAuth();
  const settings = getSettings();
  
  // State for product filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Get unique categories
  const categories = React.useMemo(() => {
    const categoriesSet = new Set(availableProducts.map(p => p.category));
    return ['all', ...Array.from(categoriesSet)];
  }, [availableProducts]);
  
  // Filter products based on search and category
  const filteredProducts = React.useMemo(() => {
    return availableProducts.filter(product => {
      const matchesSearch = searchQuery 
        ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          (product.nameAr && product.nameAr.includes(searchQuery))
        : true;
      
      const matchesCategory = selectedCategory === 'all' 
        ? true 
        : product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [availableProducts, searchQuery, selectedCategory]);
  
  // Helper functions for order calculations
  const calculateOrderTotal = () => {
    if (!currentOrder) return 0;
    return currentOrder.totalAmount;
  };

  const calculateOrderDiscount = () => {
    if (!currentOrder) return 0;
    return currentOrder.discountAmount;
  };

  const calculateFinalAmount = () => {
    if (!currentOrder) return 0;
    return currentOrder.finalAmount;
  };
  
  // Handle order initialization if needed
  React.useEffect(() => {
    if (!currentOrder && currentUser) {
      initNewOrder(currentUser.id);
    }
  }, [currentOrder, currentUser, initNewOrder]);
  
  const handleAddToOrder = (quantity: number, notes: string) => {
    if (!selectedProduct) return;
    
    const orderItem: OrderItem = {
      productId: selectedProduct.id,
      product: selectedProduct,
      quantity: quantity,
      notes: notes || undefined
    };
    
    addItemToOrder(orderItem);
    setSelectedProduct(null);
    
    toast.success('تمت إضافة المنتج للطلب');
  };
  
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      // Ask for confirmation before removing
      if (confirm('هل تريد إزالة هذا المنتج من الطلب؟')) {
        removeItemFromOrder(productId);
      }
      return;
    }
    
    updateItemQuantity(productId, newQuantity);
  };
  
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };
  
  const handleProductDialogClose = () => {
    setSelectedProduct(null);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  
  const handleOrderComplete = () => {
    // Order successfully processed, reset state
    setTimeout(() => {
      initNewOrder(currentUser?.id || '');
    }, 500);
  };

  const handleRemoveItem = (productId: string) => {
    removeItemFromOrder(productId);
  };

  const handleCancelOrder = () => {
    if (confirm('هل أنت متأكد من إلغاء الطلب الحالي؟')) {
      clearCurrentOrder();
    }
  };
  
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
        
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Products Section */}
            <ProductList 
              products={filteredProducts}
              onProductSelect={handleProductClick}
              settings={settings}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              categories={categories}
            />
            
            {/* Current Order Section - Desktop View */}
            <div className="hidden lg:flex flex-col h-[calc(100vh-160px)]">
              <CurrentOrder 
                order={currentOrder}
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
            
            {/* Current Order Section - Mobile View */}
            <MobileOrderTabs 
              order={currentOrder}
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
        </main>
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

export default Cashier;
