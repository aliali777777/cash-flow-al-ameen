
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Order, OrderItem, Settings } from '@/types';

interface CurrentOrderSummaryProps {
  order: Order | null;
  settings: Settings;
  onSelectItem: (item: OrderItem) => void;
  selectedItemId: string | null;
  onRemoveItem: (productId: string) => void;
  calculateOrderTotal: () => number;
  calculateOrderDiscount: () => number;
  calculateFinalAmount: () => number;
  onAddNote: () => void;
}

const CurrentOrderSummary = ({
  order,
  settings,
  onSelectItem,
  selectedItemId,
  onRemoveItem,
  calculateOrderTotal,
  calculateOrderDiscount,
  calculateFinalAmount,
  onAddNote
}: CurrentOrderSummaryProps) => {
  
  if (!order) {
    return (
      <Card className="h-full flex flex-col shadow-lg bg-black border-gray-800 rounded-3xl">
        <CardHeader className="text-center pt-6">
          <h1 className="text-3xl font-bold text-pos-gold">SHIWOW</h1>
          <p className="text-white/60">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-auto p-4">
          <div className="text-center text-gray-500 mt-10">
            <p>No items added yet</p>
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-4 border-gray-800">
          <div className="w-full">
            <div className="flex justify-between text-xl text-pos-gold font-bold mt-2">
              <span>Total</span>
              <span>{settings.currencySymbol}0.00</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="h-full flex flex-col shadow-lg bg-black border-gray-800 rounded-3xl">
      <CardHeader className="text-center pt-6">
        <h1 className="text-3xl font-bold text-pos-gold">SHIWOW</h1>
        <p className="text-white/60">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-auto p-4">
        {order.items && order.items.length > 0 ? (
          <div className="space-y-3">
            {order.items.map((item) => (
              <div 
                key={item.productId} 
                className={`cursor-pointer ${
                  selectedItemId === item.productId ? 'border-b border-pos-gold' : 'border-b border-gray-800'
                }`}
                onClick={() => onSelectItem(item)}
              >
                <div className="py-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <span className="text-pos-gold text-xl mr-2">{item.quantity}</span>
                      <h3 className="text-pos-gold text-xl">
                        {item.product.nameAr || item.product.name}
                      </h3>
                    </div>
                    <span className="text-pos-gold text-xl">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  
                  {item.notes && (
                    <p className="text-gray-400 pl-6 mt-1">
                      {item.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-10">
            <p>No items added yet</p>
          </div>
        )}
        
        {calculateOrderDiscount() > 0 && (
          <div className="flex justify-between text-pos-gold mt-4 border-t border-gray-800 pt-4">
            <span>Discount</span>
            <span>-${calculateOrderDiscount().toFixed(2)}</span>
          </div>
        )}
        
        {selectedItemId && (
          <div className="mt-4 border-t border-gray-800 pt-4">
            <Button 
              variant="ghost" 
              className="text-pos-gold hover:text-pos-gold/80 p-0"
              onClick={onAddNote}
            >
              + Add Note
            </Button>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-4 border-gray-800">
        <div className="w-full">
          <div className="flex justify-between text-xl text-pos-gold font-bold mt-2">
            <span>Total</span>
            <span>${calculateFinalAmount().toFixed(2)}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CurrentOrderSummary;
