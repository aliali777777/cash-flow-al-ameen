
import React from 'react';
import { Button } from '@/components/ui/button';
import { Receipt, Trash2, CirclePercent, ArrowRight, CircleDollarSign } from 'lucide-react';

interface PaymentButtonsProps {
  onClearAll: () => void;
  onDiscount: () => void;
  onDeleteItem: () => void;
  onCashPayment: () => void;
  onCardPayment: () => void;
  selectedItemExists: boolean;
}

export const PaymentButtons: React.FC<PaymentButtonsProps> = ({ 
  onClearAll, 
  onDiscount, 
  onDeleteItem,
  onCashPayment,
  onCardPayment,
  selectedItemExists 
}) => {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="ghost" 
          className="pos-action-button"
          onClick={onClearAll}
        >
          <span className="text-lg">Clear All</span>
        </Button>
        <Button 
          variant="ghost" 
          className="pos-action-button"
          onClick={onDiscount}
        >
          <span className="text-lg">Discount</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="ghost" 
          className="pos-action-button"
          onClick={onDeleteItem}
          disabled={!selectedItemExists}
        >
          <Trash2 className="h-5 w-5 mr-2" />
          <span className="text-lg">Delete</span>
        </Button>
        <Button 
          variant="ghost" 
          className="pos-action-button"
        >
          <Receipt className="h-5 w-5 mr-2" />
          <span className="text-lg">Item</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="ghost" 
          className="pos-primary-button col-span-2"
          onClick={onCashPayment}
        >
          <CircleDollarSign className="h-5 w-5 mr-2" />
          <span className="text-lg">Cash</span>
          <ArrowRight className="h-5 w-5 ml-auto" />
        </Button>
      </div>
    </div>
  );
};
