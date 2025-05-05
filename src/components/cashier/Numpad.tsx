
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Dot, Trash2 } from 'lucide-react';

interface NumpadProps {
  onNumberClick: (num: number) => void;
  onClear: () => void;
  onDelete?: () => void;
  onDot?: () => void;
}

export const Numpad: React.FC<NumpadProps> = ({ 
  onNumberClick, 
  onClear, 
  onDelete,
  onDot
}) => {
  return (
    <div className="grid grid-cols-3 gap-2 bg-muted/30 p-4 rounded-lg shadow-inner">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <Button
          key={num}
          variant="outline"
          className="h-14 text-xl font-bold"
          onClick={() => onNumberClick(num)}
        >
          {num}
        </Button>
      ))}
      <Button
        variant="outline"
        className="h-14 text-xl font-bold"
        onClick={onDelete}
      >
        <Trash2 className="h-6 w-6" />
      </Button>
      <Button
        variant="outline"
        className="h-14 text-xl font-bold"
        onClick={() => onNumberClick(0)}
      >
        0
      </Button>
      <Button
        variant="outline"
        className="h-14 text-xl font-bold"
        onClick={onClear}
      >
        <X className="h-6 w-6" />
      </Button>
    </div>
  );
};
