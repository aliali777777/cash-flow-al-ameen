
import React from 'react';
import { Button } from '@/components/ui/button';

interface CategoryButtonsProps {
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

export const CategoryButtons: React.FC<CategoryButtonsProps> = ({
  onSelectCategory,
  selectedCategory
}) => {
  const categories = [
    { id: 'burger', name: 'Burger', icon: '🍔' },
    { id: 'pizza', name: 'Pizza', icon: '🍕' },
    { id: 'fries', name: 'Fries', icon: '🍟' },
    { id: 'drinks', name: 'Drinks', icon: '🥤' },
    { id: 'main', name: 'Main', icon: '🍽️' },
    { id: 'sides', name: 'Sides', icon: '🧁' },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant="outline"
          className={`flex flex-col items-center justify-center py-3 rounded-lg ${
            selectedCategory === category.id 
              ? 'bg-pos-gold/10 text-pos-gold border-pos-gold/50' 
              : 'bg-pos-darkgray text-pos-gold border-gray-800 hover:bg-pos-lightgray'
          }`}
          onClick={() => onSelectCategory(category.id)}
        >
          <span className="text-2xl mb-1">{category.icon}</span>
          <span className="text-base">{category.name}</span>
        </Button>
      ))}
    </div>
  );
};
