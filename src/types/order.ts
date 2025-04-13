
import { Product } from './product';

export type OrderStatus = 'pending' | 'completed' | 'canceled';
export type PaymentMethod = 'cash' | 'card' | 'mobile';
export type KitchenOrderStatus = 'new' | 'in-progress' | 'ready' | 'delivered';

export interface OrderModifier {
  id: string;
  name: string;
  price: number;
}

export interface OrderItem {
  productId: string;
  product: Product;
  quantity: number;
  notes?: string;
  modifiers?: OrderModifier[];
}

export interface DiscountFixed {
  type: 'fixed';
  value: number;
}

export interface DiscountPercentage {
  type: 'percentage';
  value: number;
}

export type Discount = DiscountFixed | DiscountPercentage;

export interface Order {
  id: string;
  orderNumber: number;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  customerName?: string;
  notes?: string;
  cashierId: string;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  kitchenStatus: KitchenOrderStatus;
  discount?: Discount;
  estimatedCompletionTime?: Date;
}
