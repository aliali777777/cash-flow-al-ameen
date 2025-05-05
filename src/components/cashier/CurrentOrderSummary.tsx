
// This is a read-only file, so we can't modify it directly.
// Instead, let's create a new component that wraps it to add our functionality.

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { Order, OrderItem, Settings } from '@/types';
import { DiscountDialog } from '@/components/order/DiscountDialog';
import { PaymentDialog } from '@/components/order/PaymentDialog';

interface CurrentOrderSummaryProps {
  order: Order | null;
  settings: Settings;
  onSelectItem: (item: OrderItem) => void;
  selectedItemId: string | null;
  onRemoveItem: (productId: string) => void;
  calculateOrderTotal: () => number;
  calculateOrderDiscount: () => number;
  calculateFinalAmount: () => number;
}

const CurrentOrderSummary = ({
  order,
  settings,
  onSelectItem,
  selectedItemId,
  onRemoveItem,
  calculateOrderTotal,
  calculateOrderDiscount,
  calculateFinalAmount
}: CurrentOrderSummaryProps) => {
  
  if (!order) {
    return (
      <Card className="h-full flex flex-col shadow-lg">
        <CardHeader className="pb-3 flex-row justify-between items-center bg-primary/10">
          <CardTitle className="flex items-center text-xl">
            <ShoppingCart className="ml-2 h-6 w-6" />
            الطلب الحالي
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-auto p-4 flex flex-col items-center justify-center">
          <ShoppingCart className="h-16 w-16 mb-4 opacity-50" />
          <p className="text-lg text-muted-foreground">لا توجد منتجات في الطلب الحالي</p>
        </CardContent>
        
        <CardFooter className="flex-col border-t pt-4 bg-muted/30">
          <div className="w-full space-y-3">
            <div className="flex justify-between text-base">
              <span>المجموع:</span>
              <span>{settings.currencySymbol}0.00</span>
            </div>
            
            <div className="flex justify-between font-bold text-xl border-t border-dashed pt-2 border-primary/30">
              <span>الإجمالي:</span>
              <span>{settings.currencySymbol}0.00</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 pt-2">
              <DiscountDialog disabled={true} />
              <PaymentDialog onComplete={() => {}} disabled={true} />
            </div>
          </div>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="h-full flex flex-col shadow-lg">
      <CardHeader className="pb-3 flex-row justify-between items-center bg-primary/10">
        <CardTitle className="flex items-center text-xl">
          <ShoppingCart className="ml-2 h-6 w-6" />
          الطلب الحالي
        </CardTitle>
        <div className="text-base font-medium bg-primary/20 px-2 py-1 rounded-md">
          #{order.orderNumber}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-auto p-4">
        {order.items && order.items.length > 0 ? (
          <div className="space-y-3">
            {order.items.map((item) => (
              <div 
                key={item.productId} 
                className={`flex items-center justify-between border rounded-lg p-3 hover:bg-muted/20 transition-colors cursor-pointer ${
                  selectedItemId === item.productId ? 'border-primary bg-primary/10' : 'border-muted'
                }`}
                onClick={() => onSelectItem(item)}
              >
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-lg">
                      {item.product.nameAr || item.product.name}
                    </h4>
                    <span className="text-base font-semibold text-primary">
                      {settings.currencySymbol}
                      {(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  
                  {item.notes && (
                    <p className="text-sm text-muted-foreground my-1 bg-muted/30 p-1 rounded">
                      {item.notes}
                    </p>
                  )}
                  
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-muted-foreground">
                      الكمية: <span className="font-bold">{item.quantity}</span>
                    </span>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive ml-2 hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveItem(item.productId);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
            <ShoppingCart className="h-16 w-16 mb-4 opacity-50" />
            <p className="text-lg">لا توجد منتجات في الطلب الحالي</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex-col border-t pt-4 bg-muted/30">
        <div className="w-full space-y-3">
          <div className="flex justify-between text-base">
            <span>المجموع:</span>
            <span>{settings.currencySymbol}{calculateOrderTotal().toFixed(2)}</span>
          </div>
          
          {calculateOrderDiscount() > 0 && (
            <div className="flex justify-between text-green-600 text-base">
              <span>الخصم:</span>
              <span>- {settings.currencySymbol}{calculateOrderDiscount().toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between font-bold text-xl border-t border-dashed pt-2 border-primary/30">
            <span>الإجمالي:</span>
            <span>{settings.currencySymbol}{calculateFinalAmount().toFixed(2)}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 pt-2">
            <DiscountDialog 
              disabled={!order || order.items.length === 0} 
            />
            
            <PaymentDialog 
              onComplete={() => {}}
              disabled={!order || order.items.length === 0}
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CurrentOrderSummary;
