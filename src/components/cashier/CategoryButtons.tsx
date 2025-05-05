
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
  // Updated with more Arabic category names from the image
  const categories = [
    { id: 'croissant', name: 'منتجات كرواسون' },
    { id: 'coffee', name: 'منتجات كيفة' },
    { id: 'arabic_sweets', name: 'منتجات حلو عربي' },
    { id: 'baklava', name: 'منتجات بقلاوة' },
    { id: 'maamoul', name: 'منتجات معمول' },
    { id: 'regular_products', name: 'منتجات معمول' },
    { id: 'frozen', name: 'منتجات مفروكة ومدلوقة' },
    { id: 'desserts', name: 'معجنات / سنبورة / ...' },
    { id: 'cake_cups', name: 'منتجات قوالب كيك' },
    { id: 'cake_slice', name: 'منتجات قطع كيك' },
    { id: 'food', name: 'منتجات سنكي فود' },
    { id: 'chocolate', name: 'منتجات شوكولا' },
    { id: 'bowl', name: 'منتجات كاسة مشكلة' },
    { id: 'jar', name: 'منتجات برطمان' },
    { id: 'drinks', name: 'منتجات مشروبات' },
    { id: 'ramadan', name: 'منتجات رمضانيات' },
    { id: 'ready', name: 'منتجات جاهزة للبيع' },
    { id: 'mixed', name: 'منتجات مختلف' },
    { id: 'bags', name: 'منتجات باعبيت' },
    { id: 'cheese', name: 'منتجات أجبان وألبان' },
    { id: 'knafeh', name: 'منتجات معجنات' },
    { id: 'crepes', name: 'منتجات كريب / وافل / بانكيك' },
    { id: 'salads', name: 'منتجات سلطات' },
    { id: 'desserts2', name: 'منتجات معجنات' },
  ];

  return (
    <div className="grid grid-cols-5 gap-1">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant="outline"
          className={`flex items-center justify-center py-3 rounded-md text-right h-auto ${
            selectedCategory === category.id 
              ? 'bg-amber-500 text-black border-amber-700' 
              : 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700'
          }`}
          onClick={() => onSelectCategory(category.id)}
        >
          <span className="text-sm text-right">{category.name}</span>
        </Button>
      ))}
    </div>
  );
};
