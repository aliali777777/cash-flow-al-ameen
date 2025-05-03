
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Dot, MinusIcon, Trash2, Delete } from 'lucide-react';

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
    <div className="grid grid-cols-3 gap-2">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
        <Button
          key={num}
          variant="ghost"
          className="number-pad-button"
          onClick={() => onNumberClick(num)}
        >
          {num}
        </Button>
      ))}
      <Button
        variant="ghost"
        className="number-pad-button"
        onClick={onDot}
      >
        <Dot className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        className="number-pad-button"
        onClick={onClear}
      >
        <X className="h-6 w-6" />
      </Button>
    </div>
  );
};
