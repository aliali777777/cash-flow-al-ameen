
import React from 'react';
import { Button } from '@/components/ui/button';

interface NumpadProps {
  onNumberClick: (num: number) => void;
  onClear: () => void;
}

export const Numpad: React.FC<NumpadProps> = ({ onNumberClick, onClear }) => {
  return (
    <div className="grid grid-cols-3 gap-1 p-2 max-w-[180px] mx-auto">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <Button
          key={num}
          variant="outline"
          size="sm"
          className="h-9 w-9"
          onClick={() => onNumberClick(num)}
        >
          {num}
        </Button>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="h-9 w-9"
        onClick={onClear}
      >
        C
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-9 w-9"
        onClick={() => onNumberClick(0)}
      >
        0
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-9 w-9"
        onClick={() => onNumberClick(-1)}
      >
        -
      </Button>
    </div>
  );
};
