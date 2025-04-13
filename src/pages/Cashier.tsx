
import React, { useState, useEffect } from 'react';
import { useOrder } from '@/context/OrderContext';
import { useProducts } from '@/context/ProductContext';
import {
  Search,
  X,
  ShoppingCart,
  Plus,
  Minus,
  Trash,
  Receipt,
  Tag,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sidebar } from '@/components/common/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Product, OrderItem, PERMISSIONS } from '@/types';
import { getSettings } from '@/utils/storage';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { DiscountDialog } from '@/components/order/DiscountDialog';
import { PaymentDialog } from '@/components/order/PaymentDialog';

const Cashier = () => {
  const { currentOrder, initNewOrder, addItemToOrder, removeItemFromOrder, updateItemQuantity, clearCurrentOrder } = useOrder();
  const { availableProducts, getProductsByCategory } = useProducts();
  const { currentUser, hasPermission } = useAuth();
  const settings = getSettings();
  
  // State for product filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [productQuantity, setProductQuantity] = useState<number>(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [notes, setNotes] = useState<string>('');
  
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
  
  const handleAddToOrder = () => {
    if (!selectedProduct) return;
    
    const orderItem: OrderItem = {
      productId: selectedProduct.id,
      product: selectedProduct,
      quantity: productQuantity,
      notes: notes || undefined
    };
    
    addItemToOrder(orderItem);
    
    // Reset state
    setProductQuantity(1);
    setSelectedProduct(null);
    setNotes('');
    
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
    setProductQuantity(1);
    setNotes('');
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  
  const handleQuantityIncrement = () => {
    setProductQuantity(prev => prev + 1);
  };
  
  const handleQuantityDecrement = () => {
    if (productQuantity > 1) {
      setProductQuantity(prev => prev - 1);
    }
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
            <div className="lg:col-span-2 space-y-4">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="بحث عن منتج..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              
              {/* Categories */}
              <div className="flex overflow-auto pb-2 whitespace-nowrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => handleCategoryChange(category)}
                    className="rounded-full"
                  >
                    {category === 'all' ? 'الكل' : category}
                  </Button>
                ))}
              </div>
              
              {/* Products Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <Card 
                    key={product.id} 
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="h-24 bg-muted flex items-center justify-center">
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
                      <h3 className="font-medium text-center truncate">
                        {product.nameAr || product.name}
                      </h3>
                      <p className="text-center text-muted-foreground">
                        {settings.currencySymbol}{product.price.toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredProducts.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground border rounded-lg border-dashed">
                    لا توجد منتجات متاحة بهذه المواصفات
                  </div>
                )}
              </div>
            </div>
            
            {/* Current Order Section - Desktop View */}
            <div className="hidden lg:flex flex-col h-[calc(100vh-160px)]">
              <Card className="flex-1 flex flex-col">
                <CardHeader className="pb-3 flex-row justify-between items-center">
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="ml-2 h-5 w-5" />
                    الطلب الحالي
                  </CardTitle>
                  <div className="flex items-center">
                    <span className="text-sm font-medium ml-1">#{currentOrder?.orderNumber}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={handleCancelOrder}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-auto">
                  {currentOrder?.items && currentOrder.items.length > 0 ? (
                    <div className="space-y-4">
                      {currentOrder.items.map((item) => (
                        <div 
                          key={item.productId} 
                          className="flex items-center justify-between border-b pb-2"
                        >
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium">
                                {item.product.nameAr || item.product.name}
                              </h4>
                              <span className="text-muted-foreground">
                                {settings.currencySymbol}
                                {(item.product.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                            
                            {item.notes && (
                              <p className="text-sm text-muted-foreground">
                                {item.notes}
                              </p>
                            )}
                            
                            <div className="flex items-center mt-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 rounded-full"
                                onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 rounded-full"
                                onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => handleRemoveItem(item.productId)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <ShoppingCart className="h-12 w-12 mb-2" />
                      <p>لا توجد منتجات في الطلب الحالي</p>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex-col border-t pt-4">
                  <div className="w-full space-y-2">
                    <div className="flex justify-between">
                      <span>المجموع:</span>
                      <span>{settings.currencySymbol}{calculateOrderTotal().toFixed(2)}</span>
                    </div>
                    
                    {calculateOrderDiscount() > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>الخصم:</span>
                        <span>- {settings.currencySymbol}{calculateOrderDiscount().toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between font-bold text-lg">
                      <span>الإجمالي:</span>
                      <span>{settings.currencySymbol}{calculateFinalAmount().toFixed(2)}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <DiscountDialog 
                        disabled={!currentOrder || currentOrder.items.length === 0} 
                      />
                      
                      <PaymentDialog 
                        onComplete={handleOrderComplete}
                        disabled={!currentOrder || currentOrder.items.length === 0}
                      />
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
            
            {/* Current Order Section - Mobile View */}
            <div className="lg:hidden">
              <Tabs defaultValue="products">
                <TabsList className="w-full">
                  <TabsTrigger value="products" className="flex-1">المنتجات</TabsTrigger>
                  <TabsTrigger value="order" className="flex-1">
                    الطلب
                    {currentOrder?.items.length ? (
                      <Badge className="ml-2" variant="secondary">
                        {currentOrder.items.length}
                      </Badge>
                    ) : null}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="products">
                  {/* Product content is already shown outside tabs on mobile */}
                </TabsContent>
                
                <TabsContent value="order">
                  <Card>
                    <CardHeader className="pb-3 flex-row justify-between items-center">
                      <CardTitle className="flex items-center">
                        <ShoppingCart className="ml-2 h-5 w-5" />
                        الطلب الحالي
                      </CardTitle>
                      <div className="flex items-center">
                        <span className="text-sm font-medium ml-1">#{currentOrder?.orderNumber}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={handleCancelOrder}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      {currentOrder?.items && currentOrder.items.length > 0 ? (
                        <div className="space-y-4">
                          {currentOrder.items.map((item) => (
                            <div 
                              key={item.productId} 
                              className="flex items-center justify-between border-b pb-2"
                            >
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <h4 className="font-medium">
                                    {item.product.nameAr || item.product.name}
                                  </h4>
                                  <span className="text-muted-foreground">
                                    {settings.currencySymbol}
                                    {(item.product.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                                
                                {item.notes && (
                                  <p className="text-sm text-muted-foreground">
                                    {item.notes}
                                  </p>
                                )}
                                
                                <div className="flex items-center mt-1">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6 rounded-full"
                                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6 rounded-full"
                                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                  
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive"
                                    onClick={() => handleRemoveItem(item.productId)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                          <ShoppingCart className="h-12 w-12 mb-2" />
                          <p>لا توجد منتجات في الطلب الحالي</p>
                        </div>
                      )}
                    </CardContent>
                    
                    <CardFooter className="flex-col border-t pt-4">
                      <div className="w-full space-y-2">
                        <div className="flex justify-between">
                          <span>المجموع:</span>
                          <span>{settings.currencySymbol}{calculateOrderTotal().toFixed(2)}</span>
                        </div>
                        
                        {calculateOrderDiscount() > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>الخصم:</span>
                            <span>- {settings.currencySymbol}{calculateOrderDiscount().toFixed(2)}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between font-bold text-lg">
                          <span>الإجمالي:</span>
                          <span>{settings.currencySymbol}{calculateFinalAmount().toFixed(2)}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <DiscountDialog 
                            disabled={!currentOrder || currentOrder.items.length === 0}
                          />
                          
                          <PaymentDialog 
                            onComplete={handleOrderComplete}
                            disabled={!currentOrder || currentOrder.items.length === 0}
                          />
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
      
      {/* Product Detail Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && handleProductDialogClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.nameAr || selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              {selectedProduct?.imageUrl ? (
                <img 
                  src={selectedProduct.imageUrl} 
                  alt={selectedProduct.name}
                  className="w-32 h-32 object-cover rounded-md" 
                />
              ) : (
                <div className="w-32 h-32 bg-muted rounded-md flex items-center justify-center">
                  <Tag className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>
            
            <div className="flex justify-center space-x-4 rtl:space-x-reverse">
              <Button
                variant="outline"
                size="icon"
                onClick={handleQuantityDecrement}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex items-center justify-center w-12 h-10 border rounded-md">
                {productQuantity}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleQuantityIncrement}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium block">
                ملاحظات إضافية
              </label>
              <Input
                id="notes"
                placeholder="مثال: بدون بصل، حار..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            
            <div className="flex justify-between items-center border-t pt-4">
              <div className="font-medium">
                السعر: {settings.currencySymbol}
                {selectedProduct ? (productQuantity * selectedProduct.price).toFixed(2) : '0.00'}
              </div>
              <Button onClick={handleAddToOrder}>
                إضافة للطلب
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cashier;
