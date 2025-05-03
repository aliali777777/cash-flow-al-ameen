import React, { useState } from 'react';
import { Order, Product, Settings } from '@/types';
import { ProductList } from '@/components/cashier/ProductList';
import { CurrentOrder } from '@/components/cashier/CurrentOrder';
import { MobileOrderTabs } from '@/components/cashier/MobileOrderTabs';
import { Numpad } from '@/components/cashier/Numpad';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Barcode, Search, Trash2, Receipt, X, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { OrderReceipt } from '@/components/cashier/OrderReceipt';
import ReactDOM from 'react-dom/client';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [barcodeInput, setBarcodeInput] = useState('');
  const isMobile = useIsMobile();

  const handleNumpadClick = (num: number) => {
    setBarcodeInput(prev => prev + num.toString());
  };

  const handleNumpadClear = () => {
    setBarcodeInput('');
  };

  const handleSearchByBarcode = () => {
    if (!barcodeInput) {
      toast.error('Please enter a barcode');
      return;
    }
    
    const product = filteredProducts.find(p => p.id === barcodeInput);
    if (product) {
      onProductSelect(product);
      setBarcodeInput('');
    } else {
      toast.error('Product not found');
    }
  };

  const handleCashDrawer = () => {
    // Simulate opening cash drawer
    toast.info('Cash drawer management initiated', {
      description: 'Perform cash-related operations like float count, cash-in/out, etc.'
    });
  };

  const handlePrintOrder = () => {
    if (!currentOrder || currentOrder.items.length === 0) {
      toast.error('No order to print');
      return;
    }
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Unable to open print window');
      return;
    }

    // Add necessary styles and content
    printWindow.document.write(`
      <html>
        <head>
          <title>Order #${currentOrder.orderNumber}</title>
          <style>
            @media print {
              body { margin: 0; padding: 0; }
              .print-only { display: block; }
            }
            @page {
              margin: 0;
              size: ${settings.receiptWidth}mm auto;
            }
          </style>
        </head>
        <body>
    `);

    // Render the receipt component into the print window
    const receiptContainer = document.createElement('div');
    printWindow.document.body.appendChild(receiptContainer);

    const root = ReactDOM.createRoot(receiptContainer);
    root.render(<OrderReceipt order={currentOrder} settings={settings} />);

    // Wait for images to load before printing
    setTimeout(() => {
      printWindow.print();
      // Close the window after printing (optional)
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    }, 500);

    toast.success('Order sent to printer', {
      description: `Order #${currentOrder.orderNumber} is being printed`
    });
  };

  const handleCloseOrder = () => {
    if (!currentOrder || currentOrder.items.length === 0) {
      toast.error('No active order to close');
      return;
    }
    
    onOrderComplete();
    toast.success('Order completed and closed', {
      description: `Order #${currentOrder.orderNumber} has been processed`
    });
  };

  return (
    <main className="flex h-full overflow-hidden">
      {/* Left Side - Order and Controls */}
      <div className={`${isMobile ? 'w-full' : 'w-3/5'} p-4 border-r flex flex-col`}>
        {/* Top Controls */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Input
              placeholder="باركود المنتج..."
              className="pl-10"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchByBarcode();
                }
              }}
            />
            <Barcode className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
          <Button variant="outline" size="icon" onClick={handleSearchByBarcode}>
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Current Order Display */}
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
          <Button 
            variant="outline" 
            className="flex gap-2" 
            onClick={onCancelOrder}
          >
            <Trash2 className="h-5 w-5" />
            إلغاء الطلب
          </Button>
          <Button 
            variant="outline" 
            className="flex gap-2"
            onClick={handleCashDrawer}
          >
            <Receipt className="h-5 w-5" />
            الصندوق
          </Button>
          <Button 
            variant="outline" 
            className="flex gap-2"
            onClick={handlePrintOrder}
          >
            <Printer className="h-5 w-5" />
            طباعة
          </Button>
          <Button 
            variant="outline" 
            className="flex gap-2"
            onClick={handleCloseOrder}
          >
            <X className="h-5 w-5" />
            إغلاق
          </Button>
        </div>

        {/* Numpad */}
        <div className="mt-4">
          <Numpad onNumberClick={handleNumpadClick} onClear={handleNumpadClear} />
        </div>
      </div>

      {/* Products Grid */}
      <div className={`${isMobile ? 'hidden' : 'w-2/5'} p-4`}>
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
