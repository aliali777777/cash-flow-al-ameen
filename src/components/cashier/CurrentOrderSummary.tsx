
import React, { useState } from 'react';
import { Order, OrderItem as OrderItemType, Settings } from '@/types';
import { OrderItemRow } from './OrderItem';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface CurrentOrderSummaryProps {
  order: Order | null;
  settings: Settings;
  onAddNote: (productId: string, note: string) => void;
  onRemoveItem: (productId: string) => void;
  calculateOrderTotal: () => number;
  calculateOrderDiscount: () => number;
  calculateFinalAmount: () => number;
}

export const CurrentOrderSummary: React.FC<CurrentOrderSummaryProps> = ({
  order,
  settings,
  onAddNote,
  onRemoveItem,
  calculateOrderTotal,
  calculateOrderDiscount,
  calculateFinalAmount,
}) => {
  const [selectedItem, setSelectedItem] = useState<OrderItemType | null>(null);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState('');

  const handleAddNote = () => {
    if (selectedItem && noteText.trim()) {
      onAddNote(selectedItem.productId, noteText);
      setNoteDialogOpen(false);
      setNoteText('');
    }
  };

  if (!order) return null;

  return (
    <div className="flex flex-col h-full bg-pos-dark rounded-lg p-4 overflow-hidden">
      {/* Order Items */}
      <div className="flex-1 overflow-y-auto mb-4 divide-y divide-pos-lightgray/30">
        {order.items.length > 0 ? (
          order.items.map((item) => (
            <OrderItemRow 
              key={item.productId}
              item={item}
              settings={settings}
              onSelect={setSelectedItem}
              isSelected={selectedItem?.productId === item.productId}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-pos-gold/50">
            لا توجد منتجات في الطلب
          </div>
        )}
      </div>

      {/* Discount Row */}
      {calculateOrderDiscount() > 0 && (
        <div className="flex justify-between text-xl py-2">
          <span className="text-pos-gold">Discount</span>
          <span className="text-pos-gold">-{settings.currencySymbol}{calculateOrderDiscount().toFixed(2)}</span>
        </div>
      )}

      {/* Add Note Button */}
      {selectedItem && (
        <Button 
          variant="ghost" 
          className="text-pos-gold hover:text-amber-400 justify-start px-0 py-2"
          onClick={() => setNoteDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      )}

      {/* Total */}
      <div className="flex justify-between items-center border-t border-pos-lightgray/30 pt-4 mt-auto">
        <span className="text-2xl font-bold text-pos-gold">Total</span>
        <span className="text-2xl font-bold text-pos-gold">{settings.currencySymbol}{calculateFinalAmount().toFixed(2)}</span>
      </div>

      {/* Note Dialog */}
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent className="bg-pos-darkgray border-pos-lightgray">
          <DialogHeader>
            <DialogTitle className="text-pos-gold">إضافة ملاحظة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="note" className="text-pos-gold">الملاحظة</Label>
              <Input
                id="note"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="أضف ملاحظتك هنا..."
                className="bg-pos-dark text-pos-gold border-pos-lightgray"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button 
              onClick={handleAddNote}
              className="bg-pos-gold text-pos-dark hover:bg-amber-500"
            >
              إضافة
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
