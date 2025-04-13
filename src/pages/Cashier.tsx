
import React, { useState } from 'react';
import { Sidebar } from '@/components/common/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  ShoppingCart, 
  Trash, 
  Plus, 
  Minus, 
  Tag, 
  CreditCard, 
  Banknote, 
  Printer, 
  X,
  MoreHorizontal,
} from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { useOrders } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Product, OrderItem, PERMISSIONS } from '@/types';
import { cn } from '@/lib/utils';
import { getSettings } from '@/utils/storage';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const Cashier = () => {
  const { currentUser, hasPermission } = useAuth();
  const { products, availableProducts } = useProducts();
  const { 
    currentOrder, 
    initializeOrder, 
    addItemToOrder, 
    removeItemFromOrder, 
    updateItemQuantity,
    updateItemNotes,
    completeOrder,
    cancelOrder,
    calculateOrderTotal,
    calculateOrderDiscount,
    calculateFinalAmount
  } = useOrders();
  
  const settings = getSettings();
  
  // State for product searching and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // State for note input
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [itemNote, setItemNote] = useState('');

  // Get unique categories from products
  const categories = [...new Set(products.map(product => product.category))];
  
  // Filtered products based on search and category
  const filteredProducts = availableProducts.filter(product => {
    const matchesSearch = searchQuery.trim() === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.nameAr && product.nameAr.includes(searchQuery));
    
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Handle order initialization if needed
  React.useEffect(() => {
    if (!currentOrder && hasPermission(PERMISSIONS.CREATE_ORDERS)) {
      initializeOrder();
    }
  }, [currentOrder, hasPermission, initializeOrder]);
  
  const handleAddToOrder = (product: Product) => {
    if (!currentOrder) {
      initializeOrder();
      setTimeout(() => addItemToOrder(product, 1), 100);
      return;
    }
    
    addItemToOrder(product, 1);
  };
  
  const handleQuantityChange = (index: number, increment: boolean) => {
    const item = currentOrder?.items[index];
    if (!item) return;
    
    const newQuantity = increment ? item.quantity + 1 : Math.max(1, item.quantity - 1);
    updateItemQuantity(index, newQuantity);
  };
  
  const handleOpenNoteDialog = (index: number) => {
    setSelectedItemIndex(index);
    setItemNote(currentOrder?.items[index].notes || '');
  };
  
  const handleSaveNote = () => {
    if (selectedItemIndex !== null) {
      updateItemNotes(selectedItemIndex, itemNote);
      setSelectedItemIndex(null);
      setItemNote('');
    }
  };
  
  const handlePayment = (method: 'cash' | 'card' | 'other') => {
    if (!currentOrder || currentOrder.items.length === 0) {
      toast.error('لا يمكن إتمام طلب فارغ');
      return;
    }
    
    completeOrder(method);
    
    if (settings.autoPrintReceipt) {
      // Mock receipt printing
      toast.success('جاري طباعة الإيصال...');
      console.log('Printing receipt for order', currentOrder);
    }
    
    // Reinitialize a new order
    setTimeout(() => {
      initializeOrder();
    }, 500);
  };
  
  return (
    <div className="flex h-screen">
      <Sidebar className="w-64 hidden md:block" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
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
        
        <main className="flex-1 flex overflow-hidden">
          {/* Main container */}
          <div className="flex flex-1 overflow-hidden">
            {/* Products section (left on desktop) */}
            <div className="hidden md:flex md:w-2/3 lg:w-3/4 flex-col border-l overflow-hidden">
              {/* Search bar and category tabs */}
              <div className="p-4 border-b">
                <div className="flex items-center space-x-2 mb-4 rtl">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="بحث عن منتج..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-3 pr-10 rtl"
                    />
                  </div>
                </div>
                
                <ScrollArea className="w-full" orientation="horizontal">
                  <div className="flex space-x-1 rtl">
                    <Button
                      variant={!selectedCategory ? "default" : "outline"}
                      className="rounded-full"
                      onClick={() => setSelectedCategory(null)}
                    >
                      الكل
                    </Button>
                    
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        className="rounded-full whitespace-nowrap"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              {/* Products grid */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <Card
                        key={product.id}
                        className="h-[180px] overflow-hidden cursor-pointer hover:border-primary transition-colors"
                        onClick={() => handleAddToOrder(product)}
                      >
                        <CardContent className="p-0 h-full flex flex-col">
                          <div 
                            className="w-full h-24 bg-muted flex items-center justify-center text-2xl font-bold bg-cover bg-center"
                            style={product.image ? { backgroundImage: `url(${product.image})` } : {}}
                          >
                            {!product.image && product.name.charAt(0)}
                          </div>
                          <div className="p-3 flex-1 flex flex-col">
                            <div className="font-medium rtl line-clamp-1" dir="rtl">
                              {product.nameAr || product.name}
                            </div>
                            <div className="text-primary text-lg font-bold mt-auto">
                              {settings.currencySymbol}{product.price.toFixed(2)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full flex items-center justify-center py-8 text-muted-foreground">
                      لا توجد منتجات مطابقة للبحث
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Order section (right on desktop) */}
            <div className="flex flex-col w-full md:w-1/3 lg:w-1/4 border-l overflow-hidden">
              <div className="p-4 border-b bg-muted/30">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <ShoppingCart className="h-5 w-5 ml-2" />
                    <h2 className="font-medium">
                      {currentOrder?.items.length 
                        ? `الطلب #${currentOrder.orderNumber}`
                        : 'طلب جديد'
                      }
                    </h2>
                  </div>
                  
                  {currentOrder?.items.length > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => {
                        if (confirm('هل أنت متأكد من إلغاء الطلب الحالي؟')) {
                          cancelOrder();
                        }
                      }}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Order items */}
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-2">
                  {currentOrder?.items.length ? (
                    currentOrder.items.map((item, index) => (
                      <div key={index} className="flex flex-col border rounded-lg p-3">
                        <div className="flex justify-between">
                          <div className="font-medium rtl">
                            {item.product.nameAr || item.product.name}
                          </div>
                          <div className="text-primary">
                            {settings.currencySymbol}{item.product.price.toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center space-x-2 rtl">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 rounded-full"
                              onClick={() => handleQuantityChange(index, false)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 rounded-full"
                              onClick={() => handleQuantityChange(index, true)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center space-x-2 rtl">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleOpenNoteDialog(index)}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => removeItemFromOrder(index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {item.notes && (
                          <div className="mt-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md rtl">
                            {item.notes}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      لا توجد منتجات في الطلب
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              {/* Order summary */}
              <div className="p-4 border-t bg-card">
                <div className="space-y-1.5 rtl">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">المجموع</span>
                    <span>{settings.currencySymbol}{calculateOrderTotal().toFixed(2)}</span>
                  </div>
                  
                  {calculateOrderDiscount() > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الخصم</span>
                      <span className="text-destructive">
                        -{settings.currencySymbol}{calculateOrderDiscount().toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  <Separator className="my-2" />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>الإجمالي</span>
                    <span className="text-primary">
                      {settings.currencySymbol}{calculateFinalAmount().toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        disabled={!currentOrder?.items.length}
                      >
                        <Tag className="ml-2 h-4 w-4" />
                        خصم
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>تطبيق خصم</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="text-center text-muted-foreground">
                          ميزة الخصومات قيد التطوير
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled={!currentOrder?.items.length}
                    onClick={() => toast('ميزة الطباعة قيد التطوير')}
                  >
                    <Printer className="ml-2 h-4 w-4" />
                    طباعة
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button 
                    onClick={() => handlePayment('cash')}
                    className="w-full py-6"
                    disabled={!currentOrder?.items.length}
                  >
                    <Banknote className="ml-2 h-5 w-5" />
                    كاش
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full py-6"
                    disabled={!currentOrder?.items.length}
                    onClick={() => handlePayment('card')}
                  >
                    <CreditCard className="ml-2 h-5 w-5" />
                    بطاقة
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile tabs for products and order */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background">
            <Tabs defaultValue="products">
              <TabsList className="w-full">
                <TabsTrigger value="products" className="flex-1">المنتجات</TabsTrigger>
                <TabsTrigger value="order" className="flex-1">
                  الطلب 
                  {currentOrder?.items.length > 0 && (
                    <Badge className="ml-2" variant="secondary">
                      {currentOrder.items.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </main>
      </div>
      
      {/* Item note dialog */}
      <Dialog open={selectedItemIndex !== null} onOpenChange={(open) => !open && setSelectedItemIndex(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="rtl">إضافة ملاحظة</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={itemNote}
              onChange={(e) => setItemNote(e.target.value)}
              placeholder="أضف ملاحظة للمنتج..."
              className="rtl"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSelectedItemIndex(null)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveNote}>
              حفظ
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cashier;
