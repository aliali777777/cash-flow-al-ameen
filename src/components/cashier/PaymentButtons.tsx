
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, CirclePercent, CircleDollarSign, StickyNote, Printer } from 'lucide-react';

interface PaymentButtonsProps {
  onClearAll: () => void;
  onDiscount: () => void;
  onDeleteItem: () => void;
  onCashPayment: () => void;
  onAddItem: () => void;
  onAddNote: () => void;
  selectedItemExists: boolean;
}

export const PaymentButtons: React.FC<PaymentButtonsProps> = ({ 
  onClearAll, 
  onDiscount, 
  onDeleteItem,
  onCashPayment,
  onAddItem,
  onAddNote,
  selectedItemExists 
}) => {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          className="bg-black text-pos-gold border-pos-gold/30 hover:bg-black/90 h-14 rounded-xl"
          onClick={onClearAll}
        >
          <span className="text-lg">Clear All</span>
        </Button>
        <Button 
          variant="outline" 
          className="bg-black text-pos-gold border-pos-gold/30 hover:bg-black/90 h-14 rounded-xl"
          onClick={onDiscount}
        >
          <span className="text-lg">Discount</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          className="bg-black text-pos-gold border-pos-gold/30 hover:bg-black/90 h-14 rounded-xl"
          onClick={onDeleteItem}
          disabled={!selectedItemExists}
        >
          <span className="text-pos-gold mr-2">🔒</span>
          <span className="text-lg">Delete</span>
        </Button>
        <Button 
          variant="outline" 
          className="bg-black text-pos-gold border-pos-gold/30 hover:bg-black/90 h-14 rounded-xl"
          onClick={onAddItem}
          disabled={!selectedItemExists}
        >
          <span className="text-pos-gold mr-2">🧺</span>
          <span className="text-lg">Item</span>
        </Button>
      </div>
      
      <Button 
        variant="default" 
        className="w-full bg-pos-gold text-black hover:bg-pos-gold/90 h-16 rounded-xl flex items-center justify-center"
        onClick={onCashPayment}
      >
        <span className="text-xl font-bold">Cash</span>
        <span className="text-lg">&nbsp;& print</span>
        <Printer className="h-5 w-5 ml-2" />
      </Button>
    </div>
  );
};
