
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Dot } from 'lucide-react';

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
    <div className="grid grid-cols-4 gap-2">
      {/* Top row */}
      <Button
        variant="outline"
        className="aspect-square h-14 text-xl font-bold bg-black text-white border-gray-800 hover:bg-gray-900"
        onClick={() => onNumberClick(1)}
      >
        1
      </Button>
      <Button
        variant="outline"
        className="aspect-square h-14 text-xl font-bold bg-black text-white border-gray-800 hover:bg-gray-900"
        onClick={() => onNumberClick(3)}
      >
        3
      </Button>
      <Button
        variant="outline"
        className="aspect-square h-14 text-xl font-bold bg-black text-white border-gray-800 hover:bg-gray-900"
        onClick={() => onNumberClick(3)}
      >
        3
      </Button>
      <Button
        variant="outline"
        className="aspect-square h-14 text-xl font-bold bg-black text-white border-gray-800 hover:bg-gray-900"
        onClick={() => onNumberClick(6)}
      >
        6
      </Button>

      {/* Second row */}
      <Button
        variant="outline"
        className="aspect-square h-14 text-xl font-bold bg-black text-white border-gray-800 hover:bg-gray-900"
        onClick={() => onNumberClick(4)}
      >
        4
      </Button>
      <Button
        variant="outline"
        className="aspect-square h-14 text-xl font-bold bg-black text-white border-gray-800 hover:bg-gray-900"
        onClick={() => onNumberClick(5)}
      >
        5
      </Button>
      <Button
        variant="outline"
        className="aspect-square h-14 text-xl font-bold bg-black text-white border-gray-800 hover:bg-gray-900"
        onClick={() => onNumberClick(6)}
      >
        6
      </Button>
      <Button
        variant="outline"
        className="aspect-square h-14 text-xl font-bold bg-black text-white border-gray-800 hover:bg-gray-900"
        onClick={onClear}
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Third row */}
      <Button
        variant="outline"
        className="aspect-square h-14 text-xl font-bold bg-black text-white border-gray-800 hover:bg-gray-900"
        onClick={() => onNumberClick(7)}
      >
        7
      </Button>
      <Button
        variant="outline"
        className="aspect-square h-14 text-xl font-bold bg-black text-white border-gray-800 hover:bg-gray-900"
        onClick={() => onNumberClick(8)}
      >
        8
      </Button>
      <Button
        variant="outline"
        className="aspect-square h-14 text-xl font-bold bg-black text-white border-gray-800 hover:bg-gray-900"
        onClick={() => onNumberClick(9)}
      >
        9
      </Button>
      <Button
        variant="outline"
        className="aspect-square h-14 text-xl font-bold bg-black text-white border-gray-800 hover:bg-gray-900 invisible"
      >
        
      </Button>

      {/* Fourth row */}
      <Button
        variant="outline"
        className="aspect-square h-14 text-xl font-bold bg-black text-white border-gray-800 hover:bg-gray-900"
        onClick={() => onNumberClick(0)}
      >
        0
      </Button>
      <Button
        variant="outline"
        className="aspect-square h-14 text-xl font-bold bg-black text-white border-gray-800 hover:bg-gray-900"
        onClick={onDot}
      >
        .
      </Button>
      <Button
        variant="outline"
        className="aspect-square h-14 text-xl font-bold bg-black text-white border-gray-800 hover:bg-gray-900 invisible"
      >
        
      </Button>
      <Button
        variant="outline"
        className="aspect-square h-14 text-xl font-bold bg-black text-white border-gray-800 hover:bg-gray-900 invisible"
      >
        
      </Button>
    </div>
  );
};
