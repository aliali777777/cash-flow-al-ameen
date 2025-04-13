
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Order, Settings } from '@/types';
import { CurrentOrder } from './CurrentOrder';

interface MobileOrderTabsProps {
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

export const MobileOrderTabs = ({
  order,
  settings,
  onCancelOrder,
  onQuantityChange,
  onRemoveItem,
  calculateOrderTotal,
  calculateOrderDiscount,
  calculateFinalAmount,
  onOrderComplete
}: MobileOrderTabsProps) => {
  return (
    <div className="lg:hidden">
      <Tabs defaultValue="products">
        <TabsList className="w-full">
          <TabsTrigger value="products" className="flex-1">المنتجات</TabsTrigger>
          <TabsTrigger value="order" className="flex-1">
            الطلب
            {order?.items.length ? (
              <Badge className="ml-2" variant="secondary">
                {order.items.length}
              </Badge>
            ) : null}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          {/* Product content is already shown outside tabs on mobile */}
        </TabsContent>
        
        <TabsContent value="order">
          <CurrentOrder
            order={order}
            settings={settings}
            onCancelOrder={onCancelOrder}
            onQuantityChange={onQuantityChange}
            onRemoveItem={onRemoveItem}
            calculateOrderTotal={calculateOrderTotal}
            calculateOrderDiscount={calculateOrderDiscount}
            calculateFinalAmount={calculateFinalAmount}
            onOrderComplete={onOrderComplete}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
