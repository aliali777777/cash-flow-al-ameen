
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, X, Plus, Minus, Trash } from 'lucide-react';
import { Settings, type Order, type OrderItem } from '@/types';
import { PaymentDialog } from '@/components/order/PaymentDialog';
import { DiscountDialog } from '@/components/order/DiscountDialog';

interface CurrentOrderProps {
  order: Order | null;
  settings: Settings;
  onCancelOrder: () => void;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  calculateOrderTotal: () => number;
  calculateOrderDiscount: () => number;
  calculateFinalAmount: () => number;
  onOrderComplete: () => void;
}

export const CurrentOrder = ({
  order,
  settings,
  onCancelOrder,
  onQuantityChange,
  onRemoveItem,
  calculateOrderTotal,
  calculateOrderDiscount,
  calculateFinalAmount,
  onOrderComplete
}: CurrentOrderProps) => {
  if (!order) return null;
  
  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader className="pb-3 flex-row justify-between items-center">
        <CardTitle className="flex items-center">
          <ShoppingCart className="ml-2 h-5 w-5" />
          الطلب الحالي
        </CardTitle>
        <div className="flex items-center">
          <span className="text-sm font-medium ml-1">#{order.orderNumber}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={onCancelOrder}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-auto">
        {order.items && order.items.length > 0 ? (
          <div className="space-y-4">
            {order.items.map((item) => (
              <OrderItem 
                key={item.productId} 
                item={item} 
                settings={settings}
                onQuantityChange={onQuantityChange}
                onRemoveItem={onRemoveItem}
              />
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
              disabled={!order || order.items.length === 0} 
            />
            
            <PaymentDialog 
              onComplete={onOrderComplete}
              disabled={!order || order.items.length === 0}
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

interface OrderItemProps {
  item: OrderItem;
  settings: Settings;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

const OrderItem = ({ item, settings, onQuantityChange, onRemoveItem }: OrderItemProps) => {
  return (
    <div className="flex items-center justify-between border-b pb-2">
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
            onClick={() => onQuantityChange(item.productId, item.quantity - 1)}
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
            onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => onRemoveItem(item.productId)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
