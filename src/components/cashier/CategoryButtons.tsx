
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pizza, CircleDollarSign, CupSoda, 
         Dessert, CircleX, Trash2, CirclePercent } from 'lucide-react';

interface CategoryButtonsProps {
  onSelectCategory: (category: string) => void;
  onClearAll: () => void;
  onDiscount: () => void;
  selectedCategory: string;
}

// Custom icon for burger
const BurgerIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M3 11h18" />
    <path d="M3 16h18" />
    <path d="M3 6h18" />
  </svg>
);

// Custom icon for fries
const FriesIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M19 5H5l7 14Z" />
    <path d="M12 19H5l-4-8h12" />
    <path d="M15 3v16" />
    <path d="M18 7v12" />
    <path d="M10.85 7h5.15" />
  </svg>
);

// Custom icon for main dishes
const MainIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M17 10c0 3.314-2.69 4-6 4s-6-.686-6-4c0-1.854 1.546-5 6-5s6 3.146 6 5Z" />
    <path d="M13.62 15h-3.24l-1 4h5.238Z" />
  </svg>
);

// Custom icon for sides
const SidesIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
    <path d="M7 7h.01" />
  </svg>
);

export const CategoryButtons: React.FC<CategoryButtonsProps> = ({
  onSelectCategory,
  onClearAll,
  onDiscount,
  selectedCategory
}) => {
  const categories = [
    { id: 'burger', name: 'Burger', icon: <BurgerIcon /> },
    { id: 'pizza', name: 'Pizza', icon: <Pizza className="h-6 w-6" /> },
    { id: 'fries', name: 'Fries', icon: <FriesIcon /> },
    { id: 'clear', name: 'Clear All', icon: <CircleX className="h-6 w-6" />, action: onClearAll },
    { id: 'drinks', name: 'Drinks', icon: <CupSoda className="h-6 w-6" /> },
    { id: 'main', name: 'Main', icon: <MainIcon /> },
    { id: 'sides', name: 'Sides', icon: <SidesIcon /> },
    { id: 'discount', name: 'Discount', icon: <CirclePercent className="h-6 w-6" />, action: onDiscount }
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id && !category.action ? "default" : "outline"}
          className={`flex flex-col items-center justify-center p-2 h-20 ${
            selectedCategory === category.id && !category.action ? 'bg-primary text-primary-foreground' : 'bg-muted/30'
          }`}
          onClick={() => {
            if (category.action) {
              category.action();
            } else {
              onSelectCategory(category.id);
            }
          }}
        >
          {category.icon}
          <span className="text-sm mt-1">{category.name}</span>
        </Button>
      ))}
    </div>
  );
};
