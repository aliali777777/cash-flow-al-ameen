
// Product categories
export type ProductCategory = string;

// Product interface
export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  category: string;
  price: number;
  cost: number;
  image?: string;
  description?: string;
  isAvailable: boolean;
}
