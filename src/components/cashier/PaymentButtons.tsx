
import React from 'react';
import { Button } from '@/components/ui/button';
import { Receipt, Trash2, CirclePercent, ArrowRight, CircleDollarSign, CreditCard, Wallet, Plus, NoteIcon } from 'lucide-react';

interface PaymentButtonsProps {
  onClearAll: () => void;
  onDiscount: () => void;
  onDeleteItem: () => void;
  onCashPayment: () => void;
  onCardPayment: () => void;
  onAddNote: () => void;
  selectedItemExists: boolean;
}

export const PaymentButtons: React.FC<PaymentButtonsProps> = ({ 
  onClearAll, 
  onDiscount, 
  onDeleteItem,
  onCashPayment,
  onCardPayment,
  onAddNote,
  selectedItemExists 
}) => {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          className="bg-red-500/10 hover:bg-red-500/20 h-14"
          onClick={onClearAll}
        >
          <Trash2 className="h-5 w-5 mr-2" />
          <span className="text-lg">Clear All</span>
        </Button>
        <Button 
          variant="outline" 
          className="bg-amber-500/10 hover:bg-amber-500/20 h-14"
          onClick={onDiscount}
        >
          <CirclePercent className="h-5 w-5 mr-2" />
          <span className="text-lg">Discount</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          className="bg-blue-500/10 hover:bg-blue-500/20 h-14"
          onClick={onDeleteItem}
          disabled={!selectedItemExists}
        >
          <Trash2 className="h-5 w-5 mr-2" />
          <span className="text-lg">Delete Item</span>
        </Button>
        <Button 
          variant="outline" 
          className="bg-green-500/10 hover:bg-green-500/20 h-14"
          onClick={onAddNote}
          disabled={!selectedItemExists}
        >
          <NoteIcon className="h-5 w-5 mr-2" />
          <span className="text-lg">Add Note</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          className="bg-emerald-500/10 hover:bg-emerald-500/20 h-14"
          onClick={onCashPayment}
        >
          <CircleDollarSign className="h-5 w-5 mr-2" />
          <span className="text-lg">Cash</span>
        </Button>
        <Button 
          variant="outline" 
          className="bg-purple-500/10 hover:bg-purple-500/20 h-14"
          onClick={onCardPayment}
        >
          <CreditCard className="h-5 w-5 mr-2" />
          <span className="text-lg">Card</span>
        </Button>
      </div>
    </div>
  );
};
